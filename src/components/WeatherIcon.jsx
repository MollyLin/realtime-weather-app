import { ReactComponent as DayClear } from './../assets/day-clear.svg';
import { ReactComponent as DayCloudy } from './../assets/day-cloudy.svg';
import { ReactComponent as DayCloudyFog } from './../assets/day-cloudy-fog.svg';
import { ReactComponent as DayFog } from './../assets/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../assets/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../assets/day-snowing.svg';
import { ReactComponent as DayThunderstorm } from './../assets/day-thunderstorm.svg';
import { ReactComponent as NightClear } from './../assets/night-clear.svg';
import { ReactComponent as NightCloudy } from './../assets/night-cloudy.svg';
import { ReactComponent as NightCloudyFog } from './../assets/night-cloudy-fog.svg';
import { ReactComponent as NightFog } from './../assets/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../assets/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../assets/night-snowing.svg';
import { ReactComponent as NightThunderstorm } from './../assets/night-thunderstorm.svg';
import styled from '@emotion/styled';

const IconContainer = styled.div`
  flex-basis: 30%;

  svg {
    max-height: 110px;
  }
`;

const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    19,
    20,
    29,
    30,
    31,
    32,
    38,
    39,
  ],
  isSnowing: [23, 37, 42],
};

const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

const weatherCodeToType = (weatherCode) => {
  const [weatherType] =
    Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
      weatherCodes.includes(Number(weatherCode))
    ) || [];

    return weatherType;
};

const WeatherIcon = () => {
  return (
    <IconContainer>
      <DayCloudy />
    </IconContainer>
  );
};

export default WeatherIcon;

