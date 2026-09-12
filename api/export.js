const {ADMIN_TOKEN, json, method} = require('./_lib');
function cell(value) { return `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`; }
module.exports = async (req, res) => {
  if (!method(req, res, 'GET')) return;
  if (!ADMIN_TOKEN || req.query.token !== ADMIN_TOKEN) return json(res, 401, {error: 'unauthorized'});
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase 环境变量尚未配置');
    const response = await fetch(`${url}/rest/v1/survey_records?select=*&order=created_at.asc`, {headers: {'apikey': key, 'Authorization': `Bearer ${key}`}});
    if (!response.ok) throw new Error(`Supabase 读取失败：${response.status}`);
    const rows = await response.json();
    if (req.query.format === 'csv') {
      const headers = ['id','record_type','participant_id','post_id','scope','created_at','payload'];
      const csv = '﻿' + [headers.join(','), ...rows.map(row => headers.map(header => cell(typeof row[header] === 'object' ? JSON.stringify(row[header]) : row[header])).join(','))].join('\n');
      res.setHeader('Content-Type','text/csv; charset=utf-8');
      res.setHeader('Content-Disposition','attachment; filename="then-next-survey.csv"');
      res.setHeader('Cache-Control','no-store');
      return res.status(200).send(csv);
    }
    res.setHeader('Content-Type','application/x-ndjson; charset=utf-8');
    res.setHeader('Content-Disposition','attachment; filename="then-next-survey.jsonl"');
    res.setHeader('Cache-Control','no-store');
    res.status(200).send(rows.map(row => JSON.stringify(row)).join('\n'));
  } catch (error) { json(res, 500, {error: error.message}); }
};
