# 给部署 Agent 的完整说明

仓库：`https://github.com/alano-666/then-next-survey`

目标：Vercel 部署问卷和 API，Supabase 保存数据。不要把任何密钥写入仓库、前端代码或聊天记录。

## 1. Supabase

1. 创建 Supabase 项目。
2. 打开 SQL Editor，执行 `supabase/schema.sql` 全部内容。
3. 在 Project Settings → API 取得：
   - Project URL
   - `service_role` secret key

只把这两个值作为 Vercel 服务端环境变量使用。不要使用 `anon` key 代替 service role key。

## 2. Vercel

可以使用 Vercel 控制台导入这个 GitHub 仓库，也可以用 CLI：

```sh
vercel link
vercel --prod
```

Framework Preset 选择 `Other`。本仓库已经有 `vercel.json`，不要手动把 `api` 目录移动到 `public`。

添加环境变量（Production、Preview、Development 至少 Production）：

```text
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<Supabase service_role secret>
ADMIN_TOKEN=<长随机字符串>
```

如果使用自定义域名，再设置：

```text
ALLOWED_ORIGIN=https://<最终问卷域名>
```

设置环境变量后重新部署：

```sh
vercel --prod
```

## 3. 验证部署

1. 打开部署根链接。
2. 勾选同意并开始调查。
3. 确认返回5篇帖子，类别中至少有A、B、C。
4. 完成一轮测试答卷。
5. 到 Supabase Table Editor → `survey_records`，确认出现 `session`、`event`、`response` 记录。
6. 打开 `<部署域名>/admin.html`，输入 `ADMIN_TOKEN`，下载CSV。
7. 用手机4G/5G和电脑分别打开根链接测试。

## 4. 不要做的事

- 不要把 `.env`、service role key、ADMIN_TOKEN、`data/responses.jsonl`、CSV上传到GitHub。
- 不要关闭 `survey_records` 的 RLS。
- 不要给 `anon` 或 `authenticated` 添加读取答卷的 policy。
- 不要把 `ADMIN_TOKEN`写进 `public/app.js`。
- 不要把参与者链接设置为 `/admin.html`。

## 5. 帖子库

帖子位于 `data/posts.json`，每项只有以下字段：

```text
post_id, title, body, source_url, author, published_at, category, word_count, topic
```

正式研究前应人工复核帖子来源、展示内容和转载/研究使用权限。当前正文是材料中的摘录，不一定是原文全文。

## 6. 本地调试

本地 Node 服务和线上 Vercel API 是两种模式：

```sh
ADMIN_TOKEN='local-test-password' node server.js
```

打开 `http://localhost:3000`。本地答卷保存在 `data/responses.jsonl`，该文件已被 `.gitignore` 排除。
