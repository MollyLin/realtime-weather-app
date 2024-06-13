import { ThemeProvider } from '@emotion/react';
import WeatherCard from './views/WeatherCard';
import styled from '@emotion/styled';
import useWeatherAPI from './hooks/useWeatherAPI';

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

const App = () => {
  const [currentTheme, currentWeather, fetchData] = useWeatherAPI();

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard
          currentWeather={currentWeather}
          moment={currentTheme}
          fetchData={fetchData} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
