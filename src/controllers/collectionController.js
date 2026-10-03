const Collection = require('../models/ProductCol');
const Product = require('../models/Product');

const handleCollectionPageRequest = async (req, res) => {
    try {
        const collections = await Collection.find({}).lean(); // Fetch all collections from the database
        res.render('collections', { 
            layout: 'mainLayout',
            user: req.session,
            collections,  // Pass collections to the view
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

async function addProductToCollection(collectionId, productId) {
    try {
        const collection = await Collection.findById(collectionId);
        
        if (!collection.pieces.includes(productId)) {
            collection.pieces.push(productId);
            await collection.save();  
        }
    } catch (err) {
        console.error("Error adding product to collection: " + err);
    }
}

async function checkCollectionName(req, res) {
    try {
        const { name } = req.body;  // Destructure name from the request body

        const collection = await Collection.findOne({ name }).lean();  // Find the collection by name

        if (collection) {
            res.send({ success: false, message: 'Collection name is not available' });
        } else {
            res.send({ success: true, message: 'Collection name is available' });
        }
    } catch (err) {
        console.error("Error checking collection name:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function handleCollectionProductsRequest(req, res) {
    try {
        const collection = await Collection.findById(req.params.id).populate('pieces').lean();

        if (!collection) {
            return res.status(404).send("Collection not found");
        }
        const products = collection.pieces;
        console.log("Fetched products:",products);
        
        products.forEach(product => {
            if (product.variations && Array.isArray(product.variations)) {
                product.totalStock = product.variations.reduce((acc, variation) => acc + (variation.stocks || 0), 0);
            } else {
                product.totalStock = 0;  
            }
        });

        res.render("collectionProducts", {
            user: req.session,
            products, 
            "grid-add-button": "Product", 
            "grid-title": collection.name, 
            "collectionId": collection._id 
        });
    } catch (err) {
        console.error("Error fetching collection products:", err);
        res.status(500).send("Internal Server Error");
    }
}


async function addCollection (req, res) {
    try {
        const {newCollectionName, newCollectionCategory} = req.body;


        console.log('Request Body:', req.body);

        const fileName = req.file ? req.file.originalname : "default-picture.png";
        console.log(fileName)

        const newCollection = new Collection({
            name: newCollectionName,
            collectionPicture: fileName,
            category: newCollectionCategory,
            pieces:[]
        });
        await newCollection.save();

        res.redirect('/collections');

    } catch (err) { //error

        console.log('Error: ', err);
        res.redirect('/collections');
    }
}

async function editCollection (req,res) {
    try {
        const {editCollectionId, editCollectionName, editCollectionCategory} = req.body;
        console.log(req.body);
        const fileName = req.file ? req.file.originalname : "default-picture.png";
        const imageArray = fileName === "default-picture.png" ? null : fileName; // Only include image if it's not default
        const updateData = {
            'name': editCollectionName,
            'category': editCollectionCategory,
        };
        // Add pictures array only if a new file was uploaded
        if (imageArray != null) {
            updateData.collectionPicture = imageArray;
        }
        const collections = await Collection.findOneAndUpdate({'_id' : editCollectionId}, updateData, { new: true }); // Fetch all collections from the database
        console.log(collections);

        res.redirect('/collections');
    } catch (err) {
        console.log('Error: ', err);
    }  
}
async function deleteCollection(req, res) {
    try {
        console.log("Request Body:", req.body);  // Log the incoming request body for debugging

        const { collectionId } = req.body;
        const collection = await Collection.findById(collectionId);

        if (!collection) {
            return res.status(404).send("Collection not found");
        }

        await Product.deleteMany({ _id: { $in: collection.pieces } });
        await Collection.findByIdAndDelete(collectionId);

        res.send({ success: true, message: 'Collection deleted successfully' });
    } catch (err) {
        console.error("Error deleting collection: ", err);
        res.status(500).send("Internal Server Error");
    }
}



module.exports = {  
    //add niyo dito yung mga async functions niyo to be exported
    addCollection,
    editCollection,
    handleCollectionPageRequest,
    addProductToCollection,
    checkCollectionName,
    handleCollectionProductsRequest,
    deleteCollection
};