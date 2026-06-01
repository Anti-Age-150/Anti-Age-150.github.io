# GitHub Pages 评论区实现说明

这份说明对应当前仓库里 `About Me` 页面下方的评论区实现。结论先说：

- GitHub Pages 只负责托管静态页面。
- 评论数据不存放在 GitHub Pages 本身，而是交给第三方后端。
- 你当前使用的是 `Valine + LeanCloud` 方案。

## 当前仓库里已经做了什么

### 1. 评论容器已经放到 About 页面

`About Me` 页面里已经有评论挂载点：

- `2026/04/02/about/index.html`
- 容器是 `<div id="vcomment" class="comment"></div>`

这意味着页面只要加载到 `Valine` 脚本，就会把评论表单和评论列表渲染到这个位置。

### 2. 全站已经加载了 Valine 的脚本

`index.html` 的 `<head>` 里引入了：

- `/js/valine/index.js`

这一步提供了 `Valine` 构造函数。

### 3. 页面底部已经初始化 Valine

`index.html` 底部脚本中已经写了初始化逻辑：

- `el: '#vcomment'`
- `path: window.location.pathname`
- `app_id`
- `app_key`
- `placeholder`
- `enableQQ: true`

同时它还用 `$(comment_el).length` 判断当前页面是否存在 `.comment` 容器，只有存在时才初始化，这样可以避免全站每一页都强行加载评论。

### 4. About 页还做了样式定制

`2026/04/02/about/index.html` 中，评论区外层包含了样式定制：

- `#comments` 背景和圆角
- `#veditor` 输入框背景图
- 隐藏 `vpower`
- 调整评论卡片阴影和圆角

这部分只影响显示，不影响评论功能本身。

## 这套方案为什么适合 GitHub Pages

GitHub Pages 不能直接提供数据库和服务端逻辑，但 `Valine` 的工作方式正好适配静态站点：

1. 页面在 GitHub Pages 上静态加载。
2. 用户在页面上输入评论。
3. `Valine` 通过 LeanCloud API 保存和读取评论。
4. 评论列表再渲染回静态页面。

也就是说，GitHub Pages 只是前端入口，评论的持久化不依赖 Pages 本身。

## 实现步骤

### Step 1: 准备 LeanCloud 应用

需要在 LeanCloud 创建一个应用，拿到：

- `appId`
- `appKey`

这两个值会写进 `Valine` 初始化配置里。

### Step 2: 在页面中放评论挂载点

最小结构如下：

```html
<section id="comments">
  <div id="vcomment" class="comment"></div>
</section>
```

关键点：

- `id="vcomment"` 是 `Valine` 的挂载目标。
- `class="comment"` 可以作为是否需要初始化的判断条件。

### Step 3: 引入 Valine 脚本

在 `head` 或页面底部引入 `Valine`：

```html
<script src="/js/valine/index.js"></script>
```

如果不是本地打包，也可以使用 CDN 版本，但你当前仓库是本地静态资源方式。

### Step 4: 初始化 Valine

示例：

```html
<script>
  new Valine({
    el: '#vcomment',
    path: window.location.pathname,
    app_id: '你的 appId',
    app_key: '你的 appKey',
    placeholder: '欢迎评论',
    notify: false,
    verify: false,
    enableQQ: true
  });
</script>
```

你当前仓库里的配置还额外带了：

- `metaPlaceholder`
- `requiredFields`
- `tagMeta`
- `master`

这些属于增强配置，不是必须项。

### Step 5: 让每个页面拥有稳定的评论路径

`path: window.location.pathname` 的作用是把不同页面的评论隔离开。

例如：

- `/2026/04/02/about/`
- `/2026/05/14/LLM-Harness/`

会分别对应不同的评论线程。

### Step 6: 处理 PJAX 或局部跳转

如果站点用了 PJAX，评论脚本不能只在首次加载时执行一次。

你现在的代码已经做了：

- `$(document).ready(load_valine);`
- `document.addEventListener('pjax:complete', function () { load_valine(); });`

这一步很重要，否则点击站内链接跳转到 About 页后，评论区可能不会重新初始化。

## 对当前仓库的具体判断

当前仓库里这套评论区已经基本完整，核心依赖链如下：

1. 页面上有 `#vcomment.comment` 容器。
2. 全局加载了 `Valine` 脚本。
3. 底部脚本用 `app_id` / `app_key` 初始化。
4. `path` 使用当前 URL 做评论隔离。
5. PJAX 完成后重新执行 `load_valine()`。

因此，`About Me` 页面下方评论区不是“GitHub Pages 自带功能”，而是一个外接评论服务的前端集成。

## 如果你要把它复用到别的页面

直接复用这三段即可：

1. 评论容器
2. `Valine` 脚本引用
3. 初始化脚本

如果是 Hexo / 主题系统，还要确认主题模板里不会在二次渲染时漏掉评论区容器。

## 维护建议

- `app_id` / `app_key` 不要随便换，否则历史评论会断开。
- 只要页面路径变化，评论线程也会变化，所以重构 URL 时要谨慎。
- 如果你想关闭评论弹幕逻辑，可以把 `themeDanmu` 和 `isBarrager` 相关代码删掉，只保留 `Valine` 初始化。
- `#vcomment .vpower { display: none; }` 会隐藏 Valine 页脚标识，如果你想保留品牌信息，可以去掉这段。

## 参考来源

- 本仓库 `index.html`
- 本仓库 `2026/04/02/about/index.html`
- Valine 官方快速开始文档：`https://valine.js.org/quickstart.html`
- Valine 官方配置文档：`https://valine.js.org/configuration.html`

