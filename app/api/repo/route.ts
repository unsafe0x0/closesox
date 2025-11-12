import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const getOwnerRepo = (url: string) => {
      const match = url.match(
        /github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/,
      );
      if (!match) return null;
      return { owner: match[1], repo: match[2] };
    };

    const repos = await Promise.all(
      urls.map(async (url: string) => {
        const info = getOwnerRepo(url);
        if (!info) return null;

        try {
          const headers: Record<string, string> = {
            Accept: "application/vnd.github+json",
          };

          const token = process.env.GITHUB_TOKEN;
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }

          const res = await fetch(
            `https://api.github.com/repos/${info.owner}/${info.repo}`,
            { headers },
          );

          if (!res.ok) return null;
          return res.json();
        } catch {
          return null;
        }
      }),
    );

    return NextResponse.json({ repos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
