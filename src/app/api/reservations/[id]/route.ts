import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withReporting } from '@/lib/withReporting';

export const PATCH = withReporting(
  'crust-web',
  async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json({ success: true, reservation: updated });
  },
  { defaultErrorMessage: 'Failed to update reservation' }
);
