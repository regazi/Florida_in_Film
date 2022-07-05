const mongoose = require('mongoose');
const { stringify } = require('uuid');
const bcrypt = require('bcrypt');


let movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  filmingLocations: [
     {
      name: String,
      locations: [ { 
        name: String,
        location: [String, String] 
      }
      ]
        
  }      
  ],
  genre:{
     type: mongoose.Schema.Types.ObjectId, ref: 'genre'
    },
  director: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Movie' 
  },
  ImageURL: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

let genreSchema = mongoose.Schema({
  name: String,
  description: String
})
let directorSchema = mongoose.Schema({
  name: String,
  about: String
})


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let genre = mongoose.model('genre', genreSchema);
let director = mongoose.model('director', genreSchema);

module.exports.Movie = Movie; 
module.exports.User = User;
module.exports.genre = genre;
module.exports.director = director;
//movies
 