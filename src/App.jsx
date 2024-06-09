import { useState, useEffect } from 'react';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';

import { ReactComponent as DayCloudyIcon } from './assets/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './assets/airFlow.svg';
import { ReactComponent as RainIcon } from './assets/rain.svg';
import { ReactComponent as RefreshIcon } from './assets/refresh.svg';
import { ReactComponent as LoadingIcon } from './assets/loading.svg';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
    refreshIconColor: '#fcd12a',
  },
  dark: {
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

const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
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
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
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

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentWeather, setCurrentWeather] = useState({
    observationTime: '2024-1-1',
    locationName: '',
    windSpeed: 0,
    temperature: 0,
    isLoading: true,
  });
  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  const fetchCurrentWeather = () => {
    setCurrentWeather((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/${import.meta.env.VITE_CURRENT_WEATHER}?Authorization=${import.meta.env.VITE_AUTHORIZATION_KEY}&StationId=${import.meta.env.VITE_ZHONGHE_STATION_ID}&WeatherElement=&GeoInfo=`)
      .then( (res) => res.json())
      .then( (data) => {
        const locationData = data.records.Station[0];
        console.log(locationData.ObsTime);
        setCurrentWeather({
          observationTime: locationData.ObsTime.DateTime,
          locationName: locationData.GeoInfo.TownName,
          temperature: locationData.WeatherElement.AirTemperature,
          windSpeed: locationData.WeatherElement.WindSpeed,
          isLoading: false,
        });
      });
  }
  const {
    observationTime,
    locationName,
    windSpeed,
    temperature,
    isLoading,
  } = currentWeather;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
          <Location>{locationName}</Location>
          {/* <Description>{description}</Description> */}
          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)} <Celsius>°C</Celsius>
            </Temperature>
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>
          <Rain>
            {/* <RainIcon /> {rainPossibility}% */}
          </Rain>
          <Refresh onClick={fetchCurrentWeather} isLoading={isLoading}>
            <span>
              最後觀測時間：
              {new Intl.DateTimeFormat('zh-TW', {
                hour: 'numeric',
                minute: 'numeric',
              }).format(dayjs(observationTime))}{''}</span>
              {isLoading ? <LoadingIcon/> : <RefreshIcon />}
          </Refresh>
          <Refresh />
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
};

export default App;
