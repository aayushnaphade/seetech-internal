import { NextResponse } from 'next/server';
import { calculationService } from '@/lib/db/services';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const calculation = await calculationService.create(body);
    return NextResponse.json(calculation, { status: 201 });
  } catch (error) {
    console.error('Error creating calculation:', error);
    return NextResponse.json({ error: 'Failed to create calculation' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const calculations = await calculationService.getAll();
    return NextResponse.json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 });
  }
}
