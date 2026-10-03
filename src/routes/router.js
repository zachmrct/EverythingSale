const express = require('express');
const router = express.Router();
//add yung controllers functions here
const { handleCollectionPageRequest, checkCollectionName, addCollection, editCollection,deleteCollection} = require('../controllers/collectionController');
const { login, logout,signup,renderSingup } = require('../controllers/loginController');
const { viewDashboard, getProfile, updateProfile, deleteUser } = require('../controllers/userController');
const {uploadCollectionPicture, uploadProductPicture, uploadProfilePicture} = require('../config/multerConfig');
const { deleteProductById, addProduct, editProduct, handleProductPageRequest, fetchCollectionProducts} = require('../controllers/productController');
const {handleDashboardPageRequest} = require('../controllers/dashboardController');
const {handleOrderPageRequest, addOrder, deleteOrder, editOrder} =require('../controllers/orderController');

// routes that are open to the public
const { isAuthenticated } = require('../middleware/authMiddleware');
const openRoutes = ['/login', '/logout','/signup'];

// Apply isAuthenticated middleware to all routes except login and logout
router.use((req, res, next) => {
  if (openRoutes.includes(req.path)) {
      return next();
  }
  return isAuthenticated(req, res, next);
});

//user login
router.get('/login', (req, res) => {
  req.session.destroy(() => {
    res.render('login',{
      layout: 'mainLayout',
      title:"Login"
    });
  });
},);

router.post('/login', login);
router.get('/logout', logout);

//signup page
router.get('/signup', renderSingup);


router.post('/signup', signup);

//users page
router.post('/update-user', uploadProfilePicture.single('profilePicture'), updateProfile);
router.get('/users',viewDashboard);
router.get('/users/:id',getProfile);
router.delete('/delete-user', deleteUser);

//dashboard page
router.get('/', handleDashboardPageRequest);

//orders page 
router.get('/orders', handleOrderPageRequest);
router.post('/add-order', addOrder);
router.post('/delete-order', deleteOrder);
router.post('/edit-order', editOrder);

// collections page
router.get('/collections', handleCollectionPageRequest);

// POST request collections
router.post('/delete-collection', deleteCollection);
router.post('/add-collection', uploadCollectionPicture.single('imagePath'), addCollection);
router.post('/api/collections/checkName', checkCollectionName);
router.post('/edit-collection', uploadCollectionPicture.single('editCollectionPicture'), editCollection);

// products page
router.get('/products', handleProductPageRequest);
router.post('/add-product', uploadProductPicture.single('imagePath') ,addProduct);
router.post('/edit-product',uploadProductPicture.single('imageEditInput'), editProduct);
router.delete('/delete-product', deleteProductById);
router.get('/products/:id', fetchCollectionProducts);

// export
module.exports = router;