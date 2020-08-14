const mongoose = require('mongoose');

/*=============Cryptage password==============*/
var bcrypt = require('bcrypt');
/*=============EO Cryptage password==============*/


const collectionSchema = new mongoose.Schema({
	name: {
    	type: String,
    	//trim: true,
      //min: (5, 'Trop petit, min 5 caratères'),
	},
	firstname: {
    	type: String,
    	trim: true,
	},
	month: {
    	type: String,
    	trim: true,
	},
	year: {
    	type: String,
    	trim: true,
	},
	email: {
    	type: String,
    	trim: true,
	},
	password: {
    	type: String,
    	trim: true,
	},
});

// authenticate input against database documents
collectionSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}

// C'est ca qui crypt le mot de passe.
//Mais ne pas enlever ce bloc car si on l'enleve lors de l'inscription le password n'est pas crypté mais du coup lors de la connexion,
//il croit que le password est crypté donc conflit.
collectionSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('utilisateurs', collectionSchema);
module.exports = User;
