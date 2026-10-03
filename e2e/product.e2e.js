// e2e/product.e2e.js

const BASE_URL = 'http://localhost:3000'; // Replace with your app's URL

describe('Product Flow', () => {
    beforeEach(async () => {
        jest.setTimeout(60000);
        await page.goto(`${BASE_URL}/login`);
    
      
      await page.type('input[name="username"]', 'Max_Verstappen');
      await page.type('input[name="password"]', '12345678');
      
      // Click the login button
      await page.click('button[type="submit"]');
      
      // Wait for navigation after login
      await page.waitForNavigation();
      await page.goto(`${BASE_URL}/products`);
      expect(page.url()).toBe(`${BASE_URL}/products`);
    }, );
  
    it('ADD PRODUCT: Valid Product Addition', async () => {
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
    
        // Wait for the modal to appear
        await page.waitForSelector('#productModal', { visible: true });
        
        await page.type('#newProductName', 'TSHIRT');
        await page.type('#newProductCost', '150');
        await page.type('#newProductStock', '5');
        await page.type('#newProductMaterial', 'Cotton');
        await page.type('#newProductColor', 'White,Black');
        await page.click('#extra-small');
        await page.click('#small');
        await page.select('#newProductCollection', '6651ead6a17e4939441ea325');
        await page.select('#newProductCategory', 'Shirt');
        await page.select('#newProductStatus', 'Available');
        const fileInput = await page.$('input[name="imagePath"]');
        // Ensure the file path is relative to the test environment
        await fileInput.uploadFile('./images/tshirt.png'); // Adjust path as necessary
        // Click Confirm to add the collection
        // Set up an alert listener to catch the alert triggered by the form submission
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Product Added.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });

        await page.click('#addModalSubmitBtn');
    });
    
    it('ADD PRODUCT: Invalid Product Cost', async () => {
        
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
    
        // Wait for the modal to appear
        await page.waitForSelector('#productModal', { visible: true });
        
        await page.type('#newProductName', 'TSHIRT');
        await page.type('#newProductCost', 'dsadw');
        await page.type('#newProductStock', '5');
        await page.type('#newProductMaterial', 'Cotton');
        await page.type('#newProductColor', 'White,Black');
        await page.click('#extra-small');
        await page.click('#small');
        await page.select('#newProductCollection', '6651ead6a17e4939441ea325');
        await page.select('#newProductCategory', 'Shirt');
        await page.select('#newProductStatus', 'Available');
        const fileInput = await page.$('input[name="imagePath"]');
        // Ensure the file path is relative to the test environment
        await fileInput.uploadFile('./images/tshirt.png'); // Adjust path as necessary
        // Click Confirm to add the collection
        // Set up an alert listener to catch the alert triggered by the form submission
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Product Cost and Stock should be a valid number.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });

        await page.click('#addModalSubmitBtn');
    });

    it('ADD PRODUCT: Missing Required Fields', async () => {
        
        // Wait for the "Add Collection" button to appear and click it
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
    
        // Wait for the modal to appear
        await page.waitForSelector('#productModal', { visible: true });
        
        // Fill in the "Collection Name"
        await page.type('#newProductName', '');
        await page.type('#newProductCost', '');
        await page.type('#newProductStock', '');
        await page.type('#newProductMaterial', 'Cotton');
        await page.type('#newProductColor', 'White,Black');
        await page.click('#extra-small');
        await page.click('#small');
        await page.select('#newProductCollection', '6651ead6a17e4939441ea325');
        await page.select('#newProductCategory', 'Shirt');
        await page.select('#newProductStatus', 'Available');
        const fileInput = await page.$('input[name="imagePath"]');
        // Ensure the file path is relative to the test environment
        await fileInput.uploadFile('./images/tshirt.png'); // Adjust path as necessary
        // Click Confirm to add the collection
        // Set up an alert listener to catch the alert triggered by the form submission
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Please fill out all fields.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });

        await page.click('#addModalSubmitBtn');
    });

    it('ADD PRODUCT: Exceeding Character Limit', async () => {
        
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
    
        // Wait for the modal to appear
        await page.waitForSelector('#productModal', { visible: true });
        
        await page.type('#newProductName', 'loremipsumdolorsitametconsecteturadipiscingelitpharetranullaaliquetjustosuspendissegravidaodiodawddwa');
        await page.type('#newProductCost', '10');
        await page.type('#newProductStock', '5');
        await page.type('#newProductMaterial', 'Cotton');
        await page.type('#newProductColor', 'White,Black');
        await page.click('#extra-small');
        await page.click('#small');
        await page.select('#newProductCollection', '6651ead6a17e4939441ea325');
        await page.select('#newProductCategory', 'Shirt');
        await page.select('#newProductStatus', 'Available');
        const fileInput = await page.$('input[name="imagePath"]');
        // Ensure the file path is relative to the test environment
        await fileInput.uploadFile('./images/tshirt.png'); // Adjust path as necessary
        // Click Confirm to add the collection
        // Set up an alert listener to catch the alert triggered by the form submission
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Product Name should not include more than 100 characters.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });

        await page.click('#addModalSubmitBtn');
    });

    it('DELETE PRODUCT: Valid Product Deletion', async () => {
        let id = "6651ead6a17e4939441ea32e";

        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);

        await page.click(`#deleteButton${id}`);
        await page.click("#confirmDeleteBtn");

        await page.click('.swal2-confirm');
        const modal = await page.$('#deleteConfirmationModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(true);
    });

    it('DELETE PRODUCT: Cancel Deletion', async () => {
        let id = "6651ead6a17e4939441ea32d";

        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);

        await page.click(`#deleteButton${id}`);
        await page.click("#confirmDeleteBtn");

        await page.click('.swal2-cancel');
        const modal = await page.$(`#product${id}`);
        expect(modal).not.toBeNull();
    });

    it('EDIT PRODUCT: Valid Product Details Edit', async () => {
        let id = "6651ead6a17e4939441ea31c";
    
        await page.click(`#dropdown${id}`);
        await page.click(`#editButton${id}`);
    
        await page.click('#editProductName'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#editProductName', 'Sample'); // Type the new value
        
        await page.click("#editModalSubmitBtn");
        await page.waitForNavigation();
        const modal = await page.$('#editProductModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(true);
    });

    it('EDIT PRODUCT: Invalid Product Name', async () => {
        let id = "6651ead6a17e4939441ea31c";
    
        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);
        await page.click(`#editButton${id}`);
    
        await page.click('#editProductName'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#editProductName', 'loremipsumdolorsitametconsecteturadipiscingelitpharetranullaaliquetjustosuspendissegravidaodiodawddwa'); // Type the new value
        
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Product Name should not include more than 100 characters.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
    });

    it('EDIT PRODUCT: Invalid Quantity', async () => {
        let id = "6651ead6a17e4939441ea31c";
    
        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);
        await page.click(`#editButton${id}`);
    
        await page.click('#editProductStock'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#editProductStock', 'dsad'); // Type the new value
        
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Product Cost and Stock should be a valid number.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
    });

    it('EDIT PRODUCT: Invalid Price', async () => {
        let id = "6651ead6a17e4939441ea31c";
    
        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);
        await page.click(`#editButton${id}`);
    
        await page.click('#editProductCost'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#editProductCost', 'dsad'); // Type the new value
        
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Product Cost and Stock should be a valid number.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
    });

    it('EDIT PRODUCT: Missing Required Fields', async () => {
        let id = "6651ead6a17e4939441ea31c";
    
        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);
        await page.click(`#editButton${id}`);
    
        await page.click('#editProductCost'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Please fill out all fields.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
    });
  });