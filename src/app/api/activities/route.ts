import { NextResponse } from 'next/server';
import { activityService } from '@/lib/db/services';

export async function GET() {
  try {
    const activities = await activityService.getRecent(20);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
