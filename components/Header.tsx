"use client";
import React, { useState, useRef, useEffect } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import Button from "./ui/Button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Link href="/">
            <span className="font-bold text-xl tracking-tight text-primary cursor-pointer">
              CloseSox
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {profileImage ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full border border-border cursor-pointer hover:ring-2 hover:ring-primary transition"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-accent border border-border rounded-md shadow-lg z-50 animate-in fade-in zoom-in">
                  <ul className="py-1">
                    <li>
                      <Link href="/dashboard" className="block w-full">
                        <button
                          onClick={() => setIsDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                        >
                          Dashboard
                        </button>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          signOut();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/sign-in">
              <Button variant="primary" size="medium">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
