<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>SoybeanAdmin</h1>
  <span><a href="./README.md">中文</a> | English</span>
</div>

## Introduction

The project is a complete enterprise-level backend management solution, featuring a front-end and back-end decoupled SPA application. The front-end utilizes the Vue 3 + TypeScript + Vite technology stack and is built upon [soybean-admin](https://github.com/soybeanjs/soybean-admin) for secondary development. The back-end employs the .NET technology stack, implements domain-driven design based on [ABP Framework](https://github.com/abpframework/abp), and provides RESTful API interfaces.
This repository serves as the front-end of the system. It has implemented page functionalities such as user management, role management, employees, positions, and departments, which are used in conjunction with the back-end. [Back-end repository link](https://github.com/dujianmin-djm/xd.pms).


## Features

- **Cutting-edge technology application**: using the latest popular technology stack such as Vue3, Vite7, TypeScript, Pinia and UnoCSS.
- **Clear project architecture**: using pnpm monorepo architecture, clear structure, elegant and easy to understand.
- **Strict code specifications**: follow the [SoybeanJS specification](https://docs.soybeanjs.cn/standard), integrate eslint, prettier and simple-git-hooks to ensure the code is standardized.
- **TypeScript**: support strict type checking to improve code maintainability.
- **Rich theme configuration**: built-in a variety of theme configurations, perfectly integrated with UnoCSS.
- **Built-in internationalization solution**: easily realize multi-language support.
- **Automated file routing system**: automatically generate route import, declaration and type. For more details, please refer to [Elegant Router](https://github.com/soybeanjs/elegant-router).
- **Flexible permission routing**: support both front-end static routing and back-end dynamic routing.
- **Rich page components**: built-in a variety of pages and components, including 403, 404, 500 pages, as well as layout components, tag components, theme configuration components, etc.
- **Command line tool**: built-in efficient command line tool, git commit, delete file, release, etc.
- **Mobile adaptation**: perfectly support mobile terminal to realize adaptive layout.

## Documentation

- [Link](https://docs.soybeanjs.cn)

## Example Images

<img width="1919" height="878" alt="soybean1" src="https://github.com/user-attachments/assets/510b87e4-1540-4046-90c8-4213b68e0094" />
<img width="1919" height="879" alt="soybean2" src="https://github.com/user-attachments/assets/e0b19376-2901-4c3c-8884-2a67f3e1b8ad" />
<img width="1919" height="878" alt="soybean3" src="https://github.com/user-attachments/assets/98b417ea-b006-4032-8b46-d4d52ef57108" />
<img width="1919" height="880" alt="soybean4" src="https://github.com/user-attachments/assets/668c76e9-e2cf-4e3c-a867-ddd9c5cc6039" />
<img width="1919" height="877" alt="soybean5" src="https://github.com/user-attachments/assets/1d31a3ab-aea4-47ff-86cd-f36d09b9db74" />
<img width="1919" height="880" alt="soybean6" src="https://github.com/user-attachments/assets/39155191-58eb-4d6c-84fc-3dbfe475dfa0" />
<img width="1919" height="880" alt="soybean7" src="https://github.com/user-attachments/assets/ec4801bc-ed35-4e07-b568-1efa08470576" />


## Usage

**Environment Preparation**

Make sure your environment meets the following requirements:

- **git**: you need git to clone and manage project versions.
- **NodeJS**: >=20.19.0, recommended 20.19.0 or higher.
- **pnpm**: >= 10.5.0, recommended 10.5.0 or higher.

**Clone Project**

```bash
# github
git clone https://github.com/dujianmin-djm/soybean.git
```

**Install Dependencies**

```bash
pnpm i
```
> Since this project uses the pnpm monorepo management method, please do not use npm or yarn to install dependencies.

**Start Project**

```bash
pnpm dev
```

**Build Project**

```bash
pnpm build
```

**Code Synchronization**

Refer to the [Code Synchronization](https://docs.soybeanjs.cn/guide/sync) document.

## How to Contribute

We warmly welcome and appreciate all forms of contributions. If you have any ideas or suggestions, please feel free to share them by submitting [pull requests](https://github.com/soybeanjs/soybean-admin/pulls) or creating GitHub [issue](https://github.com/soybeanjs/soybean-admin/issues/new).

## Git Commit Guidelines

This project has built-in `commit` command, you can execute `pnpm commit` to generate commit information that conforms to [Conventional Commits](https://www.conventionalcommits.org/) specification. When submitting PR, please be sure to use `commit` command to create commit information to ensure the standardization of information.

## Browser Support

It is recommended to use the latest version of Chrome in development for a better experience.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## License

This project is based on the MIT protocol, for learning purposes only, please retain the author's copyright information for commercial use, the author does not guarantee and is not responsible for the software.
