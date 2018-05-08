const express    = require('express');
const passport   = require('passport');
const authRoutes     = express.Router();
// User model
const User        = require("../models/user");
const Team        = require("../models/team")
const Game        = require("../models/game")
const flash       = require("connect-flash");
const btoa = require( "btoa" );
const axios = require("axios");
const ensureLogin = require("connect-ensure-login");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


authRoutes.get("/login", (req, res, next) => {
    res.render("authentication/login");
  });

  authRoutes.get("/signup", (req, res, next) => {
    res.render("authentication/signup");
  });

  authRoutes.get("/", (req, res, next) => {
    res.render("index", { "message": req.flash("error") });
  });
  
  authRoutes.get("/teamPage", (req, res, next) => {
     let user = req.session.currentUser
     let team = res.locals.team
     console.log(team)
     console.log('Im inside of the teampage get!!')
    res.render("authentication/teamPage", {user})
  });



authRoutes.post("/newUser", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let team = req.body.teams;
  const city = req.body.city;
  const airport = req.body.airport;
   
  if (email === "" || password === "") {
    res.render("authentication/signup", { message: "Please indicate email and password" });
    return;
  }

  User.findOne({email:email }, "email", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", { message: "Sorry, that email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
   
      var newUser = new User({
      name: name,
      email: email,
      password: hashPass,
      team: team,
      city: city,
      airport: airport,
      schedule: Array
    });

    Team.findOne({ abbr:team })
    .then(res => {
        newUser.team = res;
    Game.find({away:team})
    .then(res => {
      newUser.team.schedule = res;
      console.log(newUser)
      newUser.save()
    })
    });

     res.redirect("/login");
   
  });
}); // end new user


authRoutes.get('/schedule/:team',(req,res,next) => {
  let teamAbbr = req.params.team
  axios({
    method: "GET",
    url: 'https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/full_game_schedule.json?team='+teamAbbr,
    dataType: 'json',
    async: false,
    headers: {
      "Authorization": "Basic " + btoa('rojasdali' + ":" + 'madden06')
    },
    data: 'hi',
    success: function (){
      alert('Thanks for your comment!'); 
    }
  })
  .then(response =>{
    const awaySchedule = response.data.fullgameschedule.gameentry.filter(team => team.awayTeam.Abbreviation === teamAbbr)
    
    const homeAbbr = awaySchedule.map(schedule => {
      Team.find({abbr: schedule.homeTeam.Abbreviation})
      .then(team => {
      //console.log(team[0].airport)
      //have the destination airport here for flights query
      
      axios.get('https://api.sandbox.amadeus.com//v1.2/flights/low-fare-search?apikey=0ZvBS2RYMAezAqBxLqpdDNOjSe3ikC9C&origin='+teamAbbr+'&destination='+team[0].airport+'&departure_date='+schedule.date+'&return_date=2019-02-17&number_of_results=1')
      .then(flight => {
       console.log(flight.data.results[0].fare.total_price)
      })
    })
     
      })
    res.locals.team = awaySchedule.slice(0)
    //console.log(res.locals.team)
    res.render('authentication/teamPage')
          
  })
  console.log(res.locals.team)
  //res.redirect('../teamPage')
  
})
  authRoutes.post("/login", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    if (email === "" || password === "") {
      res.render("authentication/login", {
        errorMessage: "Indicate a email and a password to sign up"
      });
      return;
    }
  
    User.findOne({ "email": email }, (err, user) => {
        if (err || !user) {
          res.render("authentication/login", {
            errorMessage: "The email doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/schedule/"+user.team.abbr);
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  }); // end login




authRoutes.post("authentication/teamPage", passport.authenticate("local",
{
  successRedirect: "/bossPage",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}
));

// authRoutes.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {

//     res.redirect('/')
//   }
// }

// function checkRoles(role) {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       return next();
//     } else {
//       res.redirect('/show')
//     }
//   }
// }

// authRoutes.get('/bossPage', checkRoles('BOSS'), (req, res) => {
//   res.render('auth/platform', {user: req.user});
// });



module.exports = authRoutes;
