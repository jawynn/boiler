import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validate environment variables
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('ERROR: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env file');
  process.exit(1);
}

app.post('/api/send-telegram', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    
    // Validate input
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and phone are required' 
      });
    }

    console.log('Sending message to Telegram:', { name, phone, message });
    
    const text = `
🔔 Новая заявка!
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${message || 'Не указано'}
    `;

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log('Telegram API URL:', telegramUrl);

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    console.log('Telegram API response:', data);

    if (!data.ok) {
      console.error('Telegram API error:', data);
      throw new Error(data.description || 'Failed to send telegram message');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
  console.log('Telegram bot configuration:');
  console.log('- Bot token length:', TELEGRAM_BOT_TOKEN?.length || 0);
  console.log('- Chat ID:', TELEGRAM_CHAT_ID);
});
