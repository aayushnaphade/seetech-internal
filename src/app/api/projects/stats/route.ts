import { NextResponse } from 'next/server';
import { projectService } from '@/lib/db/services';

export async function GET() {
  try {
    const stats = await projectService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
