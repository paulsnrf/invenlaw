"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl group mb-8"
      aria-label="Kembali"
    >
      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
    </button>
  );
}
