import fs from 'node:fs/promises';
// // TODO: Define a City class with name and id properties
class City {
    constructor(name, id) {
        // default value for isSleepy is false if no value is provided
        this.name = name;
        this.id = id;
    }
}
// // TODO: Complete the HistoryService class
class HistoryService {
    // // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        return await fs.readFile('db/searchHistory.json', {
            flag: 'a+',
            encoding: 'utf8',
        });
    }
    // // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
    }
    // // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return await this.read().then((City) => {
            let parsedCity;
            // If cities isn't an array or can't be turned into one, send back a new empty array
            try {
                parsedCity = [].concat(JSON.parse(City));
            }
            catch (err) {
                parsedCity = [];
            }
            return parsedCity;
        });
    }
    // // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        // Add a unique id to the city using uuid package
        const cities = await this.getCities();
        let id = 1;
        let x = 1;
        let addFlag = true;
        if (cities.length > 0) {
            cities.sort((a, b) => (a.id > b.id ? 1 : -1));
            cities.forEach((city_o) => {
                if (city_o.name == city) {
                    addFlag = false;
                }
                if (x == city_o.id) {
                    x++;
                }
            });
            id = x;
        }
        if (addFlag) {
            const newCity = {
                name: city,
                id: id
            };
            return await this.getCities()
                .then((city) => {
                return [...city, newCity];
            })
                .then((updatedCity) => this.write(updatedCity))
                .then(() => newCity);
        }
        else {
            return await this.getCities();
        }
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        return await this.getCities()
            .then((cities) => cities.filter((city) => city.id !== Number(id)))
            .then((filteredCities) => this.write(filteredCities));
    }
}
export default new HistoryService();
