const express    = require('express');
const passport   = require('passport');
const authRoutes     = express.Router();
// User model
const User        = require("../models/user");
const Team        = require("../models/team");
const Game        = require("../models/game");
const Comment     = require("../models/comment");
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
    // console.log(team)
    res.render("authentication/teamPage", {user})
  });

  authRoutes.get("/game/:id", (req,res,next) => {
    let user = req.session.currentUser
    axios({
      method: "GET",
      url: 'https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/full_game_schedule.json?team='+user.team.abbr,
      dataType: 'json',
      async: false,
      headers: {
        "Authorization": "Basic " + btoa(process.env.sports_api_username + ":" + process.env.sports_api_password)
      },
      data: 'hi',
      success: function (){
        alert('Thanks for your comment!'); 
      }
    })
    .then(response =>{
      const someGameId = req.params.id
      const theGame = response.data.fullgameschedule.gameentry.filter(team => team.id === someGameId)
      //console.log("this is the game ", theGame)
      Comment.find({gameId: someGameId})
     .then(comments => {
      //console.log(req.session.currentUser)
      
    comments.forEach(oneComment => {
      // oneComment.userId.equals(req.user.id)
      if(oneComment.userId.equals(req.session.currentUser._id)){
        oneComment.isOwner = true;
      }

    })
      res.locals.comment = comments
      res.locals.game = theGame
      console.log(theGame)
      res.render('authentication/gamePage',{someGameId})
        // res.render('authentication/gamePage', {isOwner});
     })
      
    })
   
  })
  


  authRoutes.post('/create/:id', (req, res, next) => {
    const newComment = new Comment({
      email: req.session.currentUser.email,
      gameId: req.params.id,
      userId: req.session.currentUser._id,
      text: req.body.add
    })
    newComment.save()
    .then(res => {
        // console.log(res)
      })
      .catch(err => {console.log(err)})
      res.redirect('/game/'+req.params.id)
    })




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
      // schedule: using an Api
    });

    Team.findOne({ abbr:team })
    .then(res => {
        newUser.team = res;
        newUser.save()
    });

     res.redirect("/login");
   
  });
}); // end new user

const changeDatesToPassIntoFlightApi = (stringDate) =>{
stringDate = stringDate.split('-')
stringDate = stringDate.map(elem => {
  return Number(elem)
})
deptTwoBefore = new Date(stringDate[0],stringDate[1],stringDate[2]-2)
returnOneAfter = new Date(stringDate[0],stringDate[1],stringDate[2]+1)
//console.log('this dept two' , deptTwoBefore, returnOneAfter)
var backToString = new Date(deptTwoBefore),
        month = '' + (backToString.getMonth()+1),
        day = '' + backToString.getDate(),
        year = backToString.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    deptTwoBefore = [year, month, day].join('-');

    var backToString = new Date(returnOneAfter),
        month = '' + (backToString.getMonth()+1),
        day = '' + backToString.getDate(),
        year = backToString.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
   
    returnOneAfter = [year, month, day].join('-');
    var arrOfBothDates = [];
    arrOfBothDates.push(deptTwoBefore,returnOneAfter)
    return arrOfBothDates
}

authRoutes.get('/schedule/:team',(req,res,next) => {
  let teamAbbr = req.params.team
 
  axios({
    method: "GET",
    url: 'https://api.mysportsfeeds.com/v1.2/pull/nfl/2018-regular/full_game_schedule.json?team='+teamAbbr,
    dataType: 'json',
    async: false,
    headers: {
      "Authorization": "Basic " + btoa(process.env.sports_api_username + ":" + process.env.sports_api_password)
    },
    data: 'hi',
    success: function (){
      alert('Thanks for your comment!'); 
    }
  })
  .then(response =>{
    const awaySchedule = response.data.fullgameschedule.gameentry.filter(team => team.awayTeam.Abbreviation === teamAbbr)
      const flight = awaySchedule.map(schedule => {
        let flightDates = changeDatesToPassIntoFlightApi(schedule.date)
        schedule.date = new Date(schedule.date)
       let day = schedule.date.getDate() + 1
       schedule.date.setDate(day)
       schedule.date = schedule.date.toDateString()
       //console.log(flightDates)
      Team.find({abbr: schedule.homeTeam.Abbreviation})
      .then(team => {
      //console.log(team[0].airport)
      //have the destination airport here for flights query
      // axios.get(`https://api.sandbox.amadeus.com//v1.2/flights/low-fare-search?apikey=QpXyD4VfMAqlAGjQdQ3pk2VmtEC3lBE1&origin=${teamAbbr}&destination=${team[0].airport}&departure_date=${flightDates[0]}&return_date=${flightDates[1]}&number_of_results=1`)
      // .then(flight => {
      //   const flights = (flight.data.results[0].fare.total_price)
      //   console.log(flights)
      //    let data = {}
      //    data.flightList = flights
      //   // res.locals.team = awaySchedule.slice(0)
       
      //  // console.log(awaySchedule)
      //   //console.log(res.locals.team)
      //   // res.render('authentication/teamPage')
        
      // }).catch(err => {
      //   next(err);
      // })
    })
    .catch(err => {
      next(err);
    })
   
})
    let user = req.session.currentUser
    //console.log(user)
    res.locals.currentUser = user
    res.locals.yourTeam = awaySchedule[0].awayTeam
    res.locals.team = awaySchedule.slice(0)
    // res.locals.flight = flight
    // console.log(awaySchedule)
    //console.log(res.locals.team)
    res.render('authentication/teamPage')     
    
 
  })
})


authRoutes.post('/edit', (req, res, next) => {
  console.log(req.body)

  Comment.findByIdAndUpdate(req.body.id, {text: req.body.text})
   .then(res => {
     console.log("function passed")
   })
  .catch(err => {
    console.log(err)
  })
    res.render('authentication/gamePage') 
 })


 authRoutes.post('/delete', (req, res, next) => {
  console.log(req.body)

  Comment.findOneAndRemove({_id: req.body.id})
   .then(res => {
     console.log("function passed")
    
   })
  .catch(err => {
    console.log(err)
  })
  res.render('authentication/gamePage') 
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




authRoutes.post("/schedule/:team", passport.authenticate("local",
{
  successRedirect: "/authentication/teamPage",
  failureRedirect: "/login",
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
