const Orders = require('../models/Order');
const Product = require('../models/Product');

const handleOrderPageRequest = async (req, res) => {
    try {
        const orders = await Orders.find({}).lean();
        const products = await Product.find({}).lean(); // Fetch all products from the database
        console.log(orders);
        res.render('orders', { 
            layout: 'mainLayout',
            user: req.session,
            title: 'Orders',
            orders,
            products
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const addOrder = async (req, res) => {
    try {
        const { newOrderId, newOrderName, newOrderAddress, newOrderStatus, newOrderContactNumber, newOrderEmail, totalPrice, productIds, quantities, newOrderDate } = req.body;

        console.log("Request body:", req.body); // Debugging line to log req.body

        // Check if products are provided
        if (!productIds || !quantities || productIds.length === 0 || quantities.length === 0) {
            throw new Error("No products were added to the order. Please add at least one product.");
        }

        let itemsArray = [];

        for (let i = 0; i < productIds.length; i++) {
            let item = {};
            item.productId = productIds[i];
            item.stockNumber = quantities[i];
            itemsArray.push(item);
        }

        // Use the provided date if available, otherwise default to the current date
        const orderDate = newOrderDate ? new Date(newOrderDate) : new Date();

        // Check if the parsed date is valid
        if (isNaN(orderDate.getTime())) {
            throw new Error("Invalid order date provided.");
        }

        // Create and save the new order
        const newOrder = new Orders({
            orderNumber: newOrderId || "Auto-Generated ID",
            customer: newOrderName || "Unknown Customer",
            orderDate,
            address: newOrderAddress || "No Address Provided",
            status: newOrderStatus || "Pending",
            contact: newOrderContactNumber || "N/A",
            email: newOrderEmail || "N/A",
            totalPrice: parseFloat(totalPrice) || 0,
            items: itemsArray
        });
        await newOrder.save();

        // Subtract stock for each product in the order
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const quantity = parseInt(quantities[i], 10);

            // Find the product and check stock availability
            const product = await Product.findById(productId);
            if (product) {
                if (product.stock >= quantity) {
                    product.stock -= quantity; // Subtract the ordered quantity from stock
                    await product.save(); // Save the updated product stock
                } else {
                    console.error(`Insufficient stock for product ${productId}. Requested: ${quantity}, Available: ${product.stock}`);
                    throw new Error(`Insufficient stock for product ${product.name}.`);
                }
            } else {
                console.error(`Product ${productId} not found.`);
                throw new Error(`Product with ID ${productId} not found.`);
            }
        }

        console.log("Order added:", newOrder);
        res.redirect('/orders');
    } catch (error) {
        console.error("Error adding order:", error);
        // Render a user-friendly error message or redirect with a flash message
        res.status(400).send({ error: error.message }); // Send a meaningful error message
    }
};

const editOrder = async (req, res) => {
    try {
        const { editOrderId, editOrderName, editOrderDate, editOrderAddress, editOrderStatus, editOrderContactNumber, editOrderEmail, editTotalPrice, editProductIds, editQuantities } = req.body;

        console.log("Request body:", req.body); // Debugging line to log req.body

        let itemsArray = [];

        if (editProductIds == null){
            res.redirect('/orders');
        } else {
            for (let i = 0; i < editProductIds.length; i++) {
                let item = {};
                item.productId = editProductIds[i];
                item.stockNumber = editQuantities[i];
                itemsArray.push(item);
            }
    
            // Create the new order data to be updated
            const newOrder = {
                'orderNumber': editOrderId || "Auto-Generated ID",
                'customer': editOrderName || "Unknown Customer",
                'orderDate': editOrderDate,
                'address': editOrderAddress || "No Address Provided",
                'status': editOrderStatus || "Pending",
                'contact': editOrderContactNumber || "N/A",
                'email': editOrderEmail || "N/A",
                'totalPrice': parseFloat(editTotalPrice) || 0,
                'items': itemsArray || []
            };
    
            // Retrieve previous order
            const previousOrder = await Orders.findOne({ 'orderNumber': editOrderId });
            if (!previousOrder) {
                return res.status(404).send("Order not found");
            }
    
            // Get the array of items from the previous order object
            const items = previousOrder.items;
    
            // update all
            for (let i = 0; i < items.length; i++){
                const previousStock = items[i].stockNumber;
                const currentStock =  editQuantities[i];
                
                // get the difference
                const newStock = currentStock - previousStock;
    
                // get product stock
                const product = await Product.findOne({ '_id': editProductIds[i] });
                const productStock = product.stock;
    
                // new product stock
                const newProductStock =  productStock - newStock;
    
                await Product.findOneAndUpdate({ '_id': editProductIds[i] }, { 'stock': newProductStock });
            }
    
    
            // Implies a newly added product
            if (items.length < editProductIds.length) {
                let i = items.length;
    
                for (; i < editProductIds.length; i++) {
                    console.log('subtract quantity product');
                    const product = await Product.findOne({ '_id': editProductIds[i] });
                    
                    // Calculate new stock
                    const newStock = product.stock - editQuantities[i];
    
                    // Update product stock
                    await Product.findOneAndUpdate({ '_id': editProductIds[i] }, { 'stock': newStock });
                }
            }
    
            // Update the order
            await Orders.findOneAndUpdate({ 'orderNumber': editOrderId }, newOrder, { new: true });
    
            res.redirect('/orders');
        }
    } catch (error) {
        console.error("Error editing order:", error);
        res.redirect('/orders');
    }
};


const deleteOrder = async (req, res) => {
    try {
        const { deleteRecordId } = req.body;

        await Orders.findByIdAndDelete(deleteRecordId);

        console.log(req.body);
        res.redirect('/orders');
    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = { 
    handleOrderPageRequest,
    addOrder,
    deleteOrder,
    editOrder
 };