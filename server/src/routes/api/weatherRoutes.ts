import { Router } from 'express';
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';
import { Weather } from '../../service/weatherService.js';
const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// // TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  // // TODO: GET weather data from city name
  //console.log(`Logging req.body in post ${req.body} and ${Object.values(req.body)} and ${req.body as string}`)
  if (req.body) {   
    let forecast : Weather [] = [] 
    //weatherService.getWeatherForCity(Object.values(req.body)[0] as string)
    await weatherService.getWeatherForCity(Object.values(req.body)[0] as string).then(result =>{
      forecast = result;
      if(forecast[0].could_not_find_city_flag){
        res.send(`Could not find city!`);
      }else{
        historyService.addCity(Object.values(req.body)[0] as string)
        res.json(forecast);
      }
      //console.log(`${forecast[0].date}`)
    })
  }else{
    res.send(`Error in adding Weather Service`);
  }
});

// // TODO: GET search history
router.get('/history', async (req, res) => {
  if (req.body) {} // this does nothing but get rid of the declared but never read.
  historyService.getCities().then((data) => res.json(data));
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {  
  try {
    if (!req.params.id) {
      res.status(400).json({ msg: 'id is required' });
    }
    await historyService.removeCity(req.params.id);
    res.json({ success: 'City successfully removed from search history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  });

export default router;
