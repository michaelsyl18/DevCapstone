const express = require("express");
const app = express();
const recentCities = [] // ['Dallas,Texas']

function seed(req) {
  const city = req.body.city;
  const state = req.body.state;

  city = "Dallas";
  state = "Texas";
}

app.use(express.text())

// start the server
app.listen(5502, () => {
  console.log("Server is running on port 5502");
});

app.use(express.static(__dirname))

app.post('/api/addToRecent', (req, res) => {
  const data = req.body // 'Dallas,Texas'
  console.log('data', data)
  // only add the city if it's not in the recent cities array to avoid duplicates
  if (!recentCities.includes(data)) {
    recentCities.push(data);
  }
  res.send({
    'recentCities': recentCities
  });
})


// app.get("/api", async (req, res) => {
//   const city = req.query.city;
//   const state = req.query.state;
//   const cityStateString = `${city},${state}`;
//   const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityStateString}&appid=${API_KEY}`;
  
//   try {
//     const response = await axios.get(apiUrl);
//     const weatherInfo = {
//       temperature: response.data.main.temp,
//       description: response.data.weather[0].description
//     };
//     res.json(weatherInfo);
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid location' });
//     console.log("invalid")
//   }
// });

