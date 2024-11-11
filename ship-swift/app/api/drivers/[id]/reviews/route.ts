import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';

const prisma = new PrismaClient();

const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;
    
    // Verify driver exists first
    const driverExists = await prisma.drivers.findUnique({
      where: { Id: driverId },
    });

    if (!driverExists) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { rating, content } = ReviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        id: crypto.randomUUID(),
        driverId: driverId, // Direct assignment
        rating,
        content,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review', details: error },
      { status: 500 }
    );
  }
}