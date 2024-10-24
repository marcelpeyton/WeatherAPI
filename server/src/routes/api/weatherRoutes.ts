import { Router } from 'express';
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// // TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // // TODO: GET weather data from city name
  //console.log(`Logging req.body in post ${req.body} and ${Object.values(req.body)} and ${req.body as string}`)
  if (req.body) {    
    //weatherService.getWeatherForCity(Object.values(req.body)[0] as string)
    weatherService.getWeatherForCity(Object.values(req.body)[0] as string)
    // // TODO: save city to search history
    historyService.addCity(Object.values(req.body)[0] as string)
    res.json(`City added successfully`);
  }else{
    res.send(`Error in adding feedback`);
  }
});

// // TODO: GET search history
router.get('/history', async (req, res) => {
  if (req.body) {} // this does nothing but get rid of the declared but never read.
  historyService.getCities().then((data) => res.json(data));
});

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (req, res) => {});

export default router;
