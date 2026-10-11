// TeaCoff Contract Lifecycle Engine & Automated Scheduler
// Date: 2026-10-11

import {
  getAllContracts,
  updateContractReminderStatus,
} from '../supabase';
import { MESSAGES } from './messages';
import { sendTelegramApiMessage } from './engine';
import { formatUZS } from '../utils';

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://teacoff.uz';

export interface LifecycleReport {
  timestamp: string;
  totalContracts: number;
  activeContracts: number;
  suppressedContracts: number;
  primaryRemindersSent: number;
  followupsSent: number;
  managerAlertsSent: number;
  details: Array<{
    contractNumber: string;
    customerName: string;
    action: string;
    status: string;
  }>;
}

/**
 * Executes a full lifecycle check across all customer contracts.
 * Evaluates replenishment schedules, suppresses inactive/paused contracts,
 * dispatches primary & follow-up reminders, and escalates to managers when overdue.
 */
export async function runContractLifecycleCheck(): Promise<LifecycleReport> {
  const contracts = await getAllContracts();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let activeCount = 0;
  let suppressedCount = 0;
  let primarySent = 0;
  let followupsSent = 0;
  let managerAlertsSent = 0;
  const details: LifecycleReport['details'] = [];

  for (const contract of contracts) {
    // -------------------------------------------------------------------------
    // Point 2: Automated Reminder Suppression
    // If client is paused, terminated, completed, or machine returned -> STOP!
    // -------------------------------------------------------------------------
    if (contract.status !== 'active') {
      suppressedCount++;
      details.push({
        contractNumber: contract.contract_number,
        customerName: contract.customer_name,
        action: 'SUPPRESSED',
        status: `Contract ${contract.status} — reminders halted`,
      });
      continue;
    }

    activeCount++;

    // Evaluate Next Purchase Date
    const nextPurchaseDate = new Date(contract.next_purchase_date);
    nextPurchaseDate.setHours(0, 0, 0, 0);

    const isDueOrPast = today >= nextPurchaseDate;
    if (!isDueOrPast) {
      details.push({
        contractNumber: contract.contract_number,
        customerName: contract.customer_name,
        action: 'UPCOMING',
        status: `Due on ${contract.next_purchase_date}`,
      });
      continue;
    }

    const lang = contract.language || 'ru';
    const isRu = lang === 'ru';
    const chatId = contract.telegram_chat_id;

    // -------------------------------------------------------------------------
    // Point 1 & 3: Primary Reminder Dispatch
    // -------------------------------------------------------------------------
    if (contract.reminder_status === 'idle') {
      const itemsSummary =
        contract.last_order_items && contract.last_order_items.length > 0
          ? contract.last_order_items
              .map((it) => `• ${it.title} × ${it.quantity} (${formatUZS(it.price * it.quantity)})`)
              .join('\n')
          : '• Стандартный набор капсул (4 упаковки)';

      const messageText = MESSAGES.primaryReminder[lang](contract, itemsSummary);

      if (chatId) {
        await sendTelegramApiMessage({
          chat_id: chatId,
          text: messageText,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: isRu ? '🔄 Повторить прошлый заказ' : '🔄 Oxirgi buyurtmani takrorlash',
                  callback_data: `repeat_order:${contract.id}`,
                },
              ],
              [
                {
                  text: isRu ? '✏️ Изменить заказ' : '✏️ Buyurtmani o\'zgartirish',
                  callback_data: `edit_order:${contract.id}`,
                },
                {
                  text: isRu ? '📦 Каталог' : '📦 Katalog',
                  web_app: { url: `${WEB_BASE_URL}/${lang}/tma` },
                },
              ],
            ],
          },
        });
      }

      await updateContractReminderStatus(contract.id, 'reminded_primary');
      primarySent++;

      details.push({
        contractNumber: contract.contract_number,
        customerName: contract.customer_name,
        action: 'PRIMARY_REMINDER_SENT',
        status: 'Sent primary replenishment reminder',
      });
      continue;
    }

    // -------------------------------------------------------------------------
    // Point 1: Follow-Up Reminder (3-5 days after primary if no order)
    // -------------------------------------------------------------------------
    if (contract.reminder_status === 'reminded_primary') {
      const lastSent = contract.last_reminder_sent_at
        ? new Date(contract.last_reminder_sent_at)
        : nextPurchaseDate;
      const elapsedDays = Math.floor((today.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24));

      if (elapsedDays >= 3) {
        const messageText = MESSAGES.followupReminder[lang](contract);

        if (chatId) {
          await sendTelegramApiMessage({
            chat_id: chatId,
            text: messageText,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: isRu ? '🔄 Повторить прошлый заказ' : '🔄 Oxirgi buyurtmani takrorlash',
                    callback_data: `repeat_order:${contract.id}`,
                  },
                ],
                [
                  {
                    text: isRu ? '📦 Открыть каталог капсул' : '📦 Kapsulalar katalogi',
                    web_app: { url: `${WEB_BASE_URL}/${lang}/tma` },
                  },
                ],
              ],
            },
          });
        }

        await updateContractReminderStatus(contract.id, 'reminded_followup');
        followupsSent++;

        details.push({
          contractNumber: contract.contract_number,
          customerName: contract.customer_name,
          action: 'FOLLOWUP_REMINDER_SENT',
          status: `Follow-up sent after ${elapsedDays} days`,
        });
      } else {
        details.push({
          contractNumber: contract.contract_number,
          customerName: contract.customer_name,
          action: 'WAITING_FOLLOWUP',
          status: `Awaiting follow-up threshold (${elapsedDays}/3 days)`,
        });
      }
      continue;
    }

    // -------------------------------------------------------------------------
    // Point 5: Manager Alert Escalation (5 days without order)
    // -------------------------------------------------------------------------
    if (contract.reminder_status === 'reminded_followup') {
      const lastSent = contract.last_reminder_sent_at
        ? new Date(contract.last_reminder_sent_at)
        : nextPurchaseDate;
      const elapsedDays = Math.floor((today.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24));

      if (elapsedDays >= 2) {
        // Total 5+ days without order
        const alertText = MESSAGES.managerAlertInaction(contract);

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: alertText,
                parse_mode: 'HTML',
              }),
            });
          } catch (err) {
            console.error('Failed to dispatch manager inaction alert:', err);
          }
        }

        await updateContractReminderStatus(contract.id, 'needs_attention');
        managerAlertsSent++;

        details.push({
          contractNumber: contract.contract_number,
          customerName: contract.customer_name,
          action: 'MANAGER_ESCALATION',
          status: 'Escalated to management channel (no order after 5 days)',
        });
      } else {
        details.push({
          contractNumber: contract.contract_number,
          customerName: contract.customer_name,
          action: 'WAITING_ORDER',
          status: 'Followup active, awaiting customer action',
        });
      }
      continue;
    }

    // Already ordered or in attention
    details.push({
      contractNumber: contract.contract_number,
      customerName: contract.customer_name,
      action: 'NO_ACTION_REQUIRED',
      status: `Current status: ${contract.reminder_status}`,
    });
  }

  return {
    timestamp: new Date().toISOString(),
    totalContracts: contracts.length,
    activeContracts: activeCount,
    suppressedContracts: suppressedCount,
    primaryRemindersSent: primarySent,
    followupsSent: followupsSent,
    managerAlertsSent: managerAlertsSent,
    details,
  };
}
