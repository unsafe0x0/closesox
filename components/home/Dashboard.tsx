"use client";
import { useState, useEffect, useMemo } from "react";
import Filters from "./Filters";
import Feed from "./Feed";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import Pagination from "./Pagination";

interface Repo {
  name: string;
  description?: string;
  stars?: number;
  forks?: number;
  language?: string;
  url?: string;
  owner?: string;
  issues?: number;
}

interface ApiResponse {
  repos: Repo[];
  total: number;
  page: number;
  hasMore: boolean;
}

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "C",
  "C#",
  "Swift",
  "Kotlin",
  "PHP",
  "Ruby",
  "Dart",
  "Scala",
  "Elixir",
  "Haskell",
  "Lua",
  "Perl",
  "R",
  "Objective-C",
  "Shell",
  "SQL",
  "HTML",
  "CSS",
  "MATLAB",
  "Assembly",
  "VHDL",
  "Verilog",
  "Zig",
  "Nim",
  "Julia",
  "Clojure",
  "Erlang",
  "F#",
  "OCaml",
  "Fortran",
  "Visual Basic",
  "PowerShell",
  "Solidity",
  "Vala",
  "Crystal",
  "Other",
];

const STARS = ["Any", "> 100", "> 500", "> 1000", "> 5000"];
const ISSUES = ["Any", "< 10", "< 50", "< 100", "> 100"];

const Dashboard: React.FC = () => {
  const [language, setLanguage] = useState<string>(LANGUAGES[0]);
  const [stars, setStars] = useState<string>(STARS[0]);
  const [issues, setIssues] = useState<string>(ISSUES[0]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const fetchRepos = async (
    language: string,
    page: number,
  ): Promise<ApiResponse> => {
    const params = new URLSearchParams({
      language,
      stars,
      issues,
      page: page.toString(),
    });
    const res = await fetch(`/api/repositories?${params.toString()}`);
    const data = await res.json();
    return data;
  };

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useQuery<ApiResponse>({
    queryKey: ["repos", language, stars, issues, page],
    queryFn: () => fetchRepos(language, page),
  });

  useEffect(() => {
    if (apiResponse) {
      setHasMore(apiResponse.hasMore);
      setTotalPages(Math.max(1, Math.ceil(apiResponse.total / 50)));
    }
  }, [apiResponse]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Filters
        languages={LANGUAGES}
        selectedLanguage={language}
        onLanguageChange={(val) => {
          setLanguage(val);
          setPage(1);
        }}
        starsOptions={STARS}
        selectedStars={stars}
        onStarsChange={(val) => {
          setStars(val);
          setPage(1);
        }}
        issuesOptions={ISSUES}
        selectedIssues={issues}
        onIssuesChange={(val) => {
          setIssues(val);
          setPage(1);
        }}
      />
      {isLoading || isFetching ? (
        <div className="flex justify-center py-12">
          <Spinner size={40} />
        </div>
      ) : (
        <>
          <Feed repos={apiResponse?.repos || []} />
          <div className="flex justify-center mt-4">
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
