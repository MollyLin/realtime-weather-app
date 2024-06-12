import { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import { ReactComponent as AirFlowIcon } from './assets/windy.svg';
import { ReactComponent as RainIcon } from './assets/rain.svg';
import { ReactComponent as RefreshIcon } from './assets/refresh.svg';
import { ReactComponent as LoadingIcon } from './assets/loading.svg';
import WeatherIcon from './components/WeatherIcon';

const theme = {
  day: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
    refreshIconColor: '#fcd12a',
  },
  night: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
    refreshIconColor: '#fcd12a',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};

  svg{
    margin-left: 5px;
    width: 20px;
    height: auto;
    cursor: pointer;
    fill: ${({ theme }) => theme.refreshIconColor};
    animation: rotate infinite 1.5s linear;
    animation-duration: ${({ isLoading }) => (isLoading ? '1.5s' : '0s')};
  }
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const fetchCurrentWeather = () => {
  return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/${import.meta.env.VITE_CURRENT_WEATHER}?Authorization=${import.meta.env.VITE_AUTHORIZATION_KEY}&StationId=${import.meta.env.VITE_ZHONGHE_STATION_ID}&WeatherElement=&GeoInfo=`)
    .then( (res) => res.json())
    .then( (data) => {
      const locationData = data.records.Station[0];

      return {
        observationTime: locationData.ObsTime.DateTime,
        locationName: locationData.GeoInfo.TownName,
        temperature: locationData.WeatherElement.AirTemperature,
        windSpeed: locationData.WeatherElement.WindSpeed,
        isLoading: false,
      };
    });
}

const fetchWeatherForecast = () => {
  return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/${import.meta.env.VITE_WEATHER_FORECAST}?Authorization=${import.meta.env.VITE_AUTHORIZATION_KEY}&locationName=${encodeURIComponent(import.meta.env.VITE_LOCATION_NAME)}&elementName=Wx,PoP,CI`)
    .then( (res) => res.json())
    .then( (data) => {
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortably: weatherElements.CI.parameterName,
      };
    });
};

const fetchSunriseAndSunset = () => {
  return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/${import.meta.env.VITE_SUNRISE_SUNSET}?Authorization=${import.meta.env.VITE_AUTHORIZATION_KEY}&locationName=${encodeURIComponent(import.meta.env.VITE_LOCATION_NAME)}`)
    .then( (res) => res.json())
    .then( (data) => {

      const now = new Date();
      const formatDate = Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now).replace(/\//g, '-');

      if(!data) {
        throw new Error(`找不到${import.meta.env.VITE_LOCATION_NAME}在${formatDate}的日出日落資料`);
      }

      const locationTime = data?.records?.locations?.location[0];
      const locationDate = locationTime.time.find((time) => time.Date === formatDate);

      // 將 Date 物件轉為  Unix time stamp 以取得目前太陽狀態
      const nowDateTimestamp = now.getTime();
      const sunriseTimestamp = new Date(`${locationDate.Date} ${locationDate.SunRiseTime}`).getTime();
      const sunsetTimestamp = new Date(`${locationDate.Date} ${locationDate.SunSetTime}`).getTime();

      const isDayTime = sunriseTimestamp <= nowDateTimestamp && nowDateTimestamp <= sunsetTimestamp;
      return isDayTime ? 'day' : 'night';
    })
};

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('day');
  const [currentWeather, setCurrentWeather] = useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    comfortably: '',
    weatherCode: 0,
    rainPossibility: 0,
    windSpeed: 0,
    temperature: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchMoment = async () => {
      const momentResult = await fetchSunriseAndSunset();
      setCurrentTheme(momentResult);
    };
    fetchMoment();
  }, []);

  // 當函式需要共用時，可以拉到 useEffect 外
  // 以此天氣 APP 的規模來看，useCallback 可斟酌使用
  const fetchData = useCallback(async () => {
    setCurrentWeather((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather(),
      fetchWeatherForecast(),
    ]);

    setCurrentWeather({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });

  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    observationTime,
    locationName,
    description,
    comfortably,
    weatherCode,
    rainPossibility,
    windSpeed,
    temperature,
    isLoading,
  } = currentWeather;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          <Description>
            {description} {comfortably}
          </Description>
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <WeatherIcon weatherCode={weatherCode} moment={currentTheme} />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain>
            <RainIcon /> {rainPossibility}%
          </Rain>
          <Refresh
            onClick={fetchData}
            isLoading={isLoading}>
            <span>
              最後觀測時間：
              {new Intl.DateTimeFormat('zh-TW', {
                hour: 'numeric',
                minute: 'numeric',
              }).format(dayjs(observationTime))}{''}
            </span>
            {isLoading ? <LoadingIcon/> : <RefreshIcon />}
          </Refresh>
          <Refresh />
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
};

export default App;
