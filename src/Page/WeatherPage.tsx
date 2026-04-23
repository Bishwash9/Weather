import { useEffect, useState } from "react";
import { WeatherService } from "../Services/weatherService";

interface WeatherData {
    location: {
        name: string;
        country: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
            icon: string;
        };
        humidity: number;
        wind_kph: number;
    }

}

export const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState("");
    const [searchCity, setSearchCity] = useState("Kathmandu");

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await WeatherService.getCurrentWeather(searchCity);

                setWeatherData(data);
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
            }
        }
        fetchWeather();
    }, [])


    return (
        <div className="bg-blue-400 h-screen w-full rounded-lg flex items-center justify-center">
            <div className="p-4 w-150 h-150 flex justify-center bg-white rounded-lg shadow-md">
           {weatherData ? (

                    <div className="text-center mt-4">

                        <h2 className="text-xl font-semibold text-gray-700">
                            {weatherData.location.name}, {weatherData.location.country}
                        </h2>


                        <img
                            src={`https:${weatherData.current.condition.icon}`}
                            alt="weather icon"
                            className="mx-auto w-24 h-24"
                        />


                        <p className="text-5xl font-bold text-blue-600">
                            {weatherData.current.temp_c}°C
                        </p>


                        <p className="text-gray-500 capitalize mt-2">
                            {weatherData.current.condition.text}
                        </p>


                        <div className="flex justify-around mt-6 border-t pt-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Humidity</p>
                                <p className="font-bold">{weatherData.current.humidity}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Wind</p>
                                <p className="font-bold">{weatherData.current.wind_kph} km/h</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center mt-10">Loading weather...</p>
                )}
            
            </div>
        </div>
    )
}