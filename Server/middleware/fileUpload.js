const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'image') {
       
        cb(null, './public/images/');
      } 
      else if (file.fieldname === 'video') {
        
        cb(null, './public/videos/');
      }
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  });
  
    
  const fileFilter = (req, file, cb) => {
    if (
      (file.fieldname === 'image' && (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')) ||
      (file.fieldname === 'video' && (file.mimetype === 'video/mp4' || file.mimetype === 'video/mpeg'))
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'video', maxCount: 1 }, 
  ]);
  

  module.exports = upload;