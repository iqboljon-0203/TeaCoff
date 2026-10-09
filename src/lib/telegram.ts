import { Order, RentalInquiry, ServiceTicket } from '@/types/database';
import { formatUZS } from './utils';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const MANAGER_HANDLE = process.env.TELEGRAM_MANAGER_HANDLE || '@TeaCoff_lux';

/**
 * Send an HTML formatted message to Telegram Bot
 */
async function sendTelegramMessage(htmlMessage: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.info(
      '⚠️ [Telegram Notice]: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in .env. Message preview:\n',
      htmlMessage.replace(/<[^>]*>?/gm, '')
    );
    return true; // Return true to allow dev mock flow without failure
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Telegram API error:', errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to dispatch telegram message:', error);
    return false;
  }
}

/**
 * 1. New Order Notification
 */
export async function sendTelegramOrderNotification(order: Order): Promise<boolean> {
  const itemsText = order.items
    .map(
      (item) =>
        `• <b>${item.title}</b> (${item.quantity} шт) — ${
          item.is_rental ? '0 сум (Аренда)' : formatUZS(item.price * item.quantity)
        }`
    )
    .join('\n');

  const message = `
🔔 <b>НОВЫЙ ЗАКАЗ #TEA-${order.order_number}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${order.customer_name}
📞 <b>Телефон:</b> <code>${order.customer_phone}</code>
📍 <b>Район:</b> ${order.district}
🏠 <b>Адрес:</b> ${order.delivery_address}
💳 <b>Оплата:</b> ${
    order.payment_method === 'card_on_delivery'
      ? 'Картой при получении (Uzcard/Humo)'
      : 'Наличными при получении'
  }

📦 <b>Товары:</b>
${itemsText}

🚚 <b>Доставка:</b> ${order.delivery_fee === 0 ? 'Бесплатно' : formatUZS(order.delivery_fee)}
💰 <b>ИТОГО К ОПЛАТЕ:</b> <b>${formatUZS(order.total_amount)}</b>
${order.notes ? `📝 <b>Примечание:</b> <i>${order.notes}</i>\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⚡️ Менеджер: ${MANAGER_HANDLE}
`.trim();

  return sendTelegramMessage(message);
}

/**
 * 2. New Rental Inquiry Notification
 */
export async function sendTelegramRentalNotification(rental: RentalInquiry): Promise<boolean> {
  const capsulesText =
    rental.selected_capsules && rental.selected_capsules.length > 0
      ? rental.selected_capsules
          .map((c) => `• ${c.name} — ${c.boxes} уп`)
          .join('\n')
      : '• Набор не выбран (стандартный микс)';

  const totalBoxes =
    rental.selected_capsules?.reduce((sum, c) => sum + c.boxes, 0) ||
    rental.min_boxes_required;

  const message = `
☕️ <b>НОВАЯ ЗАЯВКА НА АРЕНДУ 0 СУМ!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${rental.customer_name}
📞 <b>Телефон:</b> <code>${rental.customer_phone}</code>
📍 <b>Район:</b> ${rental.district || 'Ташкент'}
🏠 <b>Адрес:</b> ${rental.delivery_address || 'Уточняется менеджером'}

🤖 <b>Модель машины:</b> <b>${rental.machine_model}</b>
☕️ <b>Выбранные капсулы (Всего: ${totalBoxes} уп):</b>
${capsulesText}

📅 <b>Расчет чашек:</b> ${rental.cups_per_day} чашек в день
━━━━━━━━━━━━━━━━━━━━
⚡️ Связаться с клиентом: ${MANAGER_HANDLE}
`.trim();

  return sendTelegramMessage(message);
}

/**
 * 3. Service & Repair Ticket Notification
 */
export async function sendTelegramServiceTicketNotification(
  ticket: ServiceTicket
): Promise<boolean> {
  const message = `
🛠 <b>НОВАЯ ЗАЯВКА В СЕРВИСНЫЙ ЦЕНТР #SRV-${ticket.ticket_number}</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${ticket.customer_name}
📞 <b>Телефон:</b> <code>${ticket.customer_phone}</code>
🤖 <b>Модель:</b> ${ticket.machine_model}
⚠️ <b>Проблема:</b>
<i>${ticket.issue_description}</i>

${ticket.attachment_url ? `📎 <b>Файл:</b> <a href="${ticket.attachment_url}">Посмотреть фото/видео</a>\n` : ''}
━━━━━━━━━━━━━━━━━━━━
⚡️ Сервисный отдел TeaCoff
`.trim();

  return sendTelegramMessage(message);
}
