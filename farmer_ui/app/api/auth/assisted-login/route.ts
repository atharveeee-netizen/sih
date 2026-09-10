import { NextResponse } from 'next/server';
import { DEFAULT_FARMER, MOCK_FIELD_OFFICER } from '../../../../lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { officerId, officerPin, farmerId } = body;

    if (!officerId || !officerPin) {
      return NextResponse.json({ error: 'Field Officer credentials required' }, { status: 400 });
    }

    const sessionToken = `JWT-ASSISTED-FO-${officerId}-${Date.now()}`;

    return NextResponse.json({
      success: true,
      sessionToken,
      actingAsOfficer: MOCK_FIELD_OFFICER,
      farmer: {
        ...DEFAULT_FARMER,
        farmerId: farmerId || DEFAULT_FARMER.farmerId,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid assisted login request' }, { status: 400 });
  }
}
