// // telegram-bot/bot.js
// const TelegramBot = require('node-telegram-bot-api');

// const token = '7825192538:AAHB1SLjRp6gfs2KT1stJsMlMclCW5v2t-M';
// const bot = new TelegramBot(token, { polling: true });

// // Admin chat ID
// const ADMIN_CHAT_ID = '5135714918';

// // Karta raqami
// const CARD_NUMBER = '9860 0201 0281 8653';
// const CARD_HOLDER = 'Shamsiddin';

// // /start komandasi
// bot.onText(/\/start$/, (msg) => {
//   const chatId = msg.chat.id;
  
//   bot.sendMessage(chatId, 
//     '🍽️ Restoran buyurtma botiga xush kelibsiz!\n\n' +
//     'Buyurtma berish uchun saytdan to\'lov usulini tanlang.'
//   );
// });

// // Buyurtma kelganda
// bot.onText(/\/start order_(.+)/, (msg, match) => {
//   const chatId = msg.chat.id;
//   const orderId = match[1];
  
//   // Mijozga karta raqamini yuborish
//   bot.sendMessage(chatId,
//     `💳 *To'lov ma'lumotlari:*\n\n` +
//     `Karta raqami: \`${CARD_NUMBER}\`\n` +
//     `Egasi: ${CARD_HOLDER}\n\n` +
//     `📋 Buyurtma ID: ${orderId}\n\n` +
//     `Pul o'tkazganingizdan so'ng screenshot yuboring!`,
//     { parse_mode: 'Markdown' }
//   );
  
//   // Adminga xabar
//   bot.sendMessage(ADMIN_CHAT_ID,
//     `🔔 Yangi buyurtma kutilmoqda!\n` +
//     `Buyurtma ID: ${orderId}\n` +
//     `Mijoz: ${msg.from.first_name || 'Anonim'}`
//   );
// });

// // Screenshot kelganda
// bot.on('photo', (msg) => {
//   const chatId = msg.chat.id;
  
//   // Screenshot'ni adminga yuborish
//   bot.forwardMessage(ADMIN_CHAT_ID, chatId, msg.message_id);
  
//   bot.sendMessage(chatId,
//     '✅ Screenshot qabul qilindi!\n\n' +
//     'Tez orada buyurtmangiz tasdiqlanadi va tayyorlanadi.'
//   );
  
//   bot.sendMessage(ADMIN_CHAT_ID,
//     `📸 To'lov screenshot yuborildi!\n` +
//     `Mijoz: ${msg.from.first_name || 'Anonim'}`
//   );
// });

// console.log('Bot ishga tushdi! 🤖');

// telegram-bot/bot.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// ✅ CONFIG
const token = process.env.BOT_TOKEN || '7825192538:AAHB1SLjRp6gfs2KT1stJsMlMclCW5v2t-M';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '5135714918';
const CARD_NUMBER = process.env.CARD_NUMBER || '9860 0201 0281 8653';
const CARD_HOLDER = process.env.CARD_HOLDER || 'Shamsiddin';

// ✅ Bot yaratish
const bot = new TelegramBot(token, { 
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// ✅ Buyurtmalarni saqlash
const pendingOrders = new Map();

// ===================================
// ✅ /START KOMANDASI
// ===================================
bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Foydalanuvchi';
  
  bot.sendMessage(chatId, 
    `👋 Assalomu alaykum, ${firstName}!\n\n` +
    `🍽️ Restoran buyurtma botiga xush kelibsiz!\n\n` +
    `📱 *Buyurtma berish tartibi:*\n\n` +
    `1️⃣ Saytdan ovqatlarni tanlang\n` +
    `2️⃣ "Telegram orqali to'lash" tugmasini bosing\n` +
    `3️⃣ Bu botga kelib karta raqamini oling\n` +
    `4️⃣ To'lovni amalga oshiring\n` +
    `5️⃣ Screenshot yuboring\n\n` +
    `❓ Yordam: /help`,
    { parse_mode: 'Markdown' }
  );
});

// ===================================
// ✅ /HELP KOMANDASI
// ===================================
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId,
    `📖 *Yordam*\n\n` +
    `🔹 /start - Botni ishga tushirish\n` +
    `🔹 Buyurtma berish uchun saytdan boshlang\n` +
    `🔹 To'lov screenshot'ini yuboring\n\n` +
    `📞 Murojaat: ${CARD_HOLDER}\n` +
    `💳 Karta: \`${CARD_NUMBER}\``,
    { parse_mode: 'Markdown' }
  );
});

