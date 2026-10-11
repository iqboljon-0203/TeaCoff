// Local Telegram Bot Polling Runner for TeaCoff
// Forwards Telegram updates directly to http://localhost:3000/api/bot/webhook
// Works without ngrok or public IP!

import fs from 'fs';
import path from 'path';

// Read TELEGRAM_BOT_TOKEN from .env.local
let botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('TELEGRAM_BOT_TOKEN=')) {
      botToken = trimmed.replace('TELEGRAM_BOT_TOKEN=', '').trim();
    }
  }
}

if (!botToken || botToken.includes('your-telegram-bot-token')) {
  console.error('❌ TELEGRAM_BOT_TOKEN .env.local faylida topilmadi!');
  process.exit(1);
}

const API_BASE = `https://api.telegram.org/bot${botToken}`;
const LOCAL_WEBHOOK_URL = 'http://localhost:3000/api/bot/webhook';

let offset = 0;
let isRunning = true;

async function start() {
  console.log('🤖 TeaCoff Telegram Bot lokal rejimda ishga tushirilmoqda...');

  // 1. Clear any existing webhook so getUpdates works
  try {
    const delRes = await fetch(`${API_BASE}/deleteWebhook`);
    const delData = await delRes.json();
    console.log('⚡ Webhook holati tekshirildi (Polling faollashtirildi)');
  } catch (err) {
    console.warn('⚠️ Webhookni o\'chirishda xatolik:', err.message);
  }

  // 2. Fetch Bot Info
  try {
    const meRes = await fetch(`${API_BASE}/getMe`);
    const meData = await meRes.json();
    if (meData.ok) {
      console.log(`✅ Bot muvaffaqiyatli ulandi: @${meData.result.username} (${meData.result.first_name})`);
      console.log(`👉 Telegramda ochish uchun: https://t.me/${meData.result.username}`);
    } else {
      console.error('❌ Bot tokeni noto\'g\'ri:', meData.description);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Telegram bilan aloqa o\'rnatilmadi:', err.message);
  }

  console.log(`📡 Local Webhook qabul qiluvchi: ${LOCAL_WEBHOOK_URL}`);
  console.log('👂 Yangi xabarlar va tugmalar kutilmoqda...\n');

  // 3. Polling loop
  while (isRunning) {
    try {
      const res = await fetch(`${API_BASE}/getUpdates?offset=${offset}&timeout=10`);
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          // Forward to local Next.js Webhook
          try {
            const hookRes = await fetch(LOCAL_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update),
            });
            const hookData = await hookRes.json();
            const fromUser = update.message?.from?.first_name || update.callback_query?.from?.first_name || 'Foydalanuvchi';
            const action = update.message?.text || update.callback_query?.data || 'hodisa';
            console.log(`📩 [${fromUser}]: "${action}" ➔ Qayta ishlandi (${hookData.result?.action || 'ok'})`);
          } catch (postErr) {
            console.error('⚠️ Next.js serveriga (/api/bot/webhook) ulanib bo\'lmadi. Sayt (localhost:3000) ishga tushganmi?', postErr.message);
          }
        }
      }
    } catch (err) {
      // Network timeout or temporary glitch
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

process.on('SIGINT', () => {
  console.log('\n🛑 Bot to\'xtatildi');
  isRunning = false;
  process.exit(0);
});

start();
