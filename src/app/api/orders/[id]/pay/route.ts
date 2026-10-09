import { NextResponse } from 'next/server';
import { updateOrderPaymentStatus } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    updateOrderPaymentStatus(id, 'paid');
    return NextResponse.json({ success: true, payment_status: 'paid' });
  } catch (error) {
    console.error('API /api/orders/[id]/pay error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}
