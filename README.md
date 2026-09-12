# 然后呢？读者调研

蓝白黑配色、手机适配的读者问卷。每人随机看到5篇帖子，A/B/C三类至少各1篇。

## 线上部署：Vercel + Supabase

1. 在 Supabase 创建项目，在 SQL Editor 执行 `supabase/schema.sql`。
2. 将本仓库导入 Vercel，Framework Preset 选 Other，Output Directory 为 `public`。
3. 在 Vercel 环境变量中设置：
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`（仅服务器环境变量，绝不能放进前端）
   - `ADMIN_TOKEN`（长随机密码，只有研究人员持有）
4. 部署后打开网站参与问卷；打开 `/admin.html` 输入管理员密码下载 CSV / JSONL。
5. 修改环境变量后重新部署。

Supabase 数据表启用 RLS，匿名用户无法直接读取答卷。只有 Vercel 服务端使用 service role key 读写。

## 本地运行

```sh
cd "/Users/alano/然后呢"
ADMIN_TOKEN='自行设置长密码' node server.js
```

浏览器打开 http://localhost:3000；本地模式数据在 `data/responses.jsonl`，不会上传至 GitHub。线上模式数据在 Supabase。

## 帖子

编辑 `data/posts.json`。只保留 `post_id/title/body/source_url/author/published_at/category/word_count/topic` 九个字段。

当前正文为空，仅供流程测试。实际招募前录入可使用的帖子；不要把测试数据与正式调研混合。

## 数据与权限

- 仓库仅包含代码、空帖子模板和建表脚本，不包含 PRD、问卷 DOCX、答卷和密钥。
- 管理员密码不是参与者密码；不要把它发给参与者。
- 前端公开不等于数据公开。不要关闭数据库 RLS，也不要创建允许匿名读取答卷的 policy。
- Vercel/Supabase 的免费额度及大陆网络可达性以实际服务为准，上线后应做跨网络实测。
