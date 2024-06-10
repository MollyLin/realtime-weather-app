# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 開發筆記

#### SVG Component

- Create React App 在引入圖片檔時，預設即支援將 `.svg` 作為 React 組件導入，其寫法為:
``` javascript
import { ReactComponent as AirFlowIcon } from './assets/airFlow.svg';
```
- Vite React App:
step1:
``` bash
npm install @svgr/rollup --save-dev
```
step2:
``` js
// from vite.config.js
import svgr from '@svgr/rollup';

export default {
  plugins: [svgr()],
  // other config...
}
```
step3:
``` js
import { ReactComponent as AirFlowIcon } from './assets/airFlow.svg';
```

#### 將 API 請求與元件脫鉤的好處
- 能更精準範圍測試
- 提昇程式碼重用性
- 關注點分離 (Separation of Concerns)，使元件只關注如何顯示資料
- 更單純的元件邏輯
