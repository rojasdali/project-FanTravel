const express    = require('express');
const passport   = require('passport');
const authRoutes     = express.Router();
// User model
const User        = require("../models/user");
const Team        = require("../models/team")
const Game        = require("../models/game")
const flash       = require("connect-flash");

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



authRoutes.post("/newUser", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let team = req.body.teams;
  const city = req.body.city;
  const airport = req.body.airport;
    console.log('!!!!!! ',team)


  if (email === "" || password === "") {
    res.render("authentication/signup", { message: "Please indicate email and password" });
    return;
  }

  User.findOne({ email:email }, "email", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", { message: "Sorry, that email already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
   
    Team.findOne({ abbr:team })
    .then(res => {
        team = res
    })

    
    // console.log("ewjhrjoehwjhasjdhfjahdshfiahiuhaewuhypre",team);
    // const games = (Game.find({away:team}))
    // console.log('kjdshfkjsadkjfkjdas',games)
    //team.schedule.push(Game.find({away:team}))

      const newUser = new User({
      name: name,
      email: email,
      password: hashPass,
      team: team,
      city: city,
      airport: airport
    });

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  });
}); // end sign up



  router.post("/login", (req, res, next) => {
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
          res.redirect("/");
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  }); // end login

//   authRoutes.get("/teamPage", (req, res, next) => {
//     Team.find({schedule: {$all: [{ "$elemMatch" : { size: "M" } }] } }, function(err, employee) {
//         res.render('authentication/teamPage', {employee});
//      });
    
//     })




// authRoutes.post("/", passport.authenticate("local",
// {
//   successRedirect: "/bossPage",
//   failureRedirect: "/",
//   failureFlash: true,
//   passReqToCallback: true
// }
// ));

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
