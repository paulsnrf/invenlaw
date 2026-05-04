import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AkunSayaForm from "./AkunSayaForm";
import { Mail, Shield, Calendar } from "lucide-react";
import BackButton from "@/components/BackButton";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";

export default async function AkunSayaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${lang}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) {
    redirect(`/${lang}/login`);
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{dict.profile.title}</h1>
          <p className="text-zinc-500">{dict.profile.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-orange-500/20">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-sm text-zinc-500 mb-4">{user.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold">
                  <Shield className="w-3 h-3 mr-1" />
                  {dict.profile.premium_badge}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-zinc-500 mr-3" />
                  <span className="text-zinc-400">{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-zinc-500 mr-3" />
                  <span className="text-zinc-400">{dict.profile.registered_at}: {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6">{dict.profile.info_title}</h3>
              <AkunSayaForm 
                initialData={JSON.parse(JSON.stringify(user))} 
                lang={lang} 
                dict={dict.profile.form} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
