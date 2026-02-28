"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } finally {
        router.replace("/");
      }
    };
    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-600">
      Logging out...
    </div>
  );
}
