import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id')
  console.log('Checking driver role for userId:', userId)
  
  if (!userId) {
    return NextResponse.json({ isDriver: false }, { status: 400 })
  }

  try {
    const user = await prisma.userRole.findUnique({
      where: {
        userId: userId,
      },
    })
    
    const isDriver = user?.driver === true
    console.log('Driver check result:', isDriver)
    return NextResponse.json({ isDriver })
  } catch (error) {
    console.error("Error checking driver role:", error)
    return NextResponse.json({ isDriver: false }, { status: 500 })
  }
}