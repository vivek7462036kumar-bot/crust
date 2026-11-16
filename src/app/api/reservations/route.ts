import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withReporting } from '@/lib/withReporting';

export const GET = withReporting(
  'crust-web',
  async () => {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ reservations });
  },
  { defaultErrorMessage: 'Failed to fetch reservations' }
);

export const POST = withReporting(
  'crust-web',
  async (request: NextRequest) => {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      timeSlot,
      partySize,
      seatingArea,
      notes,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required reservation fields.' },
        { status: 400 }
      );
    }

    const reservationId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReservation = await prisma.reservation.create({
      data: {
        id: reservationId,
        customerName,
        customerEmail,
        customerPhone,
        date,
        timeSlot,
        partySize: parseInt(partySize, 10) || 2,
        seatingArea: seatingArea || 'HEARTH_SIDE',
        notes: notes || null,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json(
      {
        success: true,
        reservationId: newReservation.id,
        reservation: newReservation,
      },
      { status: 201 }
    );
  },
  { defaultErrorMessage: 'Failed to create reservation' }
);
