# 然后呢？读者调研

Vercel + Supabase 的读者侧调查问卷。前端为简洁的知乎风格蓝白黑界面，支持电脑和手机浏览器。

## 仓库内容

- `public/`：问卷页面、样式、浏览器行为采集、管理员下载页
- `api/`：Vercel Serverless API
- `data/posts.json`：30篇调查帖子，A/B/C三类各10篇
- `supabase/schema.sql`：Supabase建表和权限脚本
- `vercel.json`：Vercel配置
- `DEPLOY.md`：交给部署 Agent 的逐步部署说明
- `server.js`：本地开发服务

## 线上部署

请先阅读 `DEPLOY.md`。线上答卷不会写入 GitHub 或本地文件，而是写入 Supabase `survey_records` 表。参与者只发送数据，不能查询数据；管理员通过 `/admin.html` 和 `ADMIN_TOKEN` 下载 CSV/JSONL。

## 安全

环境变量只能配置在 Vercel 后台：`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`ADMIN_TOKEN`。不要提交 `.env`、答卷、CSV 或 Supabase 密钥。

## 快速本地运行

```sh
cd "/Users/alano/然后呢"
ADMIN_TOKEN='local-test-password' node server.js
```

然后打开 `http://localhost:3000`。本地数据在 `data/responses.jsonl`，正式线上数据在 Supabase。
