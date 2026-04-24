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
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
    const [city, setCity] = useState("");
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [forecastData, setForecastData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    //search func
    const handleSearch = async (city: string) => {
        setLoading(true);
        try {
            const forecastRes = await WeatherService.getForeCast(city, 10);
            setCurrentWeather(forecastRes);
            setForecastData(forecastRes.forecast.forecastday);

            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);

            const from = lastWeek.toISOString().split('T')[0];
            const to = today.toISOString().split('T')[0];

            const historyData = await WeatherService.getHistoryRange(city, from, to);
            setHistoryData(historyData.forecast.forecastday.reverse());
        } catch (error) {
            console.error("Error fetching weather data:", error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        handleSearch("Kathmandu");
    }, []);


    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 p-4">
           <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6">


                <div className="p-6 ">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            className="w-full p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch(city)}
                        />
                        <button
                            onClick={() => handleSearch(city)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </div>
                </div>

                {currentWeather && (
                    <div className="p-6">

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {currentWeather.location.name}, {currentWeather.location.country}
                            </h1>
                            <div className="flex items-center justify-center my-4">
                                <img
                                    src={`https:${currentWeather.current.condition.icon}`}
                                    className="w-24 h-24"
                                    alt="condition"
                                />
                                <span className="text-6xl font-black text-blue-600">
                                    {currentWeather.current.temp_c}°
                                </span>
                            </div>
                            <p className="text-gray-500 text-lg capitalize">
                                {currentWeather.current.condition.text}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl mb-8 text-center text-sm font-medium">
                            <div>
                                <p className="text-gray-400">HUMIDITY</p>
                                <p className="text-blue-800">{currentWeather.current.humidity}%</p>
                            </div>
                            <div>
                                <p className="text-gray-400">WIND</p>
                                <p className="text-blue-800">{currentWeather.current.wind_kph} km/h</p>
                            </div>
                        </div>

                        <div className="m-2">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2">
                                Last 7 Days Trends
                            </h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide py-2">
                                {historyData.map((day) => (
                                    <div
                                        key={day.date}
                                        className="shrink-0 w-32 p-4 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-100 hover:shadow-md transition"
                                    >

                                        <span className="font-bold text-gray-700 text-xs text-center mb-3">
                                            {new Date(day.date).toLocaleDateString("en-US", { weekday: 'short', month: 'long', day: 'numeric' })}
                                        </span>
                                        <span className="text-[9px] text-center text-nowrap text-gray-400">{day.day.condition.text}</span>

                                        <div className="flex items-center gap-4">
                                            <img src={`https:${day.day.condition.icon}`} className="w-10 h-10" alt="icon" />
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">{day.day.avgtemp_c}°</p>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div className="m-4 p-4">
                    <h3 className="text-lg font-bold text-blue-600 mb-4 pb-2">
                        Forecast
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide py-2">
                        {forecastData.map((day) => (
                            <div
                                key={day.date}
                                className="shrink-0 w-32 p-4 bg-blue-50 rounded-xl flex flex-col items-center justify-center border border-blue-100 hover:shadow-md transition"
                            >

                                <span className="font-bold text-gray-700 text-xs text-center mb-3">
                                    {new Date(day.date).toLocaleDateString("en-US", { weekday: 'short', month: 'long', day: 'numeric' })}
                                </span>
                                <span className="text-[9px] text-center text-nowrap text-gray-400">{day.day.condition.text}</span>

                                <div className="flex items-center gap-4">
                                    <img src={`https:${day.day.condition.icon}`} className="w-10 h-10" alt="icon" />
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">{day.day.avgtemp_c}°</p>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {loading && !currentWeather && (
                    <div className="p-20 text-center text-gray-400">Fetching weather data...</div>
                )}
            </div>
        </div>
    );
}