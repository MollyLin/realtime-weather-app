import { useState, useEffect, useCallback } from 'react';

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

const useWeatherAPI = () => {
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

  return [currentTheme, currentWeather, fetchData];
};

export default useWeatherAPI;