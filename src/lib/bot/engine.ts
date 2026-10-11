// TeaCoff Telegram Bot Core Processing Engine
// Date: 2026-10-11

import {
  TelegramUpdate,
  TelegramInlineKeyboardMarkup,
  BotLanguage,
  ServiceIssueType,
} from './types';
import { MESSAGES } from './messages';
import {
  getContractByChatId,
  getContractById,
  getContractByPhone,
  linkContractTelegramChatId,
  getAllContracts,
  createOrder,
  createServiceTicket,
  updateContractCycleOnOrder,
  getProducts,
} from '../supabase';
import {
  sendTelegramOrderNotification,
  sendTelegramServiceTicketNotification,
} from '../telegram';
import { formatUZS } from '../utils';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://teacoff.uz';

/**
 * Send HTTP request to Telegram Bot API with automatic retry on network glitches
 */
export async function sendTelegramApiMessage(params: {
  chat_id: number;
  text: string;
  reply_markup?: TelegramInlineKeyboardMarkup;
  parse_mode?: string;
}): Promise<boolean> {
  const token = TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.info('[Telegram Bot Dev Mock]: Outgoing message to chat', params.chat_id, '\n', params.text);
    return true;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000), // 10s timeout per attempt
        body: JSON.stringify({
          chat_id: params.chat_id,
          text: params.text,
          reply_markup: params.reply_markup,
          parse_mode: params.parse_mode || 'HTML',
          disable_web_page_preview: true,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`⚠️ Telegram API error (attempt ${attempt}):`, res.status, errText);

        // If error was caused by HTML parsing, retry with clean plain text
        if (errText.includes('parse') || errText.includes('entity')) {
          const plainText = params.text.replace(/<[^>]*>?/gm, '');
          const retryRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: params.chat_id,
              text: plainText,
              reply_markup: params.reply_markup,
            }),
          });
          return retryRes.ok;
        }
        return false;
      }
      return true;
    } catch (err: any) {
      console.warn(`⚠️ Telegram dispatch retry ${attempt}/3 due to:`, err.message || err.code);
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 600)); // wait 600ms before retry
      } else {
        console.error('❌ Telegram message delivery failed after 3 attempts:', err);
        return false;
      }
    }
  }
  return false;
}

/**
 * Answer Telegram callback queries (acknowledges button press)
 */
export async function answerTelegramCallback(callbackQueryId: string, text?: string): Promise<void> {
  const token = TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    });
  } catch (err) {
    console.error('Error answering callback query:', err);
  }
}

/**
 * Generate Main Menu Buttons
 */
export function getMainMenuKeyboard(lang: BotLanguage, contractId?: string): TelegramInlineKeyboardMarkup {
  const isRu = lang === 'ru';
  const cId = contractId || 'demo';
  const isHttps = WEB_BASE_URL.startsWith('https://');

  const catalogBtn = isHttps
    ? {
        text: isRu ? '📦 Каталог капсул' : '📦 Kapsulalar katalogi',
        web_app: { url: `${WEB_BASE_URL}/${lang}/tma` },
      }
    : {
        text: isRu ? '📦 Каталог капсул' : '📦 Kapsulalar katalogi',
        callback_data: `catalog_view:${cId}`,
      };

  return {
    inline_keyboard: [
      [
        {
          text: isRu ? '☕ Моя кофемашина' : '☕ Mening kofemashinam',
          callback_data: `my_machine:${cId}`,
        },
        {
          text: isRu ? '🔄 Повторить прошлый заказ' : '🔄 Oxirgi buyurtmani takrorlash',
          callback_data: `repeat_order:${cId}`,
        },
      ],
      [
        catalogBtn,
        {
          text: isRu ? '🛠 Нужна помощь с машиной' : '🛠 Mashina bilan yordam',
          callback_data: `service_menu:${cId}`,
        },
      ],
      [
        {
          text: isRu ? '🇺🇿 O\'zbekcha' : '🇷🇺 Русский',
          callback_data: isRu ? 'set_lang:uz' : 'set_lang:ru',
        },
      ],
    ],
  };
}

