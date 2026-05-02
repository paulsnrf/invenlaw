import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");

    const whereClause: any = {};

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    const templates = await prisma.template.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        downloadCount: "desc",
      },
      take: 12, // Simple pagination limit for now
    });

    // Formatting to match the Laravel pagination structure if the frontend expects it
    // Or we can just return the array and update frontend
    return NextResponse.json({
      data: templates,
      current_page: 1,
      last_page: 1,
      total: templates.length,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
