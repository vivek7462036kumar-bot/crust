import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = category.toUpperCase();
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [items, ingredients] = await Promise.all([
      prisma.menuItem.findMany({
        where: whereClause,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
      }),
      prisma.customIngredient.findMany({
        orderBy: [{ category: 'asc' }, { price: 'asc' }],
      }),
    ]);

    return NextResponse.json({
      items,
      ingredients,
    });
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, category, imageUrl, badges, baseSize, isFeatured } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newItem = await prisma.menuItem.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description: description || '',
        price: parseFloat(price),
        category: category.toUpperCase(),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        badges: Array.isArray(badges) ? badges.join(',') : (badges || ''),
        baseSize: baseSize || '12 inch',
        isFeatured: Boolean(isFeatured),
        inStock: true,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item', details: error.message },
      { status: 500 }
    );
  }
}