// ===================================
// ✅ BUYURTMA KELGANDA (Deep Link)
// ===================================
bot.onText(/\/start order_(.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const orderId = match[1];
  const firstName = msg.from.first_name || 'Anonim';
  const username = msg.from.username ? `@${msg.from.username}` : 'Username yo\'q';
  
  // Buyurtmani saqlash
  pendingOrders.set(orderId, {
    chatId,
    firstName,
    username,
    timestamp: new Date()
  });
  
  console.log(`📦 Yangi buyurtma: ${orderId} - ${firstName}`);
  
  // ✅ Mijozga karta raqamini yuborish
  bot.sendMessage(chatId,
    `💳 *To'lov ma'lumotlari*\n\n` +
    `📋 Buyurtma ID: \`${orderId}\`\n\n` +
    `💰 *Karta raqami:*\n` +
    `\`${CARD_NUMBER}\`\n\n` +
    `👤 *Egasi:* ${CARD_HOLDER}\n\n` +
    `━━━━━━━━━━━━━━━━━\n\n` +
    `📸 *Keyingi qadamlar:*\n` +
    `1️⃣ Yuqoridagi karta raqamiga pul o'tkazing\n` +
    `2️⃣ To'lov screenshot'ini bu yerga yuboring\n` +
    `3️⃣ Buyurtmangiz tasdiqlanadi\n\n` +
    `⏰ Tez orada ovqatlaringiz tayyorlanadi!\n\n` +
    `❓ Savol bo'lsa: /help`,
    { 
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '📋 Buyurtma haqida', callback_data: `order_info_${orderId}` }
        ]]
      }
    }
  );
  
  // ✅ Adminga xabar
  bot.sendMessage(ADMIN_CHAT_ID,
    `🔔 *YANGI BUYURTMA!*\n\n` +
    `📋 ID: \`${orderId}\`\n` +
    `👤 Mijoz: ${firstName}\n` +
    `📱 Username: ${username}\n` +
    `🕐 Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}\n\n` +
    `⏳ To'lov kutilmoqda...`,
    { parse_mode: 'Markdown' }
  );
});

// ===================================
// ✅ CALLBACK QUERY (Inline tugmalar)
// ===================================
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  // Buyurtma ma'lumotlari
  if (data.startsWith('order_info_')) {
    const orderId = data.replace('order_info_', '');
    
    bot.answerCallbackQuery(query.id);
    
    bot.sendMessage(chatId,
      `📋 *Buyurtma: ${orderId}*\n\n` +
      `Buyurtmangiz qabul qilindi va to'lov kutilmoqda.\n\n` +
      `To'lov screenshot'ini yuborganingizdan keyin ` +
      `buyurtmangiz tasdiqlanadi va tayyorlanadi.\n\n` +
      `💳 Karta: \`${CARD_NUMBER}\`\n` +
      `👤 Egasi: ${CARD_HOLDER}`,
      { parse_mode: 'Markdown' }
    );
  }
  
  // ✅ Admin tasdiqlash
  if (data.startsWith('approve_')) {
    const orderId = data.replace('approve_', '');
    const orderData = pendingOrders.get(orderId);
    
    if (orderData) {
      bot.sendMessage(orderData.chatId,
        `✅ *To'lov tasdiqlandi!*\n\n` +
        `📋 Buyurtma ID: ${orderId}\n\n` +
        `👨‍🍳 Buyurtmangiz tayyorlanmoqda...\n` +
        `Tez orada ovqatlaringiz yetkaziladi!\n\n` +
        `Yoqimli ishtaha! 🍽️`,
        { parse_mode: 'Markdown' }
      );
      
      bot.editMessageReplyMarkup(
        { inline_keyboard: [[
          { text: '✅ Tasdiqlandi', callback_data: 'confirmed' }
        ]] },
        {
          chat_id: ADMIN_CHAT_ID,
          message_id: query.message.message_id
        }
      );
      
      bot.answerCallbackQuery(query.id, {
        text: '✅ To\'lov tasdiqlandi!',
        show_alert: true
      });
      
      console.log(`✅ Buyurtma tasdiqlandi: ${orderId}`);
      pendingOrders.delete(orderId);
    } else {
      bot.answerCallbackQuery(query.id, {
        text: '❌ Buyurtma topilmadi',
        show_alert: true
      });
    }
  }
  
  // ✅ Admin rad etish
  if (data.startsWith('reject_')) {
    const orderId = data.replace('reject_', '');
    const orderData = pendingOrders.get(orderId);
    
    if (orderData) {
      bot.sendMessage(orderData.chatId,
        `❌ *To'lov rad etildi*\n\n` +
        `📋 Buyurtma ID: ${orderId}\n\n` +
        `Iltimos, to'lovni qayta amalga oshiring ` +
        `yoki yordam uchun murojaat qiling.\n\n` +
        `📞 Yordam: /help`,
        { parse_mode: 'Markdown' }
      );
      
      bot.editMessageReplyMarkup(
        { inline_keyboard: [[
          { text: '❌ Rad etildi', callback_data: 'rejected' }
        ]] },
        {
          chat_id: ADMIN_CHAT_ID,
          message_id: query.message.message_id
        }
      );
      
      bot.answerCallbackQuery(query.id, {
        text: '❌ To\'lov rad etildi',
        show_alert: true
      });
      
      console.log(`❌ Buyurtma rad etildi: ${orderId}`);
      pendingOrders.delete(orderId);
    } else {
      bot.answerCallbackQuery(query.id, {
        text: '❌ Buyurtma topilmadi',
        show_alert: true
      });
    }
  }
});

