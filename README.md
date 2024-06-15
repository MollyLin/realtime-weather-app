## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- React v18.2 + Vite v5.2

## 開發筆記

此網站天氣資訊來源為中央氣象局，總共呼叫了 3 支 API，分別為:
- 觀測中的 `/O-A0001-001`，取得中和區的氣溫與風速
- 預報中的 `/F-C0032-001`，取得新北市的天氣描述、降雨機率及體感舒適度
- 日出日落 `/A-B0062-001`，根據新北市當日的日出日落時間與當前時間比對是否為白天或夜晚，以改變亮／暗主題配色

### SVG Component

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

### 將 API 請求與元件脫鉤的好處
- 能更精準範圍測試
- 提昇程式碼重用性
- 關注點分離 (Separation of Concerns)，使元件只關注如何顯示資料
- 更單純的元件邏輯
上方列的結論: 讓函式與元件的資料狀態解耦，以利未來程式的拆檔與管理

### 簡短定義 `useEffect`、`useCallback`、`useMemo`、`memo`
- `useEffect`: 當依賴的資料沒有更新時跳過處理。
- `useCallback`: 讓資料流的變化連動反應到函式的變化。
  - 使用時機:
    - 當一個 component 裡的函式有被 effect 函式呼叫時。 ex: 本專案的 `fetchData()`
    - 會透過 prop 來傳給一個 memo 過的子 component 時。
- `useMemo`: 用來快取陣列或物件類型的資料
- `memo`: 快取 component render 的畫面結果並重用以節省效能成本，是 React 內建的 HOC。

### 何謂 HOC(higher order component)?
會接受一個 component 作為參數，然後回傳一個加工過的全新 component。目的是使我們更輕易擴充和重用 component 邏輯。


### when use `useMemo` and `useCallback` ?
> There are specific reasons both of these hooks are built-into React:
> - Referential equality
>   - 是否參照到同一個記憶體位置
> - Computationally expensive calculations
>   - 原因: 比較 useCallback 中的 dependencies 陣列元素是否相同可能會消耗更多效能
> - 為了比較 useCallback 中的 dependencies 陣列元素是否相同還可能會消耗更多效能，因此多數的時候並不需要使用到 useCallback 這個方法。

``` javascript
// useCallback(fn, dependencies)
const memoizedFunction = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useMemo(calculateValue, dependencies)
// This type of caching is called memoization.
const memoizedValue = useMemo(() => {
  const result = computeExpensiveValue(a, b);
  return result;
}, [a, b]);
```

Ref:
- [Kent C.dodds's Blog](https://kentcdodds.com/blog/usememo-and-usecallback#so-when-should-i-usememo-and-usecallback)
- [是否有必要使用 useCallback？](https://pjchender.dev/react-bootcamp/docs/book/ch5/5-8#%E6%98%AF%E5%90%A6%E6%9C%89%E5%BF%85%E8%A6%81%E4%BD%BF%E7%94%A8-usecallback%EF%BC%9F)
- 《 React 思維進化 》/ 周昱安 Zet

### `.find()` > `new Map()`
研讀此篇文章 [Stop Using find() Method in JavaScript](https://medium.com/codex/stop-using-find-method-in-javascript-dfdb40b10821) 討論到 JS Array 效能問題，因此將原先 `.find()` 改寫為使用接近 O(1) 的 Map() 處理日出日落資料。(src/hooks/useWeatherAPI.jsx, fetchSunriseAndSunset())

### 天氣相關資料
- [中央氣象署開放資料平臺之資料擷取API](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)
- 中央氣象局提供的 [預報產品天氣描述代碼表](https://opendata.cwa.gov.tw/opendatadoc/MFC/D0047.pdf) from page 4。
- SVG icon from [IconFinder](https://www.iconfinder.com/iconsets/the-weather-is-nice-today) and [SvgRepo](https://www.svgrepo.com/)

### News
> All GitHub Pages builds will use GitHub Actions from June 30, 2024. No other changes are required but GitHub Actions must be enabled in your repository for builds to continue. For more information on enabling GitHub Actions, see ["Managing GitHub Actions settings for a repository."](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository)

Ref: [Configure publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)