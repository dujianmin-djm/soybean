<div align="center">
	<h1>SoybeanAdmin</h1>
  <span>中文 | <a href="./README.en_US.md">English</a></span>
</div>

## 简介

项目是一套完整的企业级后台管理解决方案，前后端分离的SPA应用。前端采用 Vue 3 + TypeScript + Vite 技术栈，基于 [soybean-admin](https://github.com/soybeanjs/soybean-admin) 进行二次开发；后端采用 .NET 技术栈，基于 [ABP Framework](https://github.com/abpframework/abp) 实现领域驱动设计，提供 RESTful API 接口。

本仓库是系统前端。已实现用户管理、角色管理、员工、岗位、部门等页面功能，配套后端使用。[后端仓库地址](https://github.com/dujianmin-djm/xd.pms)。

## 特性

- **前沿技术应用**：采用 Vue3, Vite7, TypeScript, Pinia 和 UnoCSS 等最新流行的技术栈。
- **清晰的项目架构**：采用 pnpm monorepo 架构，结构清晰，优雅易懂。
- **严格的代码规范**：遵循 [SoybeanJS 规范](https://docs.soybeanjs.cn/zh/standard)，集成了eslint, prettier 和 simple-git-hooks，保证代码的规范性。
- **TypeScript**： 支持严格的类型检查，提高代码的可维护性。
- **丰富的主题配置**：内置多样的主题配置，与 UnoCSS 完美结合。
- **内置国际化方案**：轻松实现多语言支持。
- **自动化文件路由系统**：自动生成路由导入、声明和类型。更多细节请查看 [Elegant Router](https://github.com/soybeanjs/elegant-router)。
- **灵活的权限路由**：同时支持前端静态路由和后端动态路由。
- **丰富的页面组件**：内置多样页面和组件，包括403、404、500页面，以及布局组件、标签组件、主题配置组件等。
- **命令行工具**：内置高效的命令行工具，git提交、删除文件、发布等。
- **移动端适配**：完美支持移动端，实现自适应布局。


## 文档

- [地址](https://docs.soybeanjs.cn)


## 示例图片

<img width="1919" height="878" alt="soybean1" src="https://github.com/user-attachments/assets/510b87e4-1540-4046-90c8-4213b68e0094" />
<img width="1919" height="879" alt="soybean2" src="https://github.com/user-attachments/assets/e0b19376-2901-4c3c-8884-2a67f3e1b8ad" />
<img width="1919" height="878" alt="soybean3" src="https://github.com/user-attachments/assets/98b417ea-b006-4032-8b46-d4d52ef57108" />
<img width="1919" height="880" alt="soybean4" src="https://github.com/user-attachments/assets/668c76e9-e2cf-4e3c-a867-ddd9c5cc6039" />
<img width="1919" height="877" alt="soybean5" src="https://github.com/user-attachments/assets/1d31a3ab-aea4-47ff-86cd-f36d09b9db74" />
<img width="1919" height="880" alt="soybean6" src="https://github.com/user-attachments/assets/39155191-58eb-4d6c-84fc-3dbfe475dfa0" />
<img width="1919" height="880" alt="soybean7" src="https://github.com/user-attachments/assets/ec4801bc-ed35-4e07-b568-1efa08470576" />


## 使用

**环境准备**

确保你的环境满足以下要求：

- **git**: 你需要git来克隆和管理项目版本。
- **NodeJS**: >=20.19.0，推荐 20.19.0 或更高。
- **pnpm**: >= 10.5.0，推荐 10.5.0 或更高。

**克隆项目**

```bash
# github
git clone https://github.com/dujianmin-djm/soybean.git
```

**安装依赖**

```bash
pnpm i
```
> 由于本项目采用了 pnpm monorepo 的管理方式，因此请不要使用 npm 或 yarn 来安装依赖。

**启动项目**

```bash
pnpm dev
```

**构建项目**

```bash
pnpm build
```

**代码同步**

参考 [代码同步](https://docs.soybeanjs.cn/zh/guide/sync) 文档。

## 如何贡献

热烈欢迎并感谢所有形式的贡献。如果您有任何想法或建议，欢迎通过提交 pull requests 或创建 GitHub issue 来分享。

## Git 提交规范

本项目已内置 `commit` 命令，您可以通过执行 `pnpm commit` 来生成符合 [Conventional Commits]([conventionalcommits](https://www.conventionalcommits.org/)) 规范的提交信息。在提交PR时，请务必使用 `commit` 命令来创建提交信息，以确保信息的规范性。


## 浏览器支持

推荐使用最新版的 Chrome 浏览器进行开发，以获得更好的体验。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 开源协议

项目基于 MIT 协议，仅供学习参考，商业使用请保留作者版权信息，作者不保证也不承担任何软件的使用风险。
