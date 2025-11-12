"use client";
import Header from "@/components/Header";
import Dashboard from "@/components/home/Dashboard";

export default function Home() {
  return (
    <main className="w-full space-y-3 flex flex-col items-center justify-start min-h-screen pb-10">
      <Header />
      <Dashboard />
    </main>
  );
}
