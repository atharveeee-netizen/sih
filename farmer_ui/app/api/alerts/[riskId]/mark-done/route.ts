import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ riskId: string }> }
) {
  try {
    const { riskId } = await params;
    const body = await request.json();

    return NextResponse.json({
      success: true,
      riskId,
      action: 'marked_done',
      resolvedAt: new Date().toISOString(),
      receivedPayload: body,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process mark-done action' }, { status: 400 });
  }
}
