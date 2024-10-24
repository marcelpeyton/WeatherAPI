import fs from 'node:fs/promises';
// // TODO: Define a City class with name and id properties
class City{
  name: string;
  id : number;
  constructor(name: string, id : number) {
    // default value for isSleepy is false if no value is provided
    this.name = name;
    this.id = id;
  }
}

// // TODO: Complete the HistoryService class
class HistoryService {
  // // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
  // // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile(
      'db/searchHistory.json',
      JSON.stringify(cities, null, '\t')
    );
  }
  // // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((City) => {
      let parsedCity: City[];

      // If cities isn't an array or can't be turned into one, send back a new empty array
      try {
        parsedCity = [].concat(JSON.parse(City));
      } catch (err) {
        parsedCity = [];
      }

      return parsedCity;
    });
  }
  // // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    // Add a unique id to the city using uuid package
    const cities = await this.getCities();
    let id = 1;
    let x = 1;
    if(cities.length > 0){
      cities.sort((a, b) => (a.id > b.id ? 1 : -1));
      cities.forEach((city) => {
        if(x == city.id){
          x++;
        }
      })
      id = x;
    }    
    const newCity: City = {
      name: city, 
      id : id
    };

    return await this.getCities()
    .then((city) => {
      return [...city, newCity];
    })
    .then((updatedCity) => this.write(updatedCity))
    .then(() => newCity);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

}

export default new HistoryService();
