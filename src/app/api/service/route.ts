import { NextResponse } from 'next/server';
import { createServiceTicket } from '@/lib/supabase';
import { sendTelegramServiceTicketNotification } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      machine_model,
      issue_description,
      attachment_url,
    } = body;

    if (!customer_name || !customer_phone || !machine_model || !issue_description) {
      return NextResponse.json(
        { error: 'Missing required ticket fields' },
        { status: 400 }
      );
    }

    const ticket = await createServiceTicket({
      customer_name,
      customer_phone,
      machine_model,
      issue_description,
      attachment_url: attachment_url || '',
      status: 'new',
    });

    // Notify service team in Telegram
    await sendTelegramServiceTicketNotification(ticket);

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('API /api/service error:', error);
    return NextResponse.json(
      { error: 'Failed to create service ticket' },
      { status: 500 }
    );
  }
}
