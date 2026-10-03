const Product = require('../models/Product');
const ProductCol = require('../models/ProductCol');
const { addProductToCollection } = require('./collectionController');



async function deleteProductById(req, res) {
    try {
        const deleteId = req.query.deleteId || req.body.deleteId;
        if (!deleteId) return res.status(400).send('Delete ID is required');

        const product = await Product.findById(deleteId);
        if (!product) return res.status(404).send('Product not found');

        const associatedCollections = await ProductCol.find({ pieces: deleteId });
        const deleteAssociations = req.query.deleteAssociations === 'true';

        if (associatedCollections.length > 0 && deleteAssociations) {
            await ProductCol.updateMany({ pieces: deleteId }, { $pull: { pieces: deleteId } });
        }
        await Product.findByIdAndDelete(deleteId);
        return res.send(deleteAssociations ? 'Product and associations deleted' : 'Product deleted, associations retained');
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).send('Server error');
    }
}


async function checkName(req, res) {
    const {name, id }= req.body;

    Product.findOne({ name: name }).lean().then(product => {
        console.log(product);

    if(product && product._id != id) {
        res.send({ success: false, message: 'Product name is not available' })
      } else {
        res.send({ success: true, message: 'Product name is available' })
      }
  
     
    }).catch(
        res.status(500).json({ error: 'Internal Server Error' })
    );   

}


async function addProduct (req,res) {
    try {
        const { newProductName, newProductCost,
                 newProductStock, newProductMaterial, newProductColor, 
                 newProductSize, newProductCollection, newProductCategory, newProductStatus } = req.body;
        // newProductCollection = collection id 

        console.log(req.body);

        // parse product material and color
        const materials = newProductMaterial ? newProductMaterial.split(',') : [];
        const colors = newProductColor ? newProductColor.split(',') : [];

        // get the file body request 
        const fileName = req.file ? req.file.originalname : "default-picture.png";

        const variations = new Map([
            ['size', newProductSize],  // Directly set size as an array of strings
            ['color', colors] // Directly set color as an array of strings
        ]);

        // store the file name in the image container
        const imageArray = [fileName]; 

        console.log('varitaions: ', variations);

        const newProduct = new Product({
            name: newProductName,
            status: newProductStatus,
            pictures: imageArray,
            price: newProductCost,
            material: materials,
            variations: variations,
            category: newProductCategory,
            stock: newProductStock
        });

        await newProduct.save();
        addProductToCollection(newProductCollection, newProduct._id);
        res.redirect('/products');

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
} 

async function editProduct(req, res) {
    try {
        const {
            editId,
            editProductName,
            editProductCost,
            editProductStock,
            editProductMaterial,
            editProductColor,
            editProductSize, // This will be an array
            editProductCategory,
            editProductStatus,
            editProductCollection
        } = req.body;

        console.log("This is the editProductsSize", editProductSize);

        const materials = editProductMaterial ? editProductMaterial.split(',') : [];
        const colors = editProductColor ? editProductColor.split(',') : [];
        const fileName = req.file ? req.file.originalname : "default-picture.png";
        const imageArray = fileName === "default-picture.png" ? [] : [fileName]; // Only include image if it's not default

        const variations = new Map([
            ['size', editProductSize],  // Now it's an array of selected sizes
            ['color', colors]
        ]);

        await ProductCol.updateMany(
            { pieces: editId }, // Filter: documents where pieces contain editId
            { $pull: { pieces: editId } } // $pull operator removes editId from the pieces array
        );

        await ProductCol.updateOne(
            { _id: editProductCollection }, // Filter: document with the specified ID
            { $addToSet: { pieces: editId } } // $addToSet adds editId to pieces array only if it's not already present
        );


        // Build the update object
        const updateData = {
            'name': editProductName,
            'status': editProductStatus,
            'stock': editProductStock,
            'price': editProductCost,
            'category': editProductCategory,
            'material': materials,
            'variations': variations
        };

        // Add pictures array only if a new file was uploaded
        if (imageArray.length > 0) {
            updateData.pictures = imageArray;
        }

        const product = await Product.findOneAndUpdate({ '_id': editId }, updateData, { new: true }); // `new: true` returns the updated document

        console.log(product);
        res.redirect('/products');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}



async function fetchSizeStockCost(req, res) {
  const productId = req.params.id;
  console.log("Fetched Product:");
  console.log(productId);
  try {
      const product = await Product.findById(productId).lean();
      console.log(product);
      
      if (!product) {
          return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);  // Send the product data as a JSON response
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching product data" });
  }
}

async function  handleProductPageRequest (req, res) {
    try {
        const products = await Product.find({}).lean(); // Fetch all products from the database
        const collections = await ProductCol.find({}).lean(); //Fetch all collections

        const allProducts = products.map(product => product.category);

        const uniqueCategories = [...new Set(allProducts)]; 

        const allCategoriesArray = uniqueCategories.map(category => ({category}));

        const updatedProducts = products.map(product => {
            // Find all collection IDs and names where product._id is in the collection's pieces array
            const matchingCollectionIds = [];
            const matchingCollectionNames = [];
        
            collections.forEach(collection => {
                if (collection.pieces.some(piece => piece.equals(product._id))) {
                    matchingCollectionIds.push(collection._id);
                    matchingCollectionNames.push(collection.name);
                }
            });
        
            // Return the product with new fields 'collectionIds' and 'collectionNames' if there are matching collections
            return {
                ...product,
                collectionIds: matchingCollectionIds.length > 0 ? matchingCollectionIds : null,
                collectionNames: matchingCollectionNames.length > 0 ? matchingCollectionNames : null,
            };
        });
        
        
        console.log(updatedProducts);
        // Creating the uniqueCategoriesArray
        const uniqueCategoriesArray = Array.from(new Set(updatedProducts.map(product => product.category)))
        .filter(category => category !== undefined); // Filter out undefined values if needed
        const maxPrice = Math.max(...products.map(product => product.price));
            try {
              res.render('products', {
                user: req.session,
                collections,
                allCategoriesArray,
                maxPrice,
                uniqueCategoriesArray,
                updatedProducts,
                layout: 'mainLayout',
                title: 'Products'
              });
            } catch (error) {
              console.error(error);
              res.status(500).send('Internal Server Error');
            }

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

async function fetchCollectionProducts (req,res) {
    const productId = req.params.id;
    try{    
        const collectionProducts = await ProductCol.findById(productId).select('pieces').lean();
        const pieceIds = collectionProducts.pieces.map(piece => piece.toString());
        const collections = await ProductCol.find({}).lean(); //Fetch all collections
        const products = await Product.find({}).lean(); // Fetch all products from the database
        const allProducts = products.map(product => product.category);

        const uniqueCategories = [...new Set(allProducts)]; 

        const allCategoriesArray = uniqueCategories.map(category => ({category}));
        let updatedProducts = []
        for (const pieceId of pieceIds) {
            try {
                console.log('Piece ID:', pieceId);
                const fetchedPiece = await Product.findById(pieceId).lean();
                updatedProducts.push(fetchedPiece);
                
            } catch (err) {
                console.error(`Error fetching piece with ID: ${pieceId}`, err);
            }
        }
        updatedProducts = updatedProducts.map(product => ({
            ...product,
            collectionIds: productId // Adding the productId field to each product
        }));

        // Creating the uniqueCategoriesArray
        const uniqueCategoriesArray = Array.from(new Set(updatedProducts.map(product => product.category)))
        .filter(category => category !== undefined); // Filter out undefined values if needed

        const maxPrice = Math.max(...products.map(product => product.price));
        try {
            res.render('products', {
                user: req.session,
                collections,
                uniqueCategoriesArray,
                allCategoriesArray,
                maxPrice,
                updatedProducts,
                layout: 'mainLayout',
                title: 'Products'
            });
            console.log('Rendered Products');
        } catch(err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    } catch (err){
        console.log(err);
        res.status(500).json({ error: "Error fetching product data" });
    }
}

async function updateProduct(req, res) {
  const productId = req.params.id;

  const { name, price, SKU, material, variations } = req.body;

  const updates = {
        name,
        price,
        SKU,
        material: JSON.parse(material),
        variations: JSON.parse(variations),
    };

    if(req.file) {
        updates.picture = req.file.filename;
    }

  try {
      // Find the product by ID and update its details
      const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

      if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
      }

      res.json(updatedProduct); // Return the updated product
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Error updating product' });
  }
}

// returns an the array of texts

module.exports = {
    deleteProductById,
    checkName,
    fetchSizeStockCost,
    updateProduct,
    addProduct,
    editProduct,
    handleProductPageRequest,
    fetchCollectionProducts
};