import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/lib/types';

const STATUS_CYCLE: OrderStatus[] = [
  'RECEIVED',
  'PREPARING',
  'BAKING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    let targetStatus = body.status;

    // If advanceNext is passed (used by the Simulate Next Stage button)
    if (body.advanceNext) {
      const current = await prisma.order.findUnique({
        where: { id },
        select: { status: true },
      });

      if (!current) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const currentIndex = STATUS_CYCLE.indexOf(current.status as OrderStatus);
      if (currentIndex >= 0 && currentIndex < STATUS_CYCLE.length - 1) {
        targetStatus = STATUS_CYCLE[currentIndex + 1];
      } else {
        targetStatus = STATUS_CYCLE[0]; // Reset or stay
      }
    }

    if (!targetStatus) {
      return NextResponse.json(
        { error: 'Target status or advanceNext flag required' },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: targetStatus,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status', details: error.message },
      { status: 500 }
    );
  }
}

