const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    customer: { type: String, required: true },
    orderNumber: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Unpaid', 'Paid', 'Returned', 'Cancelled'],
        default: 'Pending'
    },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            stockNumber: { type: Number, required: true },
        }
    ]
});

const Order = model('Order', orderSchema);

module.exports = Order;
