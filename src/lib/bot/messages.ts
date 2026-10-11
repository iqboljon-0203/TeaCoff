// Bilingual messages for TeaCoff Telegram Bot (RU & UZ)
// Date: 2026-10-11

import { Contract, Order, OrderItem } from '@/types/database';
import { BotLanguage, ServiceIssueType } from './types';
import { formatUZS } from '../utils';

export const MESSAGES = {
  requestPhone: {
    ru: (name: string) => `
👋 Здравствуйте, <b>${name}</b>!
Добро пожаловать в официальный бот <b>TeaCoff</b>.

Для привязки вашего договора аренды и кофемашины, пожалуйста, отправьте ваш номер телефона, нажав кнопку <b>«📱 Поделиться контактом»</b> ниже 👇
    `.trim(),
    uz: (name: string) => `
👋 Assalomu alaykum, <b>${name}</b>!
<b>TeaCoff</b> rasmiy botiga xush kelibsiz.

Shartnomangiz va kofemashinangizni ulash uchun, iltimos, pastdagi <b>«📱 Raqamni yuborish»</b> tugmasini bosing 👇
    `.trim(),
  },

  contractLinked: {
    ru: (contract: Contract) => `
✅ <b>Ваш договор успешно привязан!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${contract.customer_name}
📄 <b>Договор №:</b> ${contract.contract_number}
🤖 <b>Кофемашина:</b> ${contract.machine_model}
📅 <b>Следующая закупка:</b> ${contract.next_purchase_date}
📦 <b>Минимальный заказ:</b> ${contract.min_capsule_boxes} коробок / месяц
━━━━━━━━━━━━━━━━━━━━
Теперь вы можете управлять заказами и сервисом в 1 клик! ☕
    `.trim(),
    uz: (contract: Contract) => `
✅ <b>Shartnomangiz muvaffaqiyatli ulandi!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${contract.customer_name}
📄 <b>Shartnoma №:</b> ${contract.contract_number}
🤖 <b>Kofemashina:</b> ${contract.machine_model}
📅 <b>Keyingi xarid sanasi:</b> ${contract.next_purchase_date}
📦 <b>Minimal buyurtma:</b> oyiga ${contract.min_capsule_boxes} quti
━━━━━━━━━━━━━━━━━━━━
Endi buyurtma va servisni 1 bosishda boshqarishingiz mumkin! ☕
    `.trim(),
  },

  contractNotFound: {
    ru: (phone: string, name: string) => `
👋 Приятно познакомиться, <b>${name}</b>!
По номеру <code>${phone}</code> активный договор аренды пока не найден.

Хотите получить кофемашину в бесплатную аренду <b>0 сум</b> при заказе от 4 коробок капсул в месяц?
    `.trim(),
    uz: (phone: string, name: string) => `
👋 Tanishganimizdan xursandmiz, <b>${name}</b>!
<code>${phone}</code> raqami bo'yicha faol ijara shartnomasi topilmadi.

Oyiga 4 qutidan kapsula xarid qilib, kofemashinani <b>0 so'mga bepul</b> ijaraga olishni xohlaysizmi?
    `.trim(),
  },

  welcome: {
    ru: (name: string) => `
👋 Здравствуйте, <b>${name}</b>!
Добро пожаловать в официальный бот <b>TeaCoff</b>.

Здесь вы можете:
☕ Управлять своей арендованной кофемашиной
🔄 Повторить прошлый заказ капсул в 1 клик
📦 Просматривать каталог и заказывать кофе
🛠 Оформить сервисную заявку при неполадках
    `.trim(),
    uz: (name: string) => `
👋 Assalomu alaykum, <b>${name}</b>!
<b>TeaCoff</b> rasmiy botiga xush kelibsiz.

Bu yerda siz:
☕ Ijara kofemashinangiz holatini ko'rishingiz
🔄 Oxirgi kapsulalar buyurtmasini 1 bosishda takrorlashingiz
📦 Katalogdan yangi ta'mlarni tanlashingiz
🛠 Texnik xizmat ko'rsatishga ariza qoldirishingiz mumkin
    `.trim(),
  },

  primaryReminder: {
    ru: (contract: Contract, itemsSummary: string) => `
☕ <b>Пришло время пополнить запас капсул!</b>
━━━━━━━━━━━━━━━━━━━━
📄 <b>Договор:</b> №${contract.contract_number}
🤖 <b>Кофемашина:</b> ${contract.machine_model}
📅 <b>Плановая дата закупки:</b> ${contract.next_purchase_date}

${itemsSummary ? `<b>Ваш прошлый заказ:</b>\n${itemsSummary}\n` : ''}
Хотите повторить прошлый заказ или выбрать другие вкусы?
    `.trim(),
    uz: (contract: Contract, itemsSummary: string) => `
☕ <b>Kapsulalar zaxirasini to'ldirish vaqti keldi!</b>
━━━━━━━━━━━━━━━━━━━━
📄 <b>Shartnoma:</b> №${contract.contract_number}
🤖 <b>Kofemashina:</b> ${contract.machine_model}
📅 <b>Rejali xarid sanasi:</b> ${contract.next_purchase_date}

${itemsSummary ? `<b>Oxirgi buyurtmangiz:</b>\n${itemsSummary}\n` : ''}
Oxirgi buyurtmani takrorlaysizmi yoki boshqa ta'mlarni tanlaysizmi?
    `.trim(),
  },

  followupReminder: {
    ru: (contract: Contract) => `
⏳ <b>Напоминание о заказе капсул</b>
━━━━━━━━━━━━━━━━━━━━
Здравствуйте! Не забудьте пополнить запасы кофе для вашей машины <b>${contract.machine_model}</b> (договор №${contract.contract_number}).

По условиям договора минимальный объем заказа: <b>${contract.min_capsule_boxes} коробки</b> в месяц (аренда машины 0 сум).
Нажмите кнопку ниже, чтобы заказать в 1 клик! ☕
    `.trim(),
    uz: (contract: Contract) => `
⏳ <b>Kapsula buyurtmasi haqida eslatma</b>
━━━━━━━━━━━━━━━━━━━━
Assalomu alaykum! <b>${contract.machine_model}</b> (shartnoma №${contract.contract_number}) kofemashinangiz uchun kapsulalarni buyurtma qilishni unutmang.

Shartnoma shartlariga ko'ra oylik minimal hajm: <b>${contract.min_capsule_boxes} quti</b> (mashina ijarasi 0 so'm).
1 bosishda buyurtma berish uchun quyidagi tugmani bosing! ☕
    `.trim(),
  },

  myMachine: {
    ru: (contract: Contract) => {
      const statusLabels: Record<string, string> = {
        active: '🟢 Активен',
        paused: '🟡 Временно приостановлен',
        terminated: '🔴 Расторгнут',
        completed: '⚪ Завершен',
        machine_returned: '⚪ Кофемашина возвращена',
      };
      return `
☕ <b>Моя кофемашина</b>
━━━━━━━━━━━━━━━━━━━━
🤖 <b>Модель:</b> ${contract.machine_model}
📄 <b>Договор №:</b> ${contract.contract_number}
📅 <b>Дата договора:</b> ${contract.contract_start_date}
📊 <b>Статус:</b> ${statusLabels[contract.status] || contract.status}
📦 <b>Минимальный заказ:</b> ${contract.min_capsule_boxes} коробок / месяц
📅 <b>Следующая закупка:</b> <b>${contract.next_purchase_date}</b>
${contract.machine_serial ? `🔢 <b>Серийный номер:</b> ${contract.machine_serial}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
Аренда кофемашины: <b>0 сум</b> при заказе от ${contract.min_capsule_boxes} коробок капсул.
      `.trim();
    },
    uz: (contract: Contract) => {
      const statusLabels: Record<string, string> = {
        active: '🟢 Faol',
        paused: '🟡 Vaqtincha to\'xtatilgan',
        terminated: '🔴 Bekor qilingan',
        completed: '⚪ Yakunlangan',
        machine_returned: '⚪ Kofemashina qaytarilgan',
      };
      return `
☕ <b>Mening kofemashinam</b>
━━━━━━━━━━━━━━━━━━━━
🤖 <b>Model:</b> ${contract.machine_model}
📄 <b>Shartnoma №:</b> ${contract.contract_number}
📅 <b>Shartnoma sanasi:</b> ${contract.contract_start_date}
📊 <b>Holati:</b> ${statusLabels[contract.status] || contract.status}
📦 <b>Minimal buyurtma:</b> oyiga ${contract.min_capsule_boxes} quti
📅 <b>Keyingi xarid:</b> <b>${contract.next_purchase_date}</b>
${contract.machine_serial ? `🔢 <b>Seriya raqami:</b> ${contract.machine_serial}\n` : ''}
━━━━━━━━━━━━━━━━━━━━
Kofemashina ijarasi: ${contract.min_capsule_boxes} qutidan xarid qilinganda <b>0 so'm</b>.
      `.trim();
    },
  },

  minBoxesWarning: {
    ru: (currentBoxes: number, minRequired: number) => `
⚠️ <b>Контроль минимального заказа по договору!</b>
По вашему договору аренды минимальный заказ составляет <b>${minRequired} коробки</b> капсул.
Сейчас выбрано: <b>${currentBoxes} коробки</b>.

Пожалуйста, добавьте ещё <b>${minRequired - currentBoxes} шт</b> для оформления заказа с бесплатной арендой.
    `.trim(),
    uz: (currentBoxes: number, minRequired: number) => `
⚠️ <b>Shartnoma bo'yicha minimal hajm nazorati!</b>
Ijara shartnomangiz bo'yicha minimal buyurtma hajmi — <b>${minRequired} quti</b> kapsula.
Hozirda tanlangan: <b>${currentBoxes} quti</b>.

Iltimos, bepul ijara sharti bajarilishi uchun yana <b>${minRequired - currentBoxes} dona</b> qo'shing.
    `.trim(),
  },

  repeatOrderSuccess: {
    ru: (orderNumber: number, totalAmount: number) => `
✅ <b>Заказ #${orderNumber} успешно оформлен!</b>
━━━━━━━━━━━━━━━━━━━━
💰 Сумма к оплате: <b>${formatUZS(totalAmount)}</b>
🚚 Доставка по Ташкенту: Бесплатно
🕒 Мы уже передали заказ в обработку. Вы получите уведомление, когда курьер выедет к вам!
    `.trim(),
    uz: (orderNumber: number, totalAmount: number) => `
✅ <b>Buyurtma #${orderNumber} muvaffaqiyatli qabul qilindi!</b>
━━━━━━━━━━━━━━━━━━━━
💰 To'lov summasi: <b>${formatUZS(totalAmount)}</b>
🚚 Toshkent bo'ylab yetkazib berish: Bepul
🕒 Buyurtma yig'ilmoqda. Kuryer yo'lga chiqqanida xabar yuboramiz!
    `.trim(),
  },

  servicePrompt: {
    ru: `
🛠 <b>Нужна помощь с кофемашиной?</b>
Выберите возникшую проблему из списка ниже, и наш сервисный специалист свяжется с вами в течение 15 минут:
    `.trim(),
    uz: `
🛠 <b>Kofemashina bilan yordam kerakmi?</b>
Quyidagi ro'yxatdan muammoni tanlang va 15 daqiqa ichida servis mutaxassisimiz siz bilan bog'lanadi:
    `.trim(),
  },

  serviceIssues: {
    ru: {
      power: '🔴 Не включается',
      water: '💧 Не подаёт воду',
      brewing: '☕ Проблема с завариванием',
      cleaning: '🧼 Нужна чистка (декальцинация)',
      other: '❓ Другая проблема',
    },
    uz: {
      power: '🔴 Yoqilmayapti',
      water: '💧 Suv chiqarmayapti',
      brewing: '☕ Qahva damlashda muammo',
      cleaning: '🧼 Tozalash kerak (dekalsinatsiya)',
      other: '❓ Boshqa muammo',
    },
  },

  serviceTicketCreated: {
    ru: (ticketNumber: number, issue: string) => `
✅ <b>Заявка на сервис #SRV-${ticketNumber} принята!</b>
━━━━━━━━━━━━━━━━━━━━
⚠️ Проблема: <i>${issue}</i>
👨‍🔧 Наш инженер уже оповещен и свяжется с вами для оперативного устранения неисправности.
    `.trim(),
    uz: (ticketNumber: number, issue: string) => `
✅ <b>#SRV-${ticketNumber} raqamli servis arizasi qabul qilindi!</b>
━━━━━━━━━━━━━━━━━━━━
⚠️ Muammo: <i>${issue}</i>
👨‍🔧 Muhandisimiz ogohlantirildi va nosozlikni bartaraf etish uchun tez orada siz bilan bog'lanadi.
    `.trim(),
  },

  deliveryNotification: {
    ru: {
      confirmed: (orderNumber: number) => `📦 <b>Заказ #TEA-${orderNumber} подтвержден и собирается на складе!</b>`,
      delivering: (orderNumber: number) => `🚚 <b>Заказ #TEA-${orderNumber} передан курьеру и уже в пути к вам!</b>\nКурьер свяжется с вами по прибытии.`,
      completed: (orderNumber: number) => `✅ <b>Заказ #TEA-${orderNumber} успешно доставлен!</b>\nПриятного кофепития с TeaCoff! ☕✨`,
    },
    uz: {
      confirmed: (orderNumber: number) => `📦 <b>#TEA-${orderNumber} raqamli buyurtma tasdiqlandi va omborda yig'ilmoqda!</b>`,
      delivering: (orderNumber: number) => `🚚 <b>#TEA-${orderNumber} raqamli buyurtma kuryerga topshirildi va yo'lda!</b>\nKuryer yetib kelgach siz bilan bog'lanadi.`,
      completed: (orderNumber: number) => `✅ <b>#TEA-${orderNumber} raqamli buyurtma yetkazildi!</b>\nTeaCoff bilan yoqimli qahva damlash tilaymiz! ☕✨`,
    },
  },

  managerAlertInaction: (contract: Contract) => `
⚠️ <b>ВНИМАНИЕ МЕНЕДЖЕРУ: Клиент не оформил заказ после напоминания!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${contract.customer_name}
📞 <b>Телефон:</b> <code>${contract.customer_phone}</code>
📄 <b>Договор:</b> №${contract.contract_number}
☕ <b>Кофемашина:</b> ${contract.machine_model}
📅 <b>Плановая закупка:</b> ${contract.next_purchase_date}
🕒 <b>Статус:</b> Напоминание отправлено, заказ не создан более 5 дней.

👉 <i>Рекомендуется связаться с клиентом для уточнения запасов капсул.</i>
  `.trim(),
};
