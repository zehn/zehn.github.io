# 个人静态博客模板

这是一个适合 GitHub Pages 的简约静态博客项目，带有两个独立页面：技术博客和思考时间线。

## 页面说明

- `index.html` — 主页，展示网站概览与两个主要入口
- `blog.html` — 技术博客页面，展示文章列表和搜索入口
- `timeline.html` — 思考时间线页面，仅展示日期与思考内容
- `styles.css` — 主题样式，提供简约美观的视觉风格
- `script.js` — 渲染博客文章和时间线记录的交互逻辑

## 使用方式

1. 将仓库推送到 GitHub。
2. 在仓库设置中开启 `Pages`。
3. 选择 `branch: main`，`folder: / (root)`。
4. 保存后几分钟，站点将自动生成。

## 本地预览

可以用本地静态服务器查看：

```bash
cd zehn.github.io
python3 -m http.server 8000
```

然后在浏览器中打开：

```text
http://localhost:8000
```

## TODO

- 补充更多文章与时间线内容
- 添加深色/浅色模式切换
- 引入 RSS、分享按钮或评论功能
- 增加更多独立页面，如关于页、归档页
