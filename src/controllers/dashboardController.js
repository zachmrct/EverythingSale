const Collection = require('../models/ProductCol');
const Product = require('../models/Product');
const Order = require('../models/Order');
const moment = require('moment');
const handleDashboardPageRequest = async (req, res) => {
    try {
        const collections = await Collection.find({}).lean(); // Fetch all collections from the database
        const products = await Product.find({}).lean();
        const orders = await Order.find({}).lean();
        const filteredOrders = orders.filter(
            (order) => order.status !== 'Shipped' && order.status !== 'Paid'
          );
        // Get the current date
        const currDate = new Date();

        // Get the start of the current day (midnight)
        const startOfDay = new Date(currDate);
        startOfDay.setHours(0, 0, 0, 0); // Set time to midnight

        // Get the end of the current day (end of day)
        const endOfDay = new Date(currDate);
        endOfDay.setHours(23, 59, 59, 999); // Set time to the end of the day (just before midnight)

        // Filter orders within the current day
        const dailyOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate); // Assuming each order has an 'orderDate' field
        return orderDate >= startOfDay && orderDate <= endOfDay;
        });

        const numberOfOrdersToday = dailyOrders.length;
        // Get the start of the current week (Monday)
        const startOfWeek = new Date(currDate);
        startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight
        startOfWeek.setDate(currDate.getDate() - currDate.getDay() + 1); // Move to the most recent Monday

        // Get the end of the current week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to Sunday

        // Filter orders within the current week
        const weeklyOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate); // Assuming each order has an 'orderDate' field
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
        });

        const numberOfOrdersThisWeek = weeklyOrders.length;

        // Get the current month and year
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        // Fetch orders from the current month
        const ordersWithinMonth = await Order.find({
            orderDate: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).lean();

        // Create a map to aggregate item quantities
        const itemQuantities = {};

        // Iterate through each order
        for (const order of ordersWithinMonth) {
            for (const item of order.items) {
                const { productId, stockNumber } = item;

                // If the item is already in the map, add to its quantity
                if (itemQuantities[productId]) {
                    itemQuantities[productId] += stockNumber;
                } else {
                    // Otherwise, initialize it
                    itemQuantities[productId] = stockNumber;
                }
            }
        }

        // Find the item with the most buys
        let mostBoughtItem = null;
        let maxQuantity = 0;

        for (const [productId, totalStock] of Object.entries(itemQuantities)) {
            if (totalStock > maxQuantity) {
                maxQuantity = totalStock;
                mostBoughtItem = { productId, totalStock };
            }
        }
        const productDetails = await Product.findOne({ _id: mostBoughtItem.productId });
        const productName = productDetails.name ? productDetails.name : "None";
        const totalCostEarned = productDetails.price * mostBoughtItem.totalStock;
        const productPic = productDetails.pictures[0]? productDetails.pictures[0]: "default-picture.png";
        res.render('dashboard', { 
            layout: 'mainLayout',
            user: req.session,
            products,
            filteredOrders,
            collections,
            productPic,
            productName,
            totalCostEarned,
            numberOfOrdersToday,
            numberOfOrdersThisWeek,
            "grid-add-button": "Collection", 
            "grid-title": "COLLECTIONS",
            dashTextColor: 'text-white',
            orderTextColor: 'text-white',
            prodTextColor: 'text-white',
            collTextColor: 'text-[#F6F296]',
            userTextColor: 'text-white',
            title: 'Collections'
        });
        //console.log("Fetched Collections:",collections);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { handleDashboardPageRequest };