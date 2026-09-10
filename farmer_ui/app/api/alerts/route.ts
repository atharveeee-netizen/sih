import { NextResponse } from 'next/server';
import { INITIAL_HIVES } from '../../../lib/mockData';

export async function GET() {
  const allRisks = INITIAL_HIVES.flatMap((h) => h.activeRisks);
  return NextResponse.json({
    success: true,
    alerts: allRisks,
    timestamp: new Date().toISOString(),
  });
}
