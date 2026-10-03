// e2e/product.e2e.js

const BASE_URL = 'http://localhost:3000'; // Replace with your app's URL

describe('Order Flow', () => {
    beforeEach(async () => {
        await page.goto(`${BASE_URL}/login`);
        
        
        await page.type('input[name="username"]', 'Max_Verstappen');
        await page.type('input[name="password"]', '12345678');
        
        // Click the login button
        await page.click('button[type="submit"]');
        
        // Wait for navigation after login
        await page.waitForNavigation();

        await page.goto(`${BASE_URL}/orders`);
        expect(page.url()).toBe(`${BASE_URL}/orders`);
      });

      it('ADD ORDER: Valid Order Recording', async () => {
        await page.waitForSelector('#addOrderButton', { visible: true });
        await page.click('#addOrderButton');
    
        // Wait for the modal to appear
        await page.waitForSelector('#addOrderModal', { visible: true });
        
        await page.type('#newOrderName', 'YUJJJ');
        await page.type('#newOrderDate', '2024-11-16');
        await page.type('#newOrderAddress', 'Barangay Tanod Street');
        await page.select('#newOrderStatus', 'Pending');
        await page.type('#newOrderContactNumber', '09612345678');
        await page.type('#newOrderEmail', 'dsadaw@gmail.com');
        await page.type('#searchInput', 'Denim Jacket');
        await page.keyboard.press('Enter');

        await page.click('#submitAddOrder');
        await page.waitForNavigation();
        const modal = await page.$('#addOrderModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(true);
    });

    it('ADD ORDER: Cancel Order Recording and Error Handling for Missing Fields', async () => {
        await page.waitForSelector('#addOrderButton', { visible: true });
        await page.click('#addOrderButton');
    
        // Wait for the modal to appear
        await page.waitForSelector('#orderModal', { visible: true });
        await page.click('#closeAddOrderModal');
        
        const modal = await page.$('#addOrderModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(true);
    });

    it('EDIT ORDER: Valid Order Details Edit', async () => {
        let id = "6651ead6a17e4939441ea328";
        
        await page.waitForSelector(`#editOrderButton${id}`, { visible: true });
        await page.click(`#editOrderButton${id}`);
    
        // Wait for the modal to appear
        await page.waitForSelector('#editOrderModal', { visible: true });
        await page.click('#editOrderName'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#editOrderName', 'dsad'); // Type the new value
        await page.click('#submitEditOrder');
        
        await page.click('.swal2-confirm');
        await page.waitForNavigation();
        const modal = await page.$('#editOrderModal');
        const isHidden = await modal.evaluate(el => el.classList.contains('hidden'));
        expect(isHidden).toBe(true);
    });

    it('DELETE ORDER: Valid Order Deletion', async () => {
        await page.waitForSelector(`#deleteForm1`);
        await page.click(`#deleteOrder1`);
        await page.click(`.swal2-confirm`);
        await page.waitForNavigation();
        let alertHandled = false; 
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                expect(dialog.message()).toBe('order deleted');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
        expect(page.url()).toBe(`${BASE_URL}/orders`);
    });
    
    it('DELETE ORDER: Error Handling', async () => {
        await page.waitForSelector('#searchOrder');
        await page.click('#searchOrder');
        await page.type('#searchOrder', '3');
        await page.click('.bi-search');
        let alertHandled = false; 
        page.on('dialog', async dialog => {
            if (!alertHandled) {
                expect(dialog.message()).toBe('order does not exist');
                await dialog.accept(); // Close the alert
                alertHandled = true; // Mark the alert as handled
            }
        });
    });

    
});