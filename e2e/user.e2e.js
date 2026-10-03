const BASE_URL = 'http://localhost:3000'; // Replace with your app's URL

describe('User Flow', () => {
    beforeEach(async () => {
        jest.setTimeout(60000);
        await page.goto(`${BASE_URL}/login`);
      
        
        await page.type('input[name="username"]', 'Charles_Leclerc');
        await page.type('input[name="password"]', 'Ferrari123');
        
        // Click the login button
        await page.click('button[type="submit"]');
        
        // Wait for navigation after login
        await page.waitForNavigation();
        await page.goto(`${BASE_URL}/users`);
        expect(page.url()).toBe(`${BASE_URL}/users`);
    });

    it('EDIT USER : Valid Profile Update', async () => {
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#bio'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#bio', 'I am pogi'); // Type the new value
        await page.click('#submitEdit');
        await page.waitForNavigation();
        expect(page.url()).toBe(`${BASE_URL}/users`);

      });

      it('EDIT USER : Duplicate Username Check', async () => {
        let id = "65e57ac3a149f9de594a9e2c";
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#username'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#username', 'Abstrak_Admin'); // Type the new value
        await page.click('#submitEdit');
        await page.click('.swal2-confirm');
        expect(page.url()).toBe(`${BASE_URL}/users/${id}`);
        
      });

      it('EDIT USER : Password Update with Re-Entry Confirmation', async () => {
        let id = "65e57ac3a149f9de594a9e2c";
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#password'); // Focus on the input field
        await page.type('#oldPassword', 'Ferrari123'); // Type the new value
        await page.type('#newPassword', '123'); // Type the new value
        await page.type('#newPasswordFinal', '123'); // Type the new value
        await page.click('#changePasswordButton');
        await page.click('.swal2-confirm');
        expect(page.url()).toBe(`${BASE_URL}/users/${id}`);
        
      });

      it('EDIT USER : Invalid Email Format', async () => {
        let id = "65e57ac3a149f9de594a9e2c";
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#email'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#email', 'yes'); // Type the new value
        await page.click('#submitEdit');
        await page.click('.swal2-confirm');
        expect(page.url()).toBe(`${BASE_URL}/users/${id}`);
      });


      it('EDIT USER : Alphabetic Check on First Name', async () => {
        let id = "65e57ac3a149f9de594a9e2c";
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#firstname'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#firstname', '1'); // Type the new value
        await page.click('#submitEdit');
        await page.click('.swal2-confirm');
        expect(page.url()).toBe(`${BASE_URL}/users/${id}`);
      });

      it('EDIT USER : Alphabetic Check on Last Name', async () => {
        let id = "65e57ac3a149f9de594a9e2c";
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#lastname'); // Focus on the input field
        await page.keyboard.down('Control'); // Press Control (or Command on Mac)
        await page.keyboard.press('KeyA'); // Select all text
        await page.keyboard.up('Control'); // Release Control
        await page.keyboard.press('Backspace'); // Delete the selected text
        await page.type('#lastname', '1'); // Type the new value
        await page.click('#submitEdit');
        await page.click('.swal2-confirm');
        expect(page.url()).toBe(`${BASE_URL}/users/${id}`);
      });

      it('DELETE USER :  Cancel Account Deletion', async () => {
        let id = "65e57ac3a149f9de594a9e2c";
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#deleteUserBtn');
        await page.click('.swal2-container');
        expect(page.url()).toBe(`${BASE_URL}/users/${id}`);
      });

      it('DELETE USER :  Valid Account Deletion', async () => {
        await page.click('#currUserLink');
        await page.click('#editModeButton');
        await page.click('#deleteUserBtn');
        await page.type('#deleteUsername', 'Charles_Leclerc');
        await page.type('#deletePassword', 'Ferrari123');
        await page.click('.swal2-confirm');
        await page.waitForSelector('.swal2-confirm');
        await page.click('.swal2-confirm');
        expect(page.url()).toBe(`${BASE_URL}/login`);
      });


  });