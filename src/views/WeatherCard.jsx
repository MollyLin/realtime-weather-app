import styled from '@emotion/styled';
import dayjs from 'dayjs';

import WeatherIcon from './../components/WeatherIcon';
import { ReactComponent as AirFlowIcon } from './../assets/windy.svg';
import { ReactComponent as RainIcon } from './../assets/rain.svg';
import { ReactComponent as RefreshIcon } from './../assets/refresh.svg';
import { ReactComponent as LoadingIcon } from './../assets/loading.svg';
import { formatDate } from './../helpers/formatDate';

const WeatherCardWrapper = styled.div`
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

const WeatherCard = ({ currentWeather, moment, fetchData }) => {
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
    <WeatherCardWrapper>
      <Location>{locationName}</Location>
      <Description>
        {description} {comfortably}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)} <Celsius>°C</Celsius>
        </Temperature>
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
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
          {formatDate(dayjs(observationTime), {
            hour: 'numeric',
            minute: 'numeric',
          })}
        </span>
        {isLoading ? <LoadingIcon/> : <RefreshIcon />}
      </Refresh>
      <Refresh />
    </WeatherCardWrapper>
  );
};

export default WeatherCard;