let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
let db;
(async () => {
  db = await open({
    filename: 'BD4_Assignment/database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Exercise 1: Get All Restaurants

async function fetchAllRestaurants() {
  let query = 'select * from restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    //console.log(results);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 2: Get Restaurant by ID

async function fetchByRestaurantsId(id) {
  let query = 'select * from restaurants where id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchByRestaurantsId(id);
    //console.log(results);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 3: Get Restaurants by Cuisine

async function fetchByCuisine(cuisine) {
  let query = 'select * from restaurants where cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let results = await fetchByCuisine(cuisine);
    //console.log(results);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 4: Get Restaurants by Filter

async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'select * from restaurants where isVeg = ? and hasOutdoorSeating = ? and isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  const hasOutdoorSeating = req.query.hasOutdoorSeating;
  const isLuxury = req.query.isLuxury;
  // console.log(isLuxury);
  try {
    const results = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);
    // console.log(results);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: ' restaurants not found. ' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Exercise 5: Get Restaurants Sorted by Rating

async function sortByRating() {
  let query = 'select * from restaurants order by rating desc';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'restaurants not found!' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 6: Get All Dishes

async function fetchAllDishes() {
  let query = 'select * from dishes ';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  let dishes = req.params.dishes;
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'Dishes not found!' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 7: Get Dish by ID

async function fetchById(id) {
  let query = 'select * from dishes where id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await fetchById(id);
    //console.log(results);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 8: Get Dishes by Filter
async function filterDishes(isVeg) {
  let query = 'select * from dishes where isVeg = ? ';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}
app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let results = await filterDishes(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'Dishes not found ' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Exercise 9: Get Dishes Sorted by Price

async function sortByPrice() {
  let query = 'select * from dishes order by price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  // let rating = req.params.rating;
  try {
    let results = await sortByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'dishes not found!' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log('server running on port 3000'));
