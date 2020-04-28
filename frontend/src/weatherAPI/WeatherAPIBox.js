import React, { Component } from "react";
import "./Weather.css";
import "../motivationSection/motivation.css";

const api = {
  key: "cf1d51594b5204f5f694ed39ca15f710",
  base: "http://api.openweathermap.org/data/2.5/",
};

class WeatherApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoCoords: {
        long: "",
        lat: "",
      },
      query: "",
      temp: "",
      weatherDescription: "",
      quote: this.quoteBuilder(),
    };
  }

  getPosition = (location) => {
    let geoLocation = {
      long: location.coords.longitude.toString(),
      lat: location.coords.latitude.toString(),
    };
    this.setState({ geoCoords: geoLocation });
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPosition);
    }
  };

  getQuery = () => {
    if (this.state.geoCoords.long === "") {
      return "https://api.openweathermap.org/data/2.5/weather?q=Sydney&units=metric&appid=cf1d51594b5204f5f694ed39ca15f710";
    } else {
      let searchQuery = `${api.base}weather?lat=${this.state.geoCoords.lat}&lon=${this.state.geoCoords.long}&units=metric&appid=${api.key}`;
      return searchQuery;
    }
  };

  getWeather = (APIQuery) => {
    fetch(APIQuery)
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          weather: result,
          temp: result.main.temp,
          weatherDescription: result.weather[0].main,
          weatherDone: true,
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  getRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  quoteBuilder = () => {
    let quotes = [
      "Don't stop when you're tired, stop when you're done ~ Johnny Sins",
      "Work hard until you no longer have to introduce yourself ~ Johnny Sins",
      "A man stands out for his ability to not give up and fight until the end",
      "You may love a girl deeply but you can't express it more deeper than 7-8 inches ~ Johnny Sins",
      "I failed some subjects in highschool, but my friend passed all. Now he is the cameraman and I am the star ~ Johnny Sins",
    ];

    let randNum = this.getRandomNumber(5);

    return quotes[randNum];
  };

  render() {
    this.getLocation();
    this.getWeather(this.getQuery());

    return (
      <div className="weatherApplication">
        <div className="bigBoy">
          <div>
            <div className="location-box">
              <div className="date">{this.dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(this.state.temp)}˚C, {this.state.weatherDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WeatherApplication;
