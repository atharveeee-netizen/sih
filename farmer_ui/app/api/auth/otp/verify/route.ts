import { NextResponse } from 'next/server';
import { DEFAULT_FARMER } from '../../../../../lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, otp, phoneNumber } = body;

    // Accept '1234' or any 4+ digit OTP for seamless demo execution
    if (!otp || otp.length < 4) {
      return NextResponse.json({ error: 'Valid 4-digit OTP required' }, { status: 400 });
    }

    const sessionToken = `JWT-SESSION-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      sessionToken,
      farmer: {
        ...DEFAULT_FARMER,
        phoneNumber: phoneNumber || DEFAULT_FARMER.phoneNumber,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid verification request' }, { status: 400 });
  }
}
