import { NextRequest, NextResponse } from 'next/server';
import { runContractLifecycleCheck } from '@/lib/bot/contract-scheduler';

/**
 * Contract Lifecycle Automated Cron Route: /api/bot/cron
 * Can be called periodically by Vercel Cron, external cron-job.org,
 * or on-demand from the Admin Panel.
 */
export async function GET(req: NextRequest) {
  try {
    const report = await runContractLifecycleCheck();
    return NextResponse.json({
      success: true,
      message: 'Contract lifecycle execution completed successfully',
      report,
    });
  } catch (error) {
    console.error('Lifecycle cron execution failed:', error);
    return NextResponse.json(
      { success: false, error: 'Lifecycle cron execution failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
