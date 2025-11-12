"use client";
import React from "react";
import RepoCard from "../RepoCard";
import { useSession } from "next-auth/react";

interface Repo {
  name: string;
  description?: string;
  stars?: number;
  forks?: number;
  language?: string;
  url?: string;
  owner?: string;
}

interface FeedProps {
  repos: Repo[];
}

const Feed: React.FC<FeedProps> = ({ repos }) => {
  const { data: session } = useSession();
  const savedRepos = session?.user?.savedRepos ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => {
        const isBookmarked = savedRepos.some(
          (r: any) => r.githubRepoUrl === repo.url,
        );
        return (
          <RepoCard
            key={repo.url || repo.name}
            {...repo}
            isBookmarked={isBookmarked}
          />
        );
      })}
    </div>
  );
};

export default Feed;
