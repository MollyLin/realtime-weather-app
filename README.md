# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Note
在引入圖片檔時，Create React App 環境支援將 `.svg` 作為 React 組件導入，其寫法為:
``` javascript
import { ReactComponent as AirFlowIcon } from './assets/airFlow.svg';
```
Vite React App:

step1:
``` bash
npm install @svgr/rollup --save-dev
```

step2:
``` js
// vite.config.js
import svgr from '@svgr/rollup';

export default {
  plugins: [svgr()],
  // other config
}
```

step3:
``` js
import { ReactComponent as AirFlowIcon } from './assets/airFlow.svg';
```
