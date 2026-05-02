"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen p-8 text-white" style={{ background: '#0a0a0a' }}>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {session.user?.name} ({session.user?.email})</p>
      <button 
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-600 rounded text-white font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}
