"use client";
import React, { useState } from "react";
import {
  FaStar,
  FaCodeBranch,
  FaExclamationCircle,
  FaClock,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import Tooltip from "./ui/Tooltip";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";

interface RepoCardProps {
  name: string;
  description?: string;
  stars?: number;
  forks?: number;
  language?: string;
  url?: string;
  owner?: string;
  issues?: number;
  lastActivity?: string;
  isBookmarked?: boolean;
}

const RepoCard: React.FC<RepoCardProps> = ({
  name,
  description,
  stars,
  forks,
  language,
  url,
  owner,
  issues,
  lastActivity,
  isBookmarked = false,
}) => {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const mutation = useMutation({
    mutationFn: async (todo: "add" | "remove") => {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubRepoUrl: url, todo }),
      });
      if (!res.ok) throw new Error("Failed to update bookmark");
      return res.json();
    },
    onSuccess: (_, todo) => {
      toast.success(
        todo === "add"
          ? "Repository bookmarked"
          : "Bookmark removed successfully",
      );
    },
    onError: () => {
      toast.error("Failed to update bookmark");
      setBookmarked((prev) => !prev);
    },
  });

  const handleBookmark = () => {
    const action = bookmarked ? "remove" : "add";
    setBookmarked(!bookmarked);
    mutation.mutate(action);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2 h-full justify-between animate-in fade-in zoom-in">
      <div>
        <div className="flex items-center gap-2">
          <Link
            href={url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold text-lg hover:underline"
          >
            {name}
          </Link>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          {language && (
            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
              {language}
            </span>
          )}
          {typeof stars === "number" && (
            <Tooltip content="Stars" placement="top">
              <span className="text-xs flex items-center gap-1 cursor-pointer">
                <FaStar className="text-yellow-500" size={16} />
                {stars}
              </span>
            </Tooltip>
          )}
          {typeof forks === "number" && (
            <Tooltip content="Forks" placement="top">
              <span className="text-xs flex items-center gap-1 cursor-pointer">
                <FaCodeBranch className="text-primary" size={16} />
                {forks}
              </span>
            </Tooltip>
          )}
          {typeof issues === "number" && (
            <Tooltip content="Open Issues" placement="top">
              <span className="text-xs flex items-center gap-1 cursor-pointer">
                <FaExclamationCircle className="text-destructive" size={16} />
                {issues} issues
              </span>
            </Tooltip>
          )}
          {lastActivity && (
            <Tooltip content="Last Activity" placement="top">
              <span className="text-xs flex items-center gap-1 cursor-pointer">
                <FaClock className="text-muted-foreground" size={15} />
                {lastActivity}
              </span>
            </Tooltip>
          )}
        </div>
      </div>

      {owner && (
        <div className="flex justify-between mt-4">
          <span className="text-muted-foreground text-xs px-2 py-1 bg-accent rounded">
            Owned by {owner}
          </span>

          {session && (
            <button className="cursor-pointer" onClick={handleBookmark}>
              {bookmarked ? (
                <FaBookmark className="text-primary" size={18} />
              ) : (
                <FaRegBookmark className="text-muted-foreground" size={18} />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RepoCard;
