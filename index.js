//import dependencies

const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();
const morgan = require("morgan");
app.use(express.static("public"));
const mongoose = require("mongoose");
const Models = require("./models.js");
//import collections
const movies = Models.Movie;
const users = Models.User;
const genres = Models.genre;
const directors = Models.director;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const { check, validationResult } = require('express-validator');
//set up CORS
const cors = require('cors');
app.use(cors());


let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));


//set up Passport 
let auth = require('./auth')(app);
const passport = require('passport');
const { callbackify } = require("util");
require('./passport');

//set up logging to write to log.txt
fs = require("fs");
path = require("path");
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
//movie repo
//---------------------------------------------------------Database------------------------------------------------------

//mongoose.connect('mongodb://localhost:27017/DBfif', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch((error) => console.log(error)
  );


//---------------------------------------------------------URL req handling------------------------------------------------------


// -- users -- users -- users -- users -- users -- users -- users -- users --


//read -- all users 
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//create -- create new user
app.post("/users", [
  check('username', 'Username is required').isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail(),
  check('birthday', 'Please enter a valid date').trim().isDate()
], (req, res) => {
  //input validation
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  //password hashing/create account
  let hashedPassword = users.hashPassword(req.body.password);
  users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {

            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {

      res.status(500).send('Error: ' + error);
    });
});
//update -- update user info
app.put("/users/:id", passport.authenticate('jwt', { session: false }), [
  check('username', 'Username is required').isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('email', 'Email does not appear to be valid').isEmail(),
  check('birthday', 'Please enter a valid date').trim().isDate()
], (req, res) => {
  let hashedPassword = users.hashPassword(req.body.password)
  users.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      birthday: req.body.birthday
    }
  }, { new: true }, function (err, result) {
    if (err) {
      console.log(err);
    }
    res.send(result)
  });

})
//delete -- delete user 
app.delete("/users/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findByIdAndDelete(req.params.id, function (err, result) {
    if (err) {
      console.log(err);
    }
    res.send(result)
  });

});



//Create -- add movie to user favorites

app.post('/users/:name/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ username: req.params.username }, {
    $push: { favoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});



//delete -- remove movie from user favorites
app.delete("/users/:username/movies/:MovieID", passport.authenticate('jwt', { session: false }), (req, res) => {
  users.findOneAndUpdate({ username: req.params.username }, {
    $pull: { favoriteMovies: req.params.MovieID }
  },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


// -- movies -- movies -- movies -- movies -- movies -- movies -- movies -- movies 

//read documentation
app.get("/", (req, res) => {
  res.sendFile("documentation.html", { root: "public" });
});


//return all movies
//, passport.authenticate('jwt', { session: false })
app.get("/movies", (req, res) => {
  movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//return movie by title
app.get("/movies/:title", passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.findOne({ title: req.params.title }).then
    ((movie) => {
      res.status(200).json(movie)
    }).catch((err) => {
      res.status(400).send("Movie Not Found");
    })
});
//return movie by genre
app.get("/movies/genre/:genreId", passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.find({ "genre": req.params.genreId }).then
    ((movieList) => {
      res.status(200).json(movieList)
    }).catch((err) => {
      res.status(400).send("Movie Not Found");
    })
});
//return movie by director
app.get("/movies/director/:directorId", passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.find({ director: req.params.directorId }).then
    ((moviesList) => {
      res.status(200).json(moviesList)
    }).catch((err) => {
      res.status(400).send("Movie Not Found");
    })
});
//return movie Image
app.get("/movies/imageURL/:title", passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.findOne({ title: req.params.title }).then
    ((movie) => {
      res.status(200).json(movie.imageURL)
    }).catch((err) => {
      res.status(400).send("No image found");
    })
});
//return movie based on filmig location
app.get("/movies/filmingLocations/:cityName", passport.authenticate('jwt', { session: false }), (req, res) => {
  movies.find({ "filmingLocations.name": req.params.cityName }).then
    ((movieList) => {
      res.status(200).json(movieList)
    }).catch((err) => {
      res.status(400).send("No movies found for this location");
    })
});

//create -- add movie to database
app.post('/movie', passport.authenticate('jwt', { session: false }), [
  check('title', 'Title is required').isAlphanumeric(),
  check('filmingLocations.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.location.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.locations.location', 'Please enter LatLong coordinates').isLatLong()
], (req, res) => {
  movies.findOne({ name: req.body.title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.title + 'already exists');
      } else {
        users
          .create({
            title: { type: String, required: true },
            filmingLocations: [
              {
                name: String,
                locations: [{
                  name: String,
                  location: [String, String]
                }
                ], required: true

              }
            ],
            genre: {
              name: String,
              description: String
            },
            director: {
              name: String,
              Bio: String
            },
            imageURL: String,
            featured: Boolean
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {

            res.status(500).send('Error: ' + error);
          })
      }
    })
});
//update Movie Info
app.put("/movies/:movieId", passport.authenticate('jwt', { session: false }), [
  check('title', 'Title is required').isAlphanumeric(),
  check('filmingLocations.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.location.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.locations.location', 'Please enter LatLong coordinates').isLatLong()
], (req, res) => {
  movies.findByIdAndUpdate(req.params.movieId, { $set: req.body }, { new: true }, function (error, result) {
    if (error) {
      res.status(500).send('Error: ' + error);
    }
    res.send(result);
  })
});
// add filming locations to movie
app.post("/movies/:movieId", passport.authenticate('jwt', { session: false }), [
  check('filmingLocations.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.location.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.locations.location', 'Please enter LatLong coordinates').isLatLong()
], (req, res) => {
  movies.findByIdAndUpdate(req.params.movieId, { $push: { filmingLocations: req.body } }, { new: true }, function (err, result) {
    if (err) {
      res.status(500).send('Error: ' + error);
    }
    res.send(result);
  })
});
// remove filming locations from movie
app.delete("/movies/:movieId", passport.authenticate('jwt', { session: false }), [
  check('filmingLocations.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.location.name', 'Alphabetical Characters Only').isAlpha(),
  check('filmingLocations.locations.location', 'Please enter LatLong coordinates').isLatLong()
], (req, res) => {
  movies.findByIdAndUpdate(req.params.movieId, { $pull: { filmingLocations: { name: req.body.name } } }, { new: true }, function (err, result) {
    if (err) {
      res.status(500).send('Error: ' + error);
    }
    res.send(result);
  })
});

// director  director  director  director 

app.get("/directors", passport.authenticate('jwt', { session: false }), (req, res) => {
  directors.find().then
    ((directorList) => {
      res.status(200).json(directorList)
    }).catch((error) => {
      res.status(400).send("Error: " + error);
    })
});
app.get("/directors/:name", passport.authenticate('jwt', { session: false }), (req, res) => {
  directors.findOne({ name: req.params.name }).then
    ((director) => {
      res.status(200).json(director)
    }).catch((err) => {
      res.status(400).send("Director Not Found");
    })
});

// genre  genre  genre  genre  genre  genre genre

app.get("/genres", passport.authenticate('jwt', { session: false }), (req, res) => {
  genres.find().then
    ((genreList) => {
      res.status(200).json(genreList)
    }).catch((error) => {
      res.status(400).send("Error: " + error);
    })
});
app.get("/genres/:name", passport.authenticate('jwt', { session: false }), (req, res) => {
  genres.findOne({ "genre.name": req.params.name }).then
    ((genre) => {
      res.status(200).json(genre)
    }).catch((err) => {
      res.status(400).send("Genre Not Found");
    })
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
