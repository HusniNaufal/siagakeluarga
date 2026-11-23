// Pengiriman pengingat ke grup keluarga lewat Telegram Bot API. Aktif hanya bila TELEGRAM_BOT_TOKEN diisi.
const token = () => process.env.TELEGRAM_BOT_TOKEN;
export const telegramAktif = () => Boolean(token());

export const kirimPesanTelegram = async (chatId, teks) => {
  if (!telegramAktif()) throw new Error('TELEGRAM_BOT_TOKEN belum diisi');
  const res = await fetch(`https://api.telegram.org/bot${token()}/sendMessage`, {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: teks, disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`Telegram merespons ${res.status}`);
  return true;
};
