

// const cloudinary = require('cloudinary');
// const cloudinaryStorage = require('multer-storage-cloudinary');
// const multer = require('multer');

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_KEY,
//     api_secret: process.env.CLOUD_SECRET
// });

// var storage = cloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: 'folder-name',
//   allowedFormats: ['jpg', 'png'],
//   filename: function (req, file, cb) {
//     cb(null, 'my-file-name');
//   }
// });

// router.post('/movie/add', uploadCloud.single('photo'), (req, res, next) => {
//     const { title, description } = req.body;
//     const imgPath = req.file.url;
//     const imgName = req.file.originalname;
//     const newMovie = new Movie({title, description, imgPath, imgName})
//     newMovie.save()
//     .then(movie => {
//       res.redirect('/')
//     })
//     .catch(error => {
//       console.log(error)
//     })
//   });

// const uploadCloud = multer({ storage: storage })
// module.exports = uploadCloud;