import { apiClient } from "../Config/weatherApi";

export const WeatherService = {
    getCurrentWeather: async (city: string) =>{
        return await apiClient(`/current.json?q=${city}`);
    },
    getForeCast: async (city:string, days: number = 3) => {
        return await apiClient(`/forecast.json?q=${city}&days=${days}`);
    },
    searchCity: async (query: string) => {
        return await apiClient(`/search.json?q=${query}`);
    },
    getHistory: async (city: string, date: string) => {
        return await apiClient(`/history.json?q=${city}&dt=${date}`);
    }
}