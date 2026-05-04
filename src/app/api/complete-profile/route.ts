import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, phoneNumber, profession, institution, province, city } = data;

    if (!name || !phoneNumber || !profession || !institution || !province || !city) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber,
        profession,
        institution,
        province,
        city,
        profileCompleted: true,
        profileCompletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Complete Profile Error:", error);
    // Mengembalikan error message asli untuk debugging sementara
    return NextResponse.json({ 
      error: "Terjadi kesalahan sistem", 
      debug: error.message || "Unknown error",
      stack: error.stack
    }, { status: 500 });
  }
}
