// e2e/collection.e2e.js

const BASE_URL = 'http://localhost:3000'; // Replace with your app's URL

describe('Collection Flow', () => {
    beforeEach(async () => {
      jest.setTimeout(60000);
      await page.goto(`${BASE_URL}/login`);
      // Wait for the login form elements to be available


      await page.type('input[name="username"]', 'Max_Verstappen');
      await page.type('input[name="password"]', '12345678');
      
      // Click the login button
      await page.click('button[type="submit"]');
      
      // Wait for navigation after login
      await page.waitForNavigation();
      await page.goto(`${BASE_URL}/collections`);
      expect(page.url()).toBe(`${BASE_URL}/collections`);
    });
  
    it('ADD COLLECTION: Valid Collection Addition', async () => {
        // Wait for the "Add Collection" button to appear and click it
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
    
        // Wait for the modal to appear
        await page.waitForSelector('#collectionModal', { visible: true });
        
        // Fill in the "Collection Name"
        await page.type('input[name="newCollectionName"]', 'TEST');
    
        // Select "Men" for the "Collection Category"
        await page.select('select#newCollectionCategory', 'men');
        
        // Upload a "Thumbnail Image"
        const fileInput = await page.$('input[name="imagePath"]');
        // Make sure the file path is relative to the test environment
        await fileInput.uploadFile('./images/checkmark.png'); // Adjust path as necessary
        
        // Set up an alert listener to catch the alert triggered by the form submission
        let alertHandled = false; // Flag to ensure we handle the alert only once
    
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                // Expect the dialog message to be "Please fill out all fields."
                expect(dialog.message()).toBe('Collection Added.');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
        // Click Confirm to add the collection
        await page.click('#addModalSubmitBtn');
    });
    
    it('ADD COLLECTION: Invalid Collection Name', async () => {
        
        // Wait for the "Add Collection" button to appear and click it
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
        
        // Wait for the modal to appear
        await page.waitForSelector('#collectionModal', { visible: true });
        
        // Fill in the "Collection Name" with an empty value
        await page.type('input[name="newCollectionName"]', '');
        
        // Select "Men" for the "Collection Category"
        await page.select('select#newCollectionCategory', 'men');
        
        // Upload a "Thumbnail Image"
        const fileInput = await page.$('input[name="imagePath"]');
        // Ensure the file path is relative to the test environment
        await fileInput.uploadFile('./images/checkmark.png'); // Adjust path as necessary
        
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
    
        // Click Confirm to add the collection
        await page.click('#addModalSubmitBtn');

    });
    
    it('ADD COLLECTION: Missing Required Fields', async () => {
        
        // Wait for the "Add Collection" button to appear and click it
        await page.waitForSelector('#openModalBtn', { visible: true });
        await page.click('#openModalBtn');
        
        // Wait for the modal to appear
        await page.waitForSelector('#collectionModal', { visible: true });
        
        // Fill in the "Collection Name" with a valid value
        await page.type('input[name="newCollectionName"]', 'TEST');
        
        // Select an invalid value for the "Collection Category" to trigger the alert
        await page.select('select#newCollectionCategory', ''); // empty category should trigger alert
        
        // Upload a "Thumbnail Image"
        const fileInput = await page.$('input[name="imagePath"]');
        // Ensure the file path is relative to the test environment
        await fileInput.uploadFile('./images/checkmark.png'); // Adjust path as necessary
        
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
    
        // Click Confirm to add the collection
        await page.click('#addModalSubmitBtn');
        
        // Wait for the modal to still be visible (indicating the form wasn't submitted)
        await page.waitForSelector('#collectionModal', { visible: true });
    });
  
    it('DELETE COLLECTION: Valid Collection Deletion', async () => {
        let id = "6651ead6a17e4939441ea328";

        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);

        await page.click(`#deleteButton${id}`);
        await page.click("#confirmDeleteBtn");

        await page.type('#swal2-input', 'DELETE');
        await page.click('.swal2-confirm');
        const modal = await page.$('#deleteConfirmationModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(true);
    });

    it('DELETE COLLECTION: Cancel Collection Deletion', async () => {
        let id = "6651ead6a17e4939441ea327";

        await page.waitForSelector(`#dropdown${id}`);
        await page.click(`#dropdown${id}`);


        await page.click(`#deleteButton${id}`);
        await page.click("#confirmDeleteBtn");

        await page.click('.swal2-cancel');
        const modal = await page.$('#deleteConfirmationModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(false);
    });
  });


  