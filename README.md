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
上方列的結論: 讓函式與元件的資料狀態解耦，以利未來程式的拆檔與管理

#### when use `useMemo` and `useCallback` ?
> There are specific reasons both of these hooks are built-into React:
> - Referential equality
>   - 是否參照到同一個記憶體位置
> - Computationally expensive calculations
>   - 原因: 比較 useCallback 中的 dependencies 陣列元素是否相同可能會消耗更多效能
> - 為了比較 useCallback 中的 dependencies 陣列元素是否相同還可能會消耗更多效能，因此多數的時候並不需要使用到 useCallback 這個方法。

Ref:
- [Kent C.dodds's Blog](https://kentcdodds.com/blog/usememo-and-usecallback#so-when-should-i-usememo-and-usecallback)
- [是否有必要使用 useCallback？](https://pjchender.dev/react-bootcamp/docs/book/ch5/5-8#%E6%98%AF%E5%90%A6%E6%9C%89%E5%BF%85%E8%A6%81%E4%BD%BF%E7%94%A8-usecallback%EF%BC%9F)
