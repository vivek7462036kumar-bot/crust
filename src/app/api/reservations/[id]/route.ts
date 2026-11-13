import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update reservation', details: error.message },
      { status: 500 }
    );
  }
}

