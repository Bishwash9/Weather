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
            


   
            <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-3xl rounded-[40px] border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden">
                
                {currentWeather ? (
                    <div className="flex flex-col md:flex-row min-h-150">
                        
   
                        <div className="md:w-5/12 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/20">
                            
                     
                            <div>
                                <div className="flex gap-3 bg-white/10 p-2 rounded-2xl border border-white/20">
                                    <input
                                        type="text"
                                        placeholder="Search city..."
                                        className="bg-transparent flex-1 p-2 text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch(city)}
                                    />
                                    <button
                                        onClick={() => handleSearch(city)}
                                        className="bg-white/40 backdrop-blur-md px-4 py-1 rounded-xl text-blue-600 font-bold hover:bg-white/60 transition shadow-sm text-sm"
                                    >
                                        {loading ? "..." : "Search"}
                                    </button>
                                </div>
                            </div>

                
                            <div className="text-center py-10">
                                <h2 className="text-3xl font-bold text-indigo-800 tracking-tight">
                                    {currentWeather.location.name}
                                </h2>
                                <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest">{currentWeather.location.country}</p>
                                
                                <div className="flex items-center justify-center my-4">
                                    <img src={`https:${currentWeather.current.condition.icon}`} className="w-28 h-28 drop-shadow-2xl" alt="icon" />
                                    <span className="text-8xl font-bold text-blue-600 drop-shadow-sm leading-none ml-2">
                                        {currentWeather.current.temp_c}°
                                    </span>
                                </div>
                                <p className="text-gray-600 font-medium capitalize text-lg">
                                    {currentWeather.current.condition.text}
                                </p>
                            </div>

                         
                            <div className="grid grid-cols-2 gap-4 bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[30px] shadow-sm">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 uppercase">HUMIDITY</p>
                                    <p className="text-2xl font-bold text-blue-800">{currentWeather.current.humidity}%</p>
                                </div>
                                <div className="text-center border-l border-white/20">
                                    <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-1 uppercase">WIND</p>
                                    <p className="text-2xl font-bold text-blue-800">{currentWeather.current.wind_kph} <small className="text-xs">km/h</small></p>
                                </div>
                            </div>
                        </div>

                       
                        <div className="md:w-7/12 p-10 space-y-12 bg-white/5 backdrop-blur-sm">
                            
                
                           
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Past 7 Days</h3>
                                        <div className="h-px flex-1 bg-white/20 mx-4"></div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                        {historyData.map((day) => (
                                            <div key={day.date} className="shrink-0 w-28 p-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-[25px] flex flex-col items-center hover:bg-white/30 transition shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-700 mb-2">
                                                    {new Date(day.date).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' })}
                                                </span>
                                                <img src={`https:${day.day.condition.icon}`} className="w-10 h-10" alt="icon" />
                                                <p className="font-bold text-blue-600 text-lg">{day.day.avgtemp_c}°</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                           

                         
                           
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Upcoming</h3>
                                        <div className="h-px flex-1 bg-blue-600/10 mx-4"></div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                        {forecastData.map((day) => (
                                            <div key={day.date} className="shrink-0 w-28 p-4 bg-blue-600/5 backdrop-blur-xl border border-blue-600/10 rounded-[25px] flex flex-col items-center hover:bg-blue-600/10 transition shadow-sm">
                                                <span className="text-[10px] font-bold text-blue-700 mb-2">
                                                    {new Date(day.date).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' })}
                                                </span>
                                                <img src={`https:${day.day.condition.icon}`} className="w-10 h-10" alt="icon" />
                                                <p className="font-bold text-blue-800 text-lg">{day.day.avgtemp_c}°</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            

                        </div>
                    </div>
                ) : (
                    <div className="min-h-100 flex flex-col items-center justify-center p-20 gap-6">
                         <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                         <div className="text-center">
                            <p className="text-blue-900/40 font-black text-sm uppercase tracking-widest animate-pulse">
                                {loading ? "Scanning the Skies..." : "Search a city to start"}
                            </p>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );


}