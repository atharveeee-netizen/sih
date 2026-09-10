import { NextResponse } from 'next/server';
import { MOCK_FIELD_OFFICER } from '../../../lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    fieldOfficer: MOCK_FIELD_OFFICER,
  });
}
