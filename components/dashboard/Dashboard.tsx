import React from "react";
import RepoCard from "../RepoCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import Link from "next/link";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const bookmarks = data?.data?.savedRepos || [];

  const { data: reposData, isLoading: reposLoading } = useQuery({
    queryKey: [
      "repos",
      bookmarks
        .map((b: any) => b.id)
        .sort()
        .join(","),
    ],
    queryFn: async () => {
      if (bookmarks.length === 0) return { repos: [] };

      const urls = bookmarks.map((repo: any) => repo.githubRepoUrl);
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      if (!res.ok) throw new Error("Failed to fetch repos");
      return res.json();
    },
    enabled: bookmarks.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const repos = reposData?.repos || [];
  const validRepos = repos.filter((r: any) => r !== null && r !== undefined);
  const hasFailedRepos = repos.length > validRepos.length;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 px-6 py-12">
      <Link href="/home">
        <Button size="medium" variant="primary">
          Go to Home
        </Button>
      </Link>
      <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-2">
          Welcome{data?.data?.name ? `, ${data.data.name}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Here are your bookmarked repositories.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size={50} />
          <p className="text-muted-foreground mt-4">
            Loading your bookmarks...
          </p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-16">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-4 rounded-lg text-center">
            <p className="font-semibold">Error loading dashboard</p>
            <p className="text-sm mt-1">
              Unable to fetch your bookmarked repositories
            </p>
          </div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex justify-center py-12 text-muted-foreground">
          <span>No bookmarked repositories found.</span>
        </div>
      ) : (
        <>
          {hasFailedRepos && (
            <div className="flex justify-center">
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-3 rounded-lg text-center text-sm">
                Failed to load
              </div>
            </div>
          )}
          {reposLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size={40} />
              <p className="text-muted-foreground mt-4">
                Loading repository details...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {validRepos.map((github: any) => (
                <RepoCard
                  key={github.id}
                  name={github.name}
                  description={github.description}
                  stars={github.stargazers_count}
                  forks={github.forks_count}
                  language={github.language}
                  url={github.html_url}
                  owner={github.owner?.login}
                  issues={github.open_issues_count}
                  lastActivity={
                    github.updated_at
                      ? new Date(github.updated_at).toLocaleDateString()
                      : undefined
                  }
                  isBookmarked={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
