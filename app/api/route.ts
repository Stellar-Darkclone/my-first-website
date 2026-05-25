import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { points: 'desc' },
      select: {
        id: true,
        minecraftUsername: true,
        tier: true,
        points: true,
        kills: true,
        deaths: true,
        playtime: true,
        lastSeen: true,
      }
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const player = await prisma.player.upsert({
      where: { minecraftUsername: data.minecraftUsername },
      update: {
        points: { increment: data.points || 0 },
        kills: { increment: data.kills || 0 },
        deaths: { increment: data.deaths || 0 },
        playtime: { increment: data.playtime || 0 },
        lastSeen: new Date(),
      },
      create: {
        minecraftUsername: data.minecraftUsername,
        uuid: data.uuid,
        points: data.points || 0,
        kills: data.kills || 0,
        deaths: data.deaths || 0,
        playtime: data.playtime || 0,
      },
    });

    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}