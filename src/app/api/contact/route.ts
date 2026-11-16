import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withReporting } from '@/lib/withReporting';

export const POST = withReporting(
  'crust-web',
  async (request: NextRequest) => {
    const { name, email, phone, subject, message, inquiryType } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Inquiry',
        message,
        inquiryType: inquiryType || 'GENERAL',
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Our hearth coordinator will contact you within 24 hours.',
      inquiryId: inquiry.id,
    });
  },
  { defaultErrorMessage: 'Failed to submit inquiry' }
);
