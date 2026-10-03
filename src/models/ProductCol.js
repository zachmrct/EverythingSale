const { Schema, model } = require('mongoose');

const productColSchema = new Schema ({
    name: { type: String, required: true },  // E.g., "Zara", "Uniqlo"
    pieces: [{ type: Schema.Types.ObjectId, ref: 'Product', required: false }],  // Array of Product IDs
    collectionPicture: { type: String, required: false },  // Image representing the brand collection
    category: {type: String, required: true}
})

const ProductCol = model('ProductCol', productColSchema);

module.exports = ProductCol;
