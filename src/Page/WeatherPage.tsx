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
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-sky-100">
            
            {/* --- LIQUID BLOBS (The Background) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-[20%] right-[-5%] w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

            {/* --- MAIN GLASS CARD --- */}
            <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-3xl rounded-[40px] border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden">
                
                {/* Glass Search Bar */}
                <div className="p-8 pb-0">
                    <div className="flex gap-3 bg-white/10 p-2 rounded-2xl border border-white/20">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            className="bg-transparent flex-1 p-2 text-gray-800 placeholder-gray-400 outline-none"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch(city)}
                        />
                        <button
                            onClick={() => handleSearch(city)}
                            className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-xl text-blue-600 font-bold hover:bg-white/60 transition shadow-sm"
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </div>
                </div>

                {currentWeather ? (
                    <div className="p-8">
                        {/* Current Weather Info */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                {currentWeather.location.name}
                            </h2>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{currentWeather.location.country}</p>
                            
                            <div className="flex items-center justify-center my-6">
                                <img src={`https:${currentWeather.current.condition.icon}`} className="w-28 h-28 drop-shadow-2xl" alt="icon" />
                                <span className="text-7xl font-bold text-blue-600 drop-shadow-sm leading-none ml-2">
                                    {currentWeather.current.temp_c}°
                                </span>
                            </div>
                            <p className="text-gray-600 font-medium capitalize text-lg">
                                {currentWeather.current.condition.text}
                            </p>
                        </div>

                        {/* Liquid Stats Box */}
                        <div className="grid grid-cols-2 gap-4 bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[30px] mb-8">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 uppercase">HUMIDITY</p>
                                <p className="text-2xl font-bold text-blue-800">{currentWeather.current.humidity}%</p>
                            </div>
                            <div className="text-center border-l border-white/20">
                                <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 uppercase">WIND</p>
                                <p className="text-2xl font-bold text-blue-800">{currentWeather.current.wind_kph} <small className="text-xs">km/h</small></p>
                            </div>
                        </div>

                        {/* History Horizontal Row */}
                        {historyData.length > 0 && (
                            <div className="mb-8 pl-1">
                                <h3 className="text-sm font-bold text-gray-700 mb-4 border-b border-white/20 pb-2">Past Trends</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {historyData.map((day) => (
                                        <div key={day.date} className="shrink-0 w-28 p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-[25px] flex flex-col items-center">
                                            <span className="text-xs font-bold text-gray-700 mb-2">
                                                {new Date(day.date).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' })}
                                            </span>
                                            <img src={`https:${day.day.condition.icon}`} className="w-12 h-12" alt="icon" />
                                            <p className="font-bold text-blue-600 text-lg">{day.day.avgtemp_c}°</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Forecast Horizontal Row */}
                        {forecastData.length > 0 && (
                            <div className="pl-1">
                                <h3 className="text-sm font-bold text-blue-600 mb-4 border-b border-white/20 pb-2">Upcoming Forecast</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {forecastData.map((day) => (
                                        <div key={day.date} className="shrink-0 w-28 p-4 bg-blue-600/5 backdrop-blur-xl border border-blue-600/10 rounded-[25px] flex flex-col items-center">
                                            <span className="text-xs font-bold text-blue-700 mb-2">
                                                {new Date(day.date).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' })}
                                            </span>
                                            <img src={`https:${day.day.condition.icon}`} className="w-12 h-12" alt="icon" />
                                            <p className="font-bold text-blue-800 text-lg">{day.day.avgtemp_c}°</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                         <p className="text-blue-900/40 font-black text-xs uppercase tracking-widest animate-pulse">
                            {loading ? "Discovering Weather..." : "Search a city to start"}
                         </p>
                    </div>
                )}
            </div>
        </div>
    );

}