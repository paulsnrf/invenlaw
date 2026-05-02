import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const templateId = params.id;

    // We can fetch by slug or ID. The frontend seems to use slug or ID depending on routing.
    // Let's assume it searches by ID or slug. We'll search by slug first, then fallback to ID.
    let template = await prisma.template.findUnique({
      where: { slug: templateId },
      include: { category: true },
    });

    if (!template) {
      template = await prisma.template.findUnique({
        where: { id: templateId },
        include: { category: true },
      });
    }

    if (!template) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 });
    }

    // Increment view count (in a real app, maybe do this async or track unique IPs)
    await prisma.template.update({
      where: { id: template.id },
      data: { viewCount: { increment: 1 } },
    });

    const relatedTemplates = await prisma.template.findMany({
      where: {
        categoryId: template.categoryId,
        id: { not: template.id },
      },
      take: 4,
    });

    // Check auth status for subscription and favorites
    const session = await getServerSession(authOptions);
    let is_subscribed = false;
    let is_favorited = false;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          subscriptions: {
            where: { status: "active" }
          },
          favorites: {
            where: { templateId: template.id }
          }
        }
      });

      if (user) {
        is_subscribed = user.subscriptions.length > 0;
        is_favorited = user.favorites.length > 0;
      }
    }

    return NextResponse.json({
      template,
      related: relatedTemplates,
      is_subscribed,
      is_favorited,
    });
  } catch (error) {
    console.error("Error fetching template details:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
