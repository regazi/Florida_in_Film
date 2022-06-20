//import dependencies

const express = require("express"), 
bodyParser = require('body-parser'),
uuid = require('uuid');
const app = express();
app.use(bodyParser.json())
const morgan = require("morgan");
app.use(express.static('public'));
//movie repo
//---------------------------------------------------------Database------------------------------------------------------
let movies = [
    {
      title: "Out of Time",
      filmingLocations:{ 
      city: "Naples",
      city: "Boca Grande",
      city:  "Sarasota"
    },
      setting: {
        city: "Miami"
      },
      genre: {
        name: "thriller",
        description: "Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety"
      },
      director: {
        name: "Carl Franklin",
        about: "Carl makes movies"
      },
     
      imageURL: "https://m.media-amazon.com/images/M/MV5BMjAxMTMzNTI5Ml5BMl5BanBnXkFtZTcwNDAwMTQ2NA@@._V1_.jpg"
    },
    {
        title: "The Truman Show",
        filmingLocations:{
          city: "Seaside"
        },
        setting:{ 
        city: "Florida Panhandle"
      }     
    },
    {
      title: 'Ruby In Paradise',
      filmingLocations: {
        city: "Panama City Beach"
      },
      setting:{
        city: "Panama City Beach"
        }

    },
    {
      title: 'Gone Fishing',
      filmingLocations: {
        city: "Naples", 
        city: "Marco Island"
      },
      setting:{
         city: "Florida"
        }
      }
  ];

let users = [
  {
    name:"John Doe",
    id:"1",
    favoriteMovies: []
  },
  {
    name:"Jane Doe",
    id:"2",
    favoriteMovies: []
  }
]

//---------------------------------------------------------URL req handling------------------------------------------------------

// -- users -- users -- users -- users -- users -- users -- users -- users --

//read -- all users 
app.get("/users", (req, res) => {
  res.status(200).json(users) 
  });
//create -- create new user
app.post("/users", (req, res) =>{
  const newUser = req.body;
  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  }else{
    res.status(400).send("User needs 'name'")
  }
})
//update -- update username
app.put("/users/:id", (req, res) =>{
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user)
  }else{
    res.status(400).send("No such user found")
  }
})
//delete -- delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  let user = users.find( user => user.id == id);

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`)
  }else{
    res.status(400).send("No such user found")
  }
});

//Create -- add movie to user favorites
app.post("/users/id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).json(`${movieTitle} has been added to user ${id}'s array`);
  }else{
    res.status(400).send("No such user found")
  }
});

//delete -- remove movie from user favorites
app.delete("/users/id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  let user = users.find( user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle)
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  }else{
    res.status(400).send("No such user found")
  }
});



// -- movies -- movies -- movies -- movies -- movies -- movies -- movies -- movies 

//read
app.get("/", (req, res) => {
    res.sendFile("documentation.html", { root: "public" });
  });
//read
app.get("/movies", (req, res) => {
  res.status(200).json(movies) 
  });
//read
app.get("/movies/:title", (req, res) => {
 const { title } = req.params;
 const movie = movies.find( movie => movie.title === title);
 if(movie){
  res.status(200).json(movie)
 }else{
  res.status(400).send("Movie Not Found");
 }
});
//read
app.get("/movies/genre/:genreName", (req, res) => {
 const { genreName } = req.params;
 const genre = movies.find( movie => movie.genre.name === genreName).genre;
 if(genre){
  res.status(200).json(genre)
 }else{
  res.status(400).send("Genre Not Found");
 }
});
//read
app.get("/movies/director/:directorName", (req, res) => {
 const { directorName } = req.params;
 const director = movies.find( movie => movie.director.name === directorName).director;
 if(director){
  res.status(200).json(director)
 }else{
  res.status(400).send("Director Not Found");
 }
});
//read
app.get("/movies/imageURL/:movieName", (req, res) => {
 const { movieName } = req.params;
 const imageURL = movies.find( movie => movie.title === movieName).imageURL;
 if(imageURL){
  res.status(200).json(imageURL)
 }else{
  res.status(400).send("No cover image found");
 }
});
//read
app.get("/movies/filmingLocation/:cityName", (req, res) => {
 const { title } = req.params;
 const movie = movies.find( movie => movie.filmingLocations.city === cityName);

 if(movie){
  res.status(200).json(movie)
 }else{
  res.status(400).send("Movie Not Found")
 }
});

//create -- add movie to database
app.post('/movie', (req, res) => {
  let newMovie = req.body;
  
  if(!newMovie.title) {
    const message = 'Missing "title" in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});
app.listen(8080, () => {
  console.log("Listening on port 8080");
});

//set up logging to write to log.txt
fs = require("fs");
path = require("path");
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {flags: "a"});
app.use(morgan("combined", {stream: accessLogStream}));