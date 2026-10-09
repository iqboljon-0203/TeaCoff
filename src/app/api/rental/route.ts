import { NextResponse } from 'next/server';
import { createRentalInquiry } from '@/lib/supabase';
import { sendTelegramRentalNotification } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      machine_model,
      selected_capsules,
      min_boxes_required,
      cups_per_day,
      district,
      delivery_address,
    } = body;

    if (!customer_name || !customer_phone || !machine_model) {
      return NextResponse.json(
        { error: 'Missing required rental inquiry fields' },
        { status: 400 }
      );
    }

    const totalBoxes =
      selected_capsules?.reduce(
        (sum: number, c: { boxes: number }) => sum + (c.boxes || 0),
        0
      ) || 0;

    // Validate minimum boxes rule for rental
    const minRequired = Number(min_boxes_required) || 4;
    if (totalBoxes > 0 && totalBoxes < minRequired) {
      return NextResponse.json(
        { error: `Минимум требуется ${minRequired} коробок капсул для аренды` },
        { status: 422 }
      );
    }

    const inquiry = await createRentalInquiry({
      customer_name,
      customer_phone,
      machine_model,
      selected_capsules: selected_capsules || [],
      min_boxes_required: minRequired,
      cups_per_day: Number(cups_per_day) || 4,
      district: district || '',
      delivery_address: delivery_address || '',
      status: 'new',
    });

    // Notify managers in Telegram
    await sendTelegramRentalNotification(inquiry);

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('API /api/rental error:', error);
    return NextResponse.json(
      { error: 'Failed to submit rental inquiry' },
      { status: 500 }
    );
  }
}
