import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, source } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  const filePath = path.join('/tmp', 'stillher_subscribers.json');
  let list = [];
  try { list = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch {}

  // Deduplicate
  if (!list.find(e => e.email === email)) {
    list.push({ email, source: source || 'unknown', ts: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
  }

  res.status(200).json({ ok: true });
}
