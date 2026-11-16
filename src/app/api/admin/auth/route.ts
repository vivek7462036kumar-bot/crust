import { NextRequest, NextResponse } from 'next/server';
import { withReporting } from '@/lib/withReporting';

export const POST = withReporting(
  'crust-web',
  async (request: NextRequest) => {
    const { pin } = await request.json();

    // Default PIN: 1234
    if (pin === '1234') {
      const response = NextResponse.json({
        success: true,
        message: 'Admin access authorized',
      });

      // Set cookie for simple session
      response.cookies.set('crust_admin_session', 'authorized-1234', {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid Admin PIN. Hint: Use 1234' },
      { status: 401 }
    );
  },
  { defaultErrorMessage: 'Authentication error' }
);
