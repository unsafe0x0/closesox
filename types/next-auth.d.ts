import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    savedRepos?: Array<{
      id: string;
      githubRepoUrl: string;
    }>;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profileImage: string;
      savedRepos?: Array<{
        id: string;
        githubRepoUrl: string;
      }>;
    } & DefaultSession["user"];
  }
}
