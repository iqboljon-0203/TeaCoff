import { NextRequest, NextResponse } from 'next/server';
import { processTelegramUpdate } from '@/lib/bot/engine';
import { TelegramUpdate } from '@/lib/bot/types';

/**
 * Telegram Webhook Handler Route: /api/bot/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const update = (await req.json()) as TelegramUpdate;
    if (!update || (!update.message && !update.callback_query)) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const result = await processTelegramUpdate(update);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('Telegram webhook processing error:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    bot: 'TeaCoff Telegram Lifecycle Engine',
    timestamp: new Date().toISOString(),
  });
}
