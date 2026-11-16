import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/lib/types';
import { withReporting } from '@/lib/withReporting';
import { checkFault } from '@/lib/faults';

const STATUS_CYCLE: OrderStatus[] = [
  'RECEIVED',
  'PREPARING',
  'BAKING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const GET = withReporting(
  'crust-orders',
  async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    checkFault('orders_get');

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
  },
  { defaultErrorMessage: 'Failed to retrieve order' }
);

export const PATCH = withReporting(
  'crust-orders',
  async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
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
  },
  { defaultErrorMessage: 'Failed to update order' }
);
