const express = require('express');
const router  = express.Router();
/* routes/index.js */
//...

// const Picture = require('../models/picture');
// const upload = require('./public/uploads/');
// //...
// /* GET home page */


// router.post('/movie/add', uploadCloud.single('photo'), (req, res, next) => {
//   const { title, description } = req.body;
//   const imgPath = req.file.url;
//   const imgName = req.file.originalname;
//   const newMovie = new Movie({title, description, imgPath, imgName})
//   newMovie.save()
//   .then(movie => {
//     res.redirect('/')
//   })
//   .catch(error => {
//     console.log(error)
//   })
// });
router.get('/', (req,res,next) => {
  res.render('index')
})
module.exports = router;
