"use client";
import Header from "@/components/Header";
import SignIn from "@/components/auth/SignIn";

export default function Home() {
  return (
    <main className="w-full space-y-3 flex flex-col items-center justify-start min-h-screen pb-10">
      <Header />
      <SignIn />
    </main>
  );
}
