import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmerId, hiveId, riskType } = body;

    const callbackId = `CB-REQ-${Date.now()}`;

    return NextResponse.json({
      success: true,
      callbackId,
      status: 'sent',
      message: 'Call back request logged for assigned Field Officer',
      receivedContext: { farmerId, hiveId, riskType },
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process call back request' }, { status: 400 });
  }
}
