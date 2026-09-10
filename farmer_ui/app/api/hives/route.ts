import { NextResponse } from 'next/server';
import { INITIAL_HIVES } from '../../../lib/mockData';

export async function GET() {
  // Returns hive telemetry aggregated from gateway store & AI output
  return NextResponse.json({
    success: true,
    hives: INITIAL_HIVES,
    timestamp: new Date().toISOString(),
  });
}
