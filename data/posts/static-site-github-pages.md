# 静态站点与 GitHub Pages 部署指南

![部署图示](https://via.placeholder.com/1200x540?text=GitHub+Pages)

## 为什么选择静态站点

- 部署简单
- 运行速度快
- 安全性高

通过纯静态 HTML/CSS/JS，你可以用最少的运维成本搭建个人博客。

## 部署步骤

1. 将仓库推送到 GitHub
2. 打开仓库设置中的 Pages
3. 选择 `main` 分支的根目录
4. 等待页面生成并访问站点

```bash
git add .
git commit -m "Deploy blog"
git push origin main
```

静态站点非常适合写作和思考的沉淀。