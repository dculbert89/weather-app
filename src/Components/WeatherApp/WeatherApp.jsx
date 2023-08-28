import React, { useState, useEffect } from "react";
import "./WeatherApp.css";

import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import humidity_icon from "../Assets/humidity.png";
import wind_icon from "../Assets/wind.png";

export const WeatherApp = () => {
    const [wicon, setWicon] = useState(cloud_icon);
    const [weatherData, setWeatherData] = useState({
      humidity: "--",
      windSpeed: "--",
      temperature: "--",
      location: "Location?",
    });
  
    const api_key = "170d0bcc82fe12817e59381bd5cb3e87";
  
    const getWeatherData = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const weather = {
          humidity: data.main.humidity + " %",
          windSpeed: Math.floor(data.wind.speed) + " mph",
          temperature: Math.floor(data.main.temp) + "°F",
          location: data.name,
        };
  
        setWeatherData(weather);
        updateWeatherIcon(data.weather[0].icon);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

  const updateWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
      case "01n":
        setWicon(clear_icon);
        break;
      case "02d":
      case "02n":
        setWicon(cloud_icon);
        break;
      case "03d":
      case "03n":
        setWicon(drizzle_icon);
        break;
      case "04d":
      case "04n":
        setWicon(drizzle_icon);
        break;
      case "09d":
      case "09n":
        setWicon(rain_icon);
        break;
      case "10d":
      case "10n":
        setWicon(rain_icon);
        break;
      case "13d":
      case "13n":
        setWicon(snow_icon);
        break;
      default:
        setWicon(clear_icon);
        break;
    }
  };

  const search = () => {
    const element = document.getElementsByClassName("cityInput")[0];
    if (element.value === "") {
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${element.value}&units=imperial&appid=${api_key}`;
    getWeatherData(url);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const askForGeolocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${api_key}`;
          getWeatherData(url);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  };

  useEffect(() => {
    // Ask for geolocation permission when the component mounts
    askForGeolocationPermission();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="Search"
          onKeyDown={handleEnter}
        />
        <div className="search-icon" onClick={search}>
          <img src={search_icon} alt="search icon" />
        </div>
      </div>
      <div className="weather-image">
        <img src={wicon} alt="cloud icon" />
      </div>
      <div className="weather-temp">{weatherData.temperature}</div>
      <div className="weather-location">{weatherData.location}</div>
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="" className="icon" />
          <div className="data">
            <div className="humidity-percent">{weatherData.humidity}</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="" className="icon" />
          <div className="data">
            <div className="wind-rate">{weatherData.windSpeed}</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
