function seed(req, res) {
    const city = 'Dallas';
    const state = 'TX';
    
    // You can do something with the values here, for example:
    const location = city + ',' + state;
    const weatherInfo = apiUrl(location);
    
    res.send('Seeded successfully');
  }
  