// Load environment variables from .env file
require('dotenv').config();
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);


const mongoConnector = require('./src/models/db.js'); 
const router = require('./src/routes/router.js');

//loader functions
const {loadCollections, loadProducts, loadUsers,loadOrders} = require('./src/routes/loader.js');

const app = express();

//session management for login and logout
function initializeSessionManagement(){
    app.use(session({
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        store: new MemoryStore({
          checkPeriod: 86400000 
        }),
        resave: false,
        secret: 'keyboard cat',
        saveUninitialized: true
    }));
}

// Connect to MongoDB
async function connectToDB() {
    try {
        await mongoConnector.connect(); 
        console.log('Connected to DB');
    } catch (error) {
        console.log('Error connecting to DB', error);
    }
}

async function initializeLoad(){
    await loadCollections();
    await loadProducts();
    await loadUsers();
    await loadOrders();
}

function initializeHandlebars() {
    app.engine("hbs", exphbs.engine({
        extname: "hbs",
        defaultLayout: false,
        // helpers:  you can add helpers dito
        helpers: {
            stockStatus: function(stock) {
                if (stock == 0) {
                    return "no";
                } else if (stock <= 3) {
                    return "low";
                } else {
                    return "high";
                }
            },
            formatDate: function(date) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(date).toLocaleDateString(undefined, options);
            },
            first: function(array) {
                return array && array.length > 0 ? array[0] : null;
            },
            limitString: function truncateString(input) {
                if (typeof input !== 'string') return input;
                if (input.length <= 30) return input;
                return input.slice(0, 30) + '...';
            },
            currentDate: function getFormattedDate() {
                const date = new Date();
                const months = [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];
                const weekdays = [
                  "Sunday", "Monday", "Tuesday", "Wednesday", 
                  "Thursday", "Friday", "Saturday"
                ];
                
                const month = months[date.getMonth()];       // Get the month name
                const day = date.getDate();                   // Get the day of the month
                const weekday = weekdays[date.getDay()];      // Get the day of the week
              
                // Return the formatted string
                return `${month} ${day}, ${weekday}`;
              },
            countCollection: function countCollections(collections) {
                return collections.length;
            },
            countStock: function calculateTotalStock(products) {
                return products.reduce((total, products) => total + (products.stock || 0), 0);
            },
            getStatusClass: function getstatusclass(status){
                switch (status) {
                    case 'Pending':
                      return 'bg-yellow-200';
                    case 'Shipped':
                      return 'bg-blue-200';
                    case 'Unpaid':
                      return 'bg-red-200';
                    case 'Paid':
                      return 'bg-green-200';
                    case 'Returned':
                      return 'bg-purple-200';
                    case 'Cancelled':
                      return 'bg-gray-200';
                    default:
                      return 'bg-white';
                  }
            },
            add: function add(a, b){
                return a+b;
            },
            json: function (context){
                return JSON.stringify(context);
            }

        }
    }));
    app.set("view engine", "hbs");
    app.set("views", "./src/views");
}

function initializeStaticFolders() {
    app.use(express.static(path.join('public')));
}

async function main() {
    initializeSessionManagement();
    initializeHandlebars();
    initializeStaticFolders();
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(router);

    await connectToDB();

    // Use fallback port if SERVER_PORT is undefined
    const port = process.env.SERVER_PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    initializeLoad();
}

main();
