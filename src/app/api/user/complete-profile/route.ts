import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const { phoneNumber, profession, institution, province, city } = await req.json();

    if (!phoneNumber || !profession || !institution || !province || !city) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phoneNumber,
        profession,
        institution,
        province,
        city,
        profileCompleted: true,
      },
    });

    return NextResponse.json(
      { message: "Profil berhasil diperbarui.", user: { profileCompleted: updatedUser.profileCompleted } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete Profile error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