export function getPhoneRequestKeyboard(lang: BotLanguage) {
  return {
    keyboard: [
      [
        {
          text: lang === 'ru' ? '📱 Поделиться номером телефона' : '📱 Telefon raqamni yuborish',
          request_contact: true,
        },
      ],
      [
        {
          text: lang === 'ru' ? '➡️ Пропустить и открыть меню' : '➡️ O\'tkazib yuborish (Menyu)',
        },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
}

/**
 * Main Update Dispatcher
 */
export async function processTelegramUpdate(update: TelegramUpdate): Promise<{ ok: boolean; action?: string }> {
  // 1. Handle Contact Submission (Phone authorization)
  if (update.message && update.message.contact) {
    const chatId = update.message.chat.id;
    const phone = update.message.contact.phone_number;
    const userName = update.message.from?.first_name || 'Клиент';

    const contract = await getContractByPhone(phone);
    if (contract) {
      await linkContractTelegramChatId(contract.id, chatId);
      const lang = contract.language || 'ru';
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.contractLinked[lang](contract),
        reply_markup: getMainMenuKeyboard(lang, contract.id),
      });
      return { ok: true, action: 'contract_linked' };
    } else {
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.contractNotFound['ru'](phone, userName),
        reply_markup: getMainMenuKeyboard('ru'),
      });
      return { ok: true, action: 'contract_not_found' };
    }
  }

  // 2. Handle Text Messages (e.g. /start, /machine, /catalog, /help or manually typed phone)
  if (update.message && update.message.text) {
    const text = update.message.text.trim();
    const chatId = update.message.chat.id;
    const userName = update.message.from?.first_name || 'Клиент';

    // Check if message is a typed phone number (e.g. +998901234567 or 998901234567 or 901234567)
    const cleanDigits = text.replace(/[^\d]/g, '');
    if (cleanDigits.length >= 9 && cleanDigits.length <= 13) {
      const contract = await getContractByPhone(text);
      if (contract) {
        await linkContractTelegramChatId(contract.id, chatId);
        const lang = contract.language || 'ru';
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.contractLinked[lang](contract),
          reply_markup: getMainMenuKeyboard(lang, contract.id),
        });
        return { ok: true, action: 'contract_linked' };
      } else {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.contractNotFound['uz'](text, userName),
          reply_markup: getMainMenuKeyboard('uz'),
        });
        return { ok: true, action: 'contract_not_found' };
      }
    }

    // Look up contract by Telegram chat ID
    let contract = await getContractByChatId(chatId);
    const lang: BotLanguage = contract?.language || 'uz';

    // Command to re-request phone number anytime
    if (text.startsWith('/auth') || text.startsWith('/phone') || text.startsWith('/login')) {
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.requestPhone[lang](userName),
        reply_markup: getPhoneRequestKeyboard(lang) as any,
      });
      return { ok: true, action: 'phone_requested' };
    }

    // If skip chosen
    if (text.includes('Пропустить') || text.includes('O\'tkazib')) {
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.welcome[lang](userName),
        reply_markup: getMainMenuKeyboard(lang),
      });
      return { ok: true, action: 'skipped_auth' };
    }

    if (text.startsWith('/start')) {
      if (!contract) {
        // First-time onboarding: Ask for phone number with big friendly button
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.requestPhone[lang](userName),
          reply_markup: getPhoneRequestKeyboard(lang) as any,
        });
        return { ok: true, action: 'phone_requested' };
      } else {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.welcome[lang](userName),
          reply_markup: getMainMenuKeyboard(lang, contract.id),
        });
        return { ok: true, action: 'start' };
      }
    }

    if (text.startsWith('/machine')) {
      if (contract) {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.myMachine[lang](contract),
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: lang === 'ru' ? '🔄 Повторить заказ' : '🔄 Buyurtmani takrorlash',
                  callback_data: `repeat_order:${contract.id}`,
                },
                {
                  text: lang === 'ru' ? '🛠 Сервис' : '🛠 Servis',
                  callback_data: `service_menu:${contract.id}`,
                },
              ],
            ],
          },
        });
      }
      return { ok: true, action: 'machine' };
    }

    if (text.startsWith('/catalog')) {
      const products = await getProducts();
      const capsuleCount = products.filter((p) => p.category_slug === 'kapsuly').length;
      const isRu = lang === 'ru';
      const msg = isRu
        ? `📦 <b>Каталог капсул и кофе TeaCoff</b>\nВсего доступно более ${capsuleCount} видов капсул свежей обжарки и премиального бленда.`
        : `📦 <b>TeaCoff kapsula va qahvalar katalogi</b>\nJami ${capsuleCount} dan ortiq yangi qovurilgan va premium kapsula turlari mavjud.`;

      await sendTelegramApiMessage({
        chat_id: chatId,
        text: msg,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: isRu ? '🛍 Открыть полный каталог' : '🛍 To\'liq katalogni ochish',
                web_app: { url: `${WEB_BASE_URL}/${lang}/tma` },
              },
            ],
          ],
        },
      });
      return { ok: true, action: 'catalog' };
    }

    // Default fallback
    await sendTelegramApiMessage({
      chat_id: chatId,
      text: MESSAGES.welcome[lang](userName),
      reply_markup: getMainMenuKeyboard(lang, contract?.id),
    });
    return { ok: true, action: 'fallback' };
  }

  // 2. Handle Inline Button Callbacks
  if (update.callback_query && update.callback_query.data) {
    const callbackData = update.callback_query.data;
    const chatId = update.callback_query.message?.chat.id || update.callback_query.from.id;
    await answerTelegramCallback(update.callback_query.id);

    // Look up contract
    let contract = await getContractByChatId(chatId);
    if (!contract) {
      const allContracts = await getAllContracts();
      contract = allContracts.find((c) => c.status === 'active') || allContracts[0];
    }
    const lang: BotLanguage = contract?.language || 'ru';
    const isRu = lang === 'ru';

    // A. Show machine details
    if (callbackData.startsWith('my_machine:')) {
      const cId = callbackData.split(':')[1];
      const targetContract = (await getContractById(cId)) || contract;
      if (targetContract) {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.myMachine[lang](targetContract),
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: isRu ? '🔄 Заказать капсулы' : '🔄 Kapsula buyurtma qilish',
                  callback_data: `repeat_order:${targetContract.id}`,
                },
                {
                  text: isRu ? '🛠 Помощь с машиной' : '🛠 Mashina bilan yordam',
                  callback_data: `service_menu:${targetContract.id}`,
                },
              ],
            ],
          },
        });
      }
      return { ok: true, action: 'my_machine' };
    }

    // A2. Show catalog in chat
    if (callbackData.startsWith('catalog_view')) {
      const prods = await getProducts();
      const capsuleList = prods
        .map((p) => `• <b>${p.title[lang] || p.title.ru}</b>\n  💰 ${formatUZS(p.price)} (${p.weight_volume || '16 шт'})`)
        .join('\n\n');

      const text = isRu
        ? `📦 <b>Каталог капсул и кофе TeaCoff:</b>\n\n${capsuleList}\n\n<i>Для быстрого заказа нажмите «🔄 Повторить прошлый заказ» ниже:</i>`
        : `📦 <b>TeaCoff kapsula va qahvalar katalogi:</b>\n\n${capsuleList}\n\n<i>Tezkor buyurtma uchun quyidagi «🔄 Oxirgi buyurtmani takrorlash» tugmasini bosing:</i>`;

      await sendTelegramApiMessage({
        chat_id: chatId,
        text,
        reply_markup: getMainMenuKeyboard(lang, contract?.id),
      });
      return { ok: true, action: 'catalog_view' };
    }

    // B. Repeat Past Order (Point 3, 4, 6 in TZ)
    if (callbackData.startsWith('repeat_order:')) {
      const cId = callbackData.split(':')[1];
      const targetContract = (await getContractById(cId)) || contract;

      if (!targetContract) {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: isRu ? 'Договор не найден.' : 'Shartnoma topilmadi.',
        });
        return { ok: false };
      }

      // Check items
      const items = targetContract.last_order_items && targetContract.last_order_items.length > 0
        ? targetContract.last_order_items
        : [
            {
              product_id: 'prod-carraro-crema',
              slug: 'capsules-carraro-crema',
              title: 'Капсулы Carraro Crema (16 шт)',
              price: 95000,
              quantity: 4,
              image: '',
            },
          ];

      // Volume check: calculate total boxes
      const totalBoxes = items.reduce((sum, item) => sum + item.quantity, 0);

      // Point 6: Minimum box check enforcement
      if (totalBoxes < targetContract.min_capsule_boxes) {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: MESSAGES.minBoxesWarning[lang](totalBoxes, targetContract.min_capsule_boxes),
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: isRu ? '📦 Добавить капсулы в каталоге' : '📦 Katalogdan qo\'shish',
                  web_app: { url: `${WEB_BASE_URL}/${lang}/tma` },
                },
              ],
            ],
          },
        });
        return { ok: true, action: 'min_quota_blocked' };
      }

      // Total sum calculation
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create Order
      const newOrder = await createOrder({
        customer_name: targetContract.customer_name,
        customer_phone: targetContract.customer_phone,
        district: 'Ташкент',
        delivery_address: 'Адрес по договору №' + targetContract.contract_number,
        total_amount: totalAmount,
        delivery_fee: 0,
        status: 'new',
        items: items,
        payment_method: 'cash_on_delivery',
        notes: `Повторный заказ из Telegram бота по договору №${targetContract.contract_number}`,
        contract_id: targetContract.id,
        telegram_chat_id: chatId,
      });

      // ⭐ Smart replenishment forecast: dynamically adjust next cycle on order placement!
      await updateContractCycleOnOrder(targetContract.id, items);

      // Send confirmation to client
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.repeatOrderSuccess[lang](newOrder.order_number, totalAmount),
        reply_markup: getMainMenuKeyboard(lang, targetContract.id),
      });

      // Send notification to manager channel
      await sendTelegramOrderNotification(newOrder);

      return { ok: true, action: 'repeat_order_placed' };
    }

    // C. Edit Order (Point 4 in TZ)
    if (callbackData.startsWith('edit_order:')) {
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: isRu
          ? '✏️ Вы можете изменить количество или добавить другие вкусы капсул в каталоге:'
          : '✏️ Katalogda kapsulalar miqdorini o\'zgartirishingiz yoki boshqa ta\'mlarni tanlashingiz mumkin:',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: isRu ? '🛍 Открыть корзину и каталог' : '🛍 Savat va katalogni ochish',
                web_app: { url: `${WEB_BASE_URL}/${lang}/tma` },
              },
            ],
          ],
        },
      });
      return { ok: true, action: 'edit_order' };
    }

    // D. Service Assistance Menu (Point 8 in TZ)
    if (callbackData.startsWith('service_menu:')) {
      const cId = callbackData.split(':')[1];
      const issues = MESSAGES.serviceIssues[lang];

      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.servicePrompt[lang],
        reply_markup: {
          inline_keyboard: [
            [
              { text: issues.power, callback_data: `service_issue:${cId}:power` },
              { text: issues.water, callback_data: `service_issue:${cId}:water` },
            ],
            [
              { text: issues.brewing, callback_data: `service_issue:${cId}:brewing` },
              { text: issues.cleaning, callback_data: `service_issue:${cId}:cleaning` },
            ],
            [{ text: issues.other, callback_data: `service_issue:${cId}:other` }],
          ],
        },
      });
      return { ok: true, action: 'service_menu' };
    }

    // E. Service Issue Ticket Submission
    if (callbackData.startsWith('service_issue:')) {
      const parts = callbackData.split(':');
      const cId = parts[1];
      const issueType = parts[2] as ServiceIssueType;
      const targetContract = (await getContractById(cId)) || contract;

      const issueLabel = MESSAGES.serviceIssues[lang][issueType] || 'Неполадка с машиной';

      const ticket = await createServiceTicket({
        customer_name: targetContract?.customer_name || 'Клиент',
        customer_phone: targetContract?.customer_phone || '+998 90 000 00 00',
        machine_model: targetContract?.machine_model || 'Dolce Gusto',
        issue_description: `[Telegram Bot] Проблема: ${issueLabel} (Договор №${targetContract?.contract_number || 'н/д'})`,
        status: 'new',
        contract_id: targetContract?.id,
        telegram_chat_id: chatId,
      });

      // Send manager alert
      await sendTelegramServiceTicketNotification(ticket);

      // Send confirmation to client
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: MESSAGES.serviceTicketCreated[lang](ticket.ticket_number, issueLabel),
        reply_markup: getMainMenuKeyboard(lang, targetContract?.id),
      });

      return { ok: true, action: 'service_ticket_created' };
    }

    // F. Language Switch
    if (callbackData.startsWith('set_lang:')) {
      const newLang = callbackData.split(':')[1] as BotLanguage;
      await sendTelegramApiMessage({
        chat_id: chatId,
        text: newLang === 'ru' ? '🇷🇺 Язык переключен на Русский' : '🇺🇿 Til o\'zbekchaga o\'zgartirildi',
        reply_markup: getMainMenuKeyboard(newLang, contract?.id),
      });
      return { ok: true, action: 'lang_changed' };
    }
  }

  return { ok: true };
}
