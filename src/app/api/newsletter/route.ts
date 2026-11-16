import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withReporting } from '@/lib/withReporting';

export const POST = withReporting(
  'crust-web',
  async (request: NextRequest) => {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check or create subscriber
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        isNew: false,
        message: 'Welcome back to The Ember Society! Your 15% VIP discount code is EMBERSOCIETY15',
        promoCode: 'EMBERSOCIETY15',
      });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        code: 'EMBERSOCIETY15',
      },
    });

    return NextResponse.json({
      success: true,
      isNew: true,
      message: 'You have joined The Ember Society! Enjoy 15% off your next feast with code EMBERSOCIETY15',
      promoCode: 'EMBERSOCIETY15',
    });
  },
  { defaultErrorMessage: 'Failed to join VIP Society' }
);
