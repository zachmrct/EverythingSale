const mongoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');
const ProductCol = require('./ProductCol');


function connect () {
    mongoose.connect(process.env.MONGODB_URI,{
        socketTimeoutMS: 45000,  // Increase socket timeout duration
        connectTimeoutMS: 30000, // Increase connection timeout duration
    })
    mongoose.model('Product', Product.schema);
    mongoose.model('User', User.schema);
    mongoose.model('ProductCol', ProductCol.schema);

}

module.exports =  { connect };