const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const RESPONSES_FILE = path.join(DATA_DIR, 'responses.jsonl');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(RESPONSES_FILE)) fs.writeFileSync(RESPONSES_FILE, '');

function posts() {
  return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 2e6) reject(new Error('payload too large')); });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('invalid json')); } });
    req.on('error', reject);
  });
}
function send(res, status, value, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store'});
  res.end(type.startsWith('application/json') ? JSON.stringify(value) : value);
}
function choosePosts() {
  const pool = posts();
  const byCategory = pool.reduce((a, p) => ((a[p.category] ||= []).push(p), a), {});
  const categories = ['A', 'B', 'C'];
  if (categories.some(c => !byCategory[c]?.length)) throw new Error('A、B、C三类帖子都至少需要一篇');
  const selected = categories.map(c => byCategory[c][Math.floor(Math.random() * byCategory[c].length)]);
  const remaining = pool.filter(p => !selected.some(s => s.post_id === p.post_id));
  while (selected.length < 5 && remaining.length) selected.push(remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0]);
  return selected.sort(() => Math.random() - 0.5);
}
function safePost(p) {
  return {
    post_id: p.post_id,
    title: p.title,
    body: p.body,
    source_url: p.source_url,
    author: p.author,
    published_at: p.published_at,
    category: p.category,
    word_count: p.word_count,
    topic: p.topic
  };
}
function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
}
function exportCsv() {
  const lines = fs.readFileSync(RESPONSES_FILE, 'utf8').trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
  const headers = ['type','participantId','scope','postId','postIndex','event','at','receivedAt','answers','dwellMs','scrollDepth','viewportWidth','viewportHeight','userAgent'];
  return [headers.join(','), ...lines.map(row => headers.map(key => csvCell(typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key])).join(','))].join('\n') + '\n';
}
function append(record) { fs.appendFileSync(RESPONSES_FILE, JSON.stringify(record) + '\n'); }

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === '/api/session' && req.method === 'POST') {
      const id = crypto.randomUUID();
      const assigned = choosePosts();
      append({ type: 'session', participantId: id, createdAt: new Date().toISOString(), assignedPostIds: assigned.map(p => p.post_id) });
      return send(res, 201, { participantId: id, posts: assigned.map(safePost) });
    }
    if (url.pathname === '/api/event' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.participantId || !body.event) return send(res, 400, {error: 'participantId and event are required'});
      append({ type: 'event', ...body, receivedAt: new Date().toISOString() });
      return send(res, 201, {ok: true});
    }
    if (url.pathname === '/api/response' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body.participantId || !body.scope || !body.answers) return send(res, 400, {error: 'invalid response'});
      append({ type: 'response', ...body, receivedAt: new Date().toISOString() });
      return send(res, 201, {ok: true});
    }
    if (url.pathname === '/api/export' && req.method === 'GET') {
      if (!ADMIN_TOKEN || url.searchParams.get('token') !== ADMIN_TOKEN) return send(res, 401, {error: 'unauthorized'});
      if (url.searchParams.get('format') === 'csv') {
        res.writeHead(200, {'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="then-next-survey.csv"','Cache-Control':'no-store'});
        return res.end('﻿' + exportCsv());
      }
      return send(res, 200, fs.readFileSync(RESPONSES_FILE, 'utf8'), 'application/x-ndjson; charset=utf-8');
    }
    const file = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
    const filePath = path.normalize(path.join(PUBLIC, file));
    if (!filePath.startsWith(PUBLIC) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return send(res, 404, {error: 'not found'});
    const ext = path.extname(filePath);
    const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
    return send(res, 200, fs.readFileSync(filePath), types[ext] || 'application/octet-stream');
  } catch (error) { console.error(error); send(res, 500, {error: error.message}); }
});
server.listen(PORT, () => console.log(`Then Next survey running at http://localhost:${PORT}`));
