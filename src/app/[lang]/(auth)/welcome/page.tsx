import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import WelcomeForm from "./WelcomeForm";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";

export default async function WelcomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${lang}/login`);
  }

  // Proteksi: Jika sudah complete, redirect ke Beranda
  if ((session.user as any)?.profileCompleted) {
    redirect(`/${lang}`);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{dict.welcome.title}</h1>
          <p className="text-zinc-400">{dict.welcome.subtitle}</p>
        </div>

        <WelcomeForm 
          user={session.user} 
          lang={lang} 
          dict={{...dict.profile.form, submit_btn: dict.welcome.submit_btn}} 
        />
      </div>
    </div>
  );
}
