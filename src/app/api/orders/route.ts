import { NextResponse } from 'next/server';
import { createOrder, updateOrderStatus } from '@/lib/supabase';
import { sendTelegramOrderNotification, sendTelegramDeliveryStatusUpdate } from '@/lib/telegram';

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
      contract_id,
      telegram_chat_id,
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
      contract_id,
      telegram_chat_id,
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

export async function PATCH(req: Request) {
  try {
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status are required' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);
    if (updated) {
      // Point 9 in TZ: Automatically notify the client of the delivery progress
      await sendTelegramDeliveryStatusUpdate(updated, status);
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('API /api/orders PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

