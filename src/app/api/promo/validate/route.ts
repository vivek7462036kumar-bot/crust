import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please enter a promo code.' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const promo = await prisma.promoCode.findUnique({
      where: { code: cleanCode },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid or expired promo code.',
      });
    }

    const numericSubtotal = parseFloat(subtotal) || 0;
    if (numericSubtotal < promo.minOrder) {
      return NextResponse.json({
        valid: false,
        message: `Order minimum of $${promo.minOrder.toFixed(2)} required for code ${promo.code}.`,
      });
    }

    let discountTotal = 0;
    if (promo.discountPercent > 0) {
      discountTotal = (numericSubtotal * promo.discountPercent) / 100;
    } else if (promo.discountAmount > 0) {
      discountTotal = promo.discountAmount;
    }

    discountTotal = Math.min(Math.round(discountTotal * 100) / 100, numericSubtotal);

    return NextResponse.json({
      valid: true,
      message: `Promo code applied: ${promo.description}`,
      code: promo.code,
      discountPercent: promo.discountPercent,
      discountAmount: promo.discountAmount,
      discountTotal,
      description: promo.description,
    });
  } catch (error: any) {
    console.error('Error validating promo:', error);
    return NextResponse.json(
      { valid: false, message: 'Server error while checking promo code.' },
      { status: 500 }
    );
  }
}

