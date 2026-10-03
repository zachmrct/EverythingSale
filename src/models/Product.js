const { Schema, model } = require('mongoose');

const productSchema = new Schema ({
    name: { type: String, required: true }, //check
    status: { type: String, required: true }, //check
    stock:{ type: Number, required: true }, //check
    pictures: { type: [String], required: true }, //check
    price: { type: Number, required: true }, //check
    material: { type: [String], required: true }, //check
    variations: { type: Map, of: [String], required: true },  // E.g., size, color
    category: { type: String, required: true }
})

const Product = model('Product', productSchema);

module.exports = Product;
