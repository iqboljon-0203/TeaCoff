import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/supabase';
import { sendTelegramOrderNotification } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      district,
      delivery_address,
      items,
      total_amount,
      delivery_fee,
      payment_method,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !district || !delivery_address || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customer_name,
      customer_phone,
      district,
      delivery_address,
      items,
      total_amount: Number(total_amount),
      delivery_fee: Number(delivery_fee) || 0,
      payment_method: payment_method || 'unified_qr',
      payment_status: 'pending',
      notes: notes || '',
      status: 'new',
    });

    // Asynchronously dispatch notification to Telegram bot
    await sendTelegramOrderNotification(order);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
