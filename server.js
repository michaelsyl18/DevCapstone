const express = require("express");
const app = express();
const recentCities = [] // ['Dallas,Texas']

function seed(req) {
  const city = req.body.city;
  const state = req.body.state;

  city.value = "Dallas";
  state.value = "Texas";
}

app.use(express.text())

// start the server
app.listen(5500, () => {
  console.log("Server is running on port 5500");
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

