const multer = require('multer');
//const path = require('path');

// Collection picture storage setup
const storageCollectionPicture = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/collections');
    },
    filename: (req, file, cb) => {
        console.log('File Path: ',file);
        cb(null, file.originalname);
    }
  });
  
  // Product picture storage setup
  const storageProductPicture = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/products/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  });
  
  // Profile picture storage setup
  const storageProfilePicture = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/users/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  });

  // Create upload objects for each type of file
  const uploadProfilePicture = multer({ storage: storageProfilePicture });
  const uploadCollectionPicture = multer({ storage: storageCollectionPicture });
  const uploadProductPicture = multer({ storage: storageProductPicture });

module.exports = {
    uploadProfilePicture,
    uploadCollectionPicture,
    uploadProductPicture
};
