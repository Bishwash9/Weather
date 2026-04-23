const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const BASE_URL = import.meta.env.VITE_WEATHER_API_URL

export const apiClient = async(endpoint: string, options: RequestInit =  {}): Promise<any> => {

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {})
    }

    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}key=${API_KEY}`

    try {
        const response = await fetch(url, { ...options, headers});
        if(!response.ok){
            throw new Error(`API request failed with status ${response.status}`);
        }

        return await response.json();
    }catch(error){
        console.error("API request error:", error);
        throw error;
    }
}