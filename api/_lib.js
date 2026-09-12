const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function getPosts() {
  const file = path.join(process.cwd(), 'data', 'posts.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function cors(res, type = 'application/json; charset=utf-8') {
  res.setHeader('Content-Type', type);
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}
function json(res, status, body) { cors(res); res.status(status).json(body); }
function method(req, res, allowed) {
  if (req.method === 'OPTIONS') { cors(res); res.status(204).end(); return false; }
  if (req.method !== allowed) { res.setHeader('Allow', allowed); json(res, 405, {error: 'method not allowed'}); return false; }
  return true;
}
async function insert(record) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase 环境变量尚未配置');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/survey_records`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'apikey': SUPABASE_SERVICE_ROLE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Prefer': 'return=minimal'},
    body: JSON.stringify(record)
  });
  if (!response.ok) throw new Error(`Supabase 写入失败：${response.status}`);
}
function choosePosts() {
  const pool = getPosts();
  const groups = pool.reduce((all, post) => ((all[post.category] ||= []).push(post), all), {});
  if (['A','B','C'].some(category => !groups[category]?.length)) throw new Error('A、B、C三类帖子都至少需要一篇');
  const selected = ['A','B','C'].map(category => groups[category][Math.floor(Math.random() * groups[category].length)]);
  const rest = pool.filter(post => !selected.some(item => item.post_id === post.post_id));
  while (selected.length < 5 && rest.length) selected.push(rest.splice(Math.floor(Math.random() * rest.length), 1)[0]);
  return selected.sort(() => Math.random() - 0.5);
}
function publicPost(post) { return {...post}; }
module.exports = {ADMIN_TOKEN, choosePosts, publicPost, insert, json, method};
