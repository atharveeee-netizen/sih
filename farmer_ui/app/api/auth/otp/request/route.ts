import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber || phoneNumber.length < 5) {
      return NextResponse.json({ error: 'Valid phone number or Farmer ID required' }, { status: 400 });
    }

    // Generate simulated requestId
    const requestId = `OTP-REQ-${Date.now()}`;
    return NextResponse.json({
      success: true,
      requestId,
      message: 'OTP sent successfully to registered number',
      demoOtpHint: '1234', // For easy testing in demo/Replit preview
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