// ===================================
// ✅ SCREENSHOT QABUL QILISH
// ===================================
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Anonim';
  const username = msg.from.username ? `@${msg.from.username}` : 'Username yo\'q';
  
  // Buyurtma ID topish
  let orderId = 'unknown';
  for (const [id, data] of pendingOrders.entries()) {
    if (data.chatId === chatId) {
      orderId = id;
      break;
    }
  }
  
  console.log(`📸 Screenshot qabul qilindi: ${firstName} (Order: ${orderId})`);
  
  // ✅ Mijozga tasdiqlash
  bot.sendMessage(chatId,
    `✅ *Screenshot qabul qilindi!*\n\n` +
    `📋 Buyurtma ID: \`${orderId}\`\n\n` +
    `⏳ To'lovingiz tekshirilmoqda...\n` +
    `Tez orada sizga xabar beramiz!\n\n` +
    `Biroz sabr qiling... ⏰`,
    { parse_mode: 'Markdown' }
  );
  
  // ✅ Adminga screenshot yuborish
  const photo = msg.photo[msg.photo.length - 1]; // Eng katta o'lcham
  
  bot.sendPhoto(ADMIN_CHAT_ID, photo.file_id, {
    caption: 
      `📸 *TO'LOV SCREENSHOT*\n\n` +
      `📋 Buyurtma ID: \`${orderId}\`\n` +
      `👤 Mijoz: ${firstName}\n` +
      `📱 Username: ${username}\n` +
      `🕐 Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}\n\n` +
      `Tasdiqlaysizmi?`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '✅ Tasdiqlash', callback_data: `approve_${orderId}` },
        { text: '❌ Rad etish', callback_data: `reject_${orderId}` }
      ]]
    }
  });
});

// ===================================
// ✅ BOSHQA XABARLAR
// ===================================
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Agar rasm yoki komanda bo'lmasa
  if (!msg.photo && !msg.text?.startsWith('/') && msg.text) {
    bot.sendMessage(chatId,
      `ℹ️ Buyurtma berish uchun saytdan boshlang.\n\n` +
      `Yordam: /help`
    );
  }
});

// ===================================
// ✅ XATOLIKLARNI USHLASH
// ===================================
bot.on('polling_error', (error) => {
  console.error('❌ Polling xato:', error.code, error.message);
});

bot.on('error', (error) => {
  console.error('❌ Bot xato:', error);
});

// ===================================
// ✅ BOT ISHGA TUSHGANDA
// ===================================
bot.getMe().then((botInfo) => {
  console.log('\n✅ ════════════════════════════════════');
  console.log('✅ BOT ISHGA TUSHDI!');
  console.log('✅ ════════════════════════════════════');
  console.log(`🤖 Bot: @${botInfo.username}`);
  console.log(`📋 ID: ${botInfo.id}`);
  console.log(`👤 Admin: ${ADMIN_CHAT_ID}`);
  console.log(`💳 Karta: ${CARD_NUMBER}`);
  console.log(`⏰ Vaqt: ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`);
  console.log('✅ ════════════════════════════════════\n');
}).catch((err) => {
  console.error('❌ Bot ishga tushmadi:', err.message);
  process.exit(1);
});

// ===================================
// ✅ GRACEFUL SHUTDOWN
// ===================================
process.on('SIGINT', () => {
  console.log('\n👋 Bot to\'xtatilmoqda...');
  bot.stopPolling();
  console.log('✅ Bot to\'xtatildi');
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
});