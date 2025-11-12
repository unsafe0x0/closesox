import { NextResponse, NextRequest } from "next/server";
import { queryCache } from "@/lib/cache";

const GITHUB_API = "https://api.github.com/search/repositories";

function buildQuery(language: string, stars: string, issues: string) {
  let query = "is:public";
  if (language && language !== "Any") {
    query += ` language:${language}`;
  }
  if (stars && stars !== "Any") {
    query += ` stars:${stars.replace(/\s/g, "")}`;
  }
  if (issues && issues !== "Any") {
    if (issues.startsWith("<")) {
      query += ` issues:<${issues.replace(/\D/g, "")}`;
    } else if (issues.startsWith(">")) {
      query += ` issues:>${issues.replace(/\D/g, "")}`;
    } else {
      query += ` issues:${issues.replace(/\D/g, "")}`;
    }
  }
  return query.trim();
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language") || "Any";
  const stars = searchParams.get("stars") || "Any";
  const issues = searchParams.get("issues") || "Any";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 50;

  const cacheKey = queryCache.getCacheKey(language, stars, issues, page);
  const cachedData = queryCache.get(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  const q = buildQuery(language, stars, issues);
  const url = `${GITHUB_API}?q=${encodeURIComponent(
    q,
  )}&sort=stars&order=desc&per_page=${limit}&page=${page}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${process.env.GITHUB_TOKEN || ""}`,
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    return NextResponse.json(
      { repos: [], error: "Failed to fetch from GitHub" },
      { status: 500 },
    );
  }
  const data = await res.json();
  const remaining = res.headers.get("x-ratelimit-remaining") || "unknown";

  const repos = await Promise.all(
    (data.items || []).map(async (r: any) => {
      let lastCommitDate = "";
      try {
        const commitsRes = await fetch(
          `https://api.github.com/repos/${r.owner.login}/${r.name}/commits?per_page=1`,
          {
            headers: { Accept: "application/vnd.github+json" },
          },
        );
        if (commitsRes.ok) {
          const commits = await commitsRes.json();
          if (commits && commits.length > 0) {
            lastCommitDate = formatDate(commits[0].commit.committer.date);
          }
        }
      } catch {}
      return {
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
        owner: r.owner?.login,
        issues: r.open_issues_count,
        lastActivity: lastCommitDate || formatDate(r.updated_at),
      };
    }),
  );

  const response = {
    repos,
    total: data.total_count,
    page,
    hasMore: page * limit < data.total_count,
    remaining: parseInt(remaining) || 0,
  };

  queryCache.set(cacheKey, response, 5 * 60 * 1000);

  return NextResponse.json(response);
}
