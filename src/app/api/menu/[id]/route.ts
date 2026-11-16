import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withReporting } from '@/lib/withReporting';

export const PATCH = withReporting(
  'crust-menu',
  async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.inStock !== undefined && { inStock: Boolean(body.inStock) }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.category !== undefined && { category: body.category.toUpperCase() }),
        ...(body.badges !== undefined && {
          badges: Array.isArray(body.badges) ? body.badges.join(',') : body.badges,
        }),
      },
    });

    return NextResponse.json(updated);
  },
  { defaultErrorMessage: 'Failed to update menu item' }
);

export const DELETE = withReporting(
  'crust-menu',
  async (
    request: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    const { id } = params;
    await prisma.menuItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  },
  { defaultErrorMessage: 'Failed to delete menu item' }
);
