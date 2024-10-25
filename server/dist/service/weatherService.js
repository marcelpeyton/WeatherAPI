import { error } from 'console';
import dotenv from 'dotenv';
dotenv.config();
// // TODO: Define a class for the Weather object
// one day
//city, date, icon, iconDescription, tempF, windSpeed, humidity
//(0K − 273.15) × 9/5 + 32 = -459.7°F
export class Weather {
    constructor(date, tempF, windSpeed, humidity, icon, iconDescription, city, could_not_find_city_flag) {
        this.date = date;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.tempF = tempF;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.city = city;
        this.could_not_find_city_flag = could_not_find_city_flag;
    }
}
// // TODO: Complete the WeatherService class
class WeatherService {
    constructor(city) {
        // // TODO: Define the baseURL, API key, and city name properties
        this.baseURL = process.env.API_BASE_URL;
        this.apiKey = process.env.API_KEY;
        this.baseURL = process.env.API_BASE_URL;
        this.apiKey = process.env.API_KEY;
        this.city = city;
        this.could_not_find_city_flag = false;
    }
    // // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        //console.log(`The GEOCODE URL: ${this.baseURL}/data/2.5/forecast?q=${this.city}&appid=${this.apiKey}`)
        return `${this.baseURL}/data/2.5/forecast?q=${this.city}&appid=${this.apiKey}`;
    }
    // // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            return await (await fetch(query)).json()
                .then((response) => {
                if (Number(response.cod) >= 400) {
                    throw error("Could not find city!");
                }
                else {
                    const data = {
                        lat: response.city.coord.lat,
                        lon: response.city.coord.lon,
                        name: response.city.name,
                        country: response.city.country,
                    };
                    return data;
                }
                //console.log(`Logging: fecthlocationData: ${response.city.coord.lat}, Logging the city ${this.city}, and with this query: ${query}`) 
            });
        }
        catch (e) {
            const data = {
                lat: 0,
                lon: 0,
                name: "",
                country: "",
            };
            this.could_not_find_city_flag = true;
            return data;
        }
    }
    // // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        //return await fetch(this.buildWeatherQuery(coordinates))
        //https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}
        return await (await fetch(this.buildWeatherQuery(coordinates))).json()
            .then((response) => {
            const data = {
                list: response.list,
            };
            //${data.list[0].dt_txt}
            //console.log(`HERE IS THE FETCH WEATHER DATA: ${response.cod}, ${Object.values(coordinates)}`)
            return data;
        });
    }
    // // TODO: Create destructureLocationData method
    //Coordinates has everything in it.
    destructureLocationData(locationData) {
        const coord = {
            lat: locationData.lat,
            lon: locationData.lon,
            name: locationData.name,
            country: locationData.country,
        };
        return coord;
    }
    // // TODO: Create buildWeatherQuery method  
    buildWeatherQuery(coordinates) {
        //console.log(`The url: ${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`)
        return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    }
    // // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        return await this.fetchLocationData(this.buildGeocodeQuery()).then(result => {
            //console.log(`Logging result: ${result.lat}`)
            return this.destructureLocationData(result);
        });
    }
    // // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response, index) {
        //Need date, temp, windSpeed, humidity, rain
        //need to find the first date.
        let currentWeather = new Weather("", 0, 0, 0, "", "", "", true);
        //console.log(`our list this here: ${response.list}`)
        if (!Object.is(undefined, response.list)) {
            const filtered_day_list = response.list.filter((day) => day.dt_txt.includes("12:00:00"));
            const date = filtered_day_list[index].dt_txt;
            const tempF = Number(Object.values(filtered_day_list[index].main)[0].toFixed(0));
            //console.log(`Here it is: ${tempF}`)
            const windSpeed = filtered_day_list[index].wind.speed;
            const humidity = filtered_day_list[index].main.humidity;
            const icon = filtered_day_list[index].weather[0].icon;
            const iconDescription = filtered_day_list[index].weather[0].description;
            currentWeather = new Weather(date, tempF, windSpeed, humidity, icon, iconDescription, this.city, this.could_not_find_city_flag);
            //console.log(`Here is the object: ${currentWeather.tempF}`) 
            //console.log(`Here is the object: ${Object.values(currentWeather)}`)      
        }
        return currentWeather;
    }
    // // TODO: Complete buildForecastArray method
    //private async buildForecastArray(currentWeather: Weather, weatherData: any[], index :number) {
    async buildForecastArray() {
        const forecastArray = [];
        for (let i = 0; i < 5; i++) {
            await this.fetchAndDestructureLocationData().then(async (result) => {
                const coord = result;
                const weather_table = await this.fetchWeatherData(coord);
                forecastArray.push(this.parseCurrentWeather(weather_table, i));
            });
        }
        return forecastArray;
    }
    // // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        //console.log(`Hello this created a WeatherService object with city name: ${city}`)
        const myCity = new WeatherService(city);
        return await myCity.buildForecastArray().then(result => {
            //console.log(`Good bye here's your array:`)
            // for(let i = 0; i<5; i++){
            //   console.log(`Value ${Object.values(result[i])}`);
            // }
            let weather_array = result;
            return weather_array;
        });
    }
}
export default new WeatherService("NOCITY");
