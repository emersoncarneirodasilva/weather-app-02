import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm, IoMdSearch } from 'react-icons/io';
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from 'react-icons/bs';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';

const APIkey = "f261a9ad0e9e68db6c350893bd42d477";

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("Natal");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    // If input value is not empty
    if (inputValue !== "") {
      // Set location
      setLocation(inputValue);
    };

    // Select input
    const input = document.querySelector("input");
    
    // If input value is empty
    if (input.value === "") {
      // Set animate to true
      setAnimate(true);
      // After 500ms set animate to false
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    };
    
    // Clear input
    input.value = "";
    
    // Prevent defaults
    e.preventDefault();
  };
  
  // Fetch the data
  useEffect(() => {
    // Set loading to true
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios.get(url).then((res) => {
      // Set the data after 1500 ms
      setTimeout(() => {
        setData(res.data);
        // Set loading to false
        setLoading(false);
      }, 1500);      
    }).catch((err) => {
      setLoading(false);
      setErrorMsg(err);
    });
  }, [location]);

  // Error message
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("")
    }, 2000)
    // Clear timer
    return () => clearTimeout(timer);
  }, [errorMsg]);  

  // If data is false show the loader
  if(!data) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-white bg-center bg-no-repeat bg-cover bg-gradientBg">
        <div>
          <ImSpinner8 className="text-5xl animate-spin" />
        </div>
      </div>
    );
  };

  // Set the icon according to the weather
  let icon;

  switch(data.weather[0].main) {
    case "Cloud": 
      icon = <IoMdCloudy />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill />;
      break;
    case "Rain":
      icon = <IoMdRainy className="text-[#63c6e7]" />;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-[#ffde33]" />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className="text-[#7dc0d6]" />;
      break;
    case "Snow":
      icon = <IoMdSnow />;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm className="text-[#a1a7a8]" />;
      break;
  };

  // Date object
  const date = new Date();
  
  return (    
    <div className="flex flex-col items-center justify-center w-full h-screen px-4 bg-center bg-no-repeat bg-cover py-13 bg-gradientBg lg:px-0">
      {errorMsg && (
        <div className="w-[80%] max-w-[90vw] lg:max-w-[450px] bg-[#1ab8ed] text-white relative mb-2 top-1 lg:top-0 p-4 capitalize rounded-md">{`${errorMsg.response.data.message}`}</div>
      )}
      
      {/* Form */}
      <form className={`${animate ? "animate-shake" : "animate-none"} w-full h-16 bg-black/30 max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`} >
        <div className="relative flex items-center justify-between h-full p-2">
          <input className="flex-1 text-white bg-transparent outline-none placeholder:text-white text-[15px] font-light pl-6 h-full" onChange={(e) => handleInput(e)} type="text" placeholder="Search by city or country" />
          <button className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition" onClick={(e) => handleSubmit(e)}><IoMdSearch className="text-2xl text-white" /></button>
        </div>
      </form>
      
      {/* Card */}
      <div className="w-full max-w-[450px] bg-black/20 min-h-[484px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
       
        { loading ? (
          <div className="flex items-center justify-center w-full h-full"><ImSpinner8 className="text-5xl text-white animate-spin" /></div>
        ) : (          
          <div>
            
            {/* Card Top */}          
            <div className="flex items-center gap-x-5">  
              {/* Icon */}
              <div className="text-[87px]">{icon}</div>
              <div>
                {/* Conuntry Name */}
                <div className="text-2xl font-semibold">
                  {data.name}, {data.sys.country}
                </div>             
                {/* date */}
                <div>
                  {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getFullYear()}
                </div>
              </div>             
            </div>
            
            {/* Card Body */}
            <div className="my-20">
              <div className="flex items-center justify-center">
                {/* Temperature */}
                <div className="text-[144px] leading-none font-light">{parseInt(data.main.temp)}</div>
                {/* Celsius Icon */}
                <div className="text-4xl">
                  <TbTemperatureCelsius />
                </div>
              </div>            
              {/* Waeather Description */}
              <div className="text-center capitalize">
                {data.weather[0].description}
              </div>
            </div>

            {/* Card Bottom */}
            <div className="max-w-[378px] m-auto flex flex-col gap-y-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsEye />
                  </div>
                  <div>
                    Visibility {' '} <span className="ml-2">{data.visibility / 1000} km</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsThermometer className="text-red-500" />
                  </div>
                  <div className="flex">
                    Feels like
                    <div className="flex ml-2">
                      {parseInt(data.main.feels_like)}
                      <TbTemperatureCelsius />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsWater className="text-[#63c6e7]" />
                  </div>
                  <div>
                    Humidity <span className="ml-2">{data.main.humidity} %</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  {/* Icon */}
                  <div className="text-[20px]">
                    <BsWind className="text-[#cfc8c8]" />
                  </div>
                  <div>
                    Wind <span className="ml-2">{data.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        )}             
      </div>
    </div>
  );
};

export default App;
