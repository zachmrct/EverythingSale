// e2e/login.e2e.js

const BASE_URL = 'http://localhost:3000'; // Replace with your app's URL

describe('Login Flow', () => {
  it('should log in with valid credentials', async () => {
    await page.goto(`${BASE_URL}/login`);

    
    // Type in the username and password
    await page.type('input[name="username"]', 'Max_Verstappen');
    await page.type('input[name="password"]', '12345678');
    
    // Click the login button
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForNavigation();
    
    // Optional: Check if redirected to a page (e.g., collections page)
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  it('should toggle password visibility', async () => {
    // Open the login page
    await page.goto(`${BASE_URL}/login`);
  
    // Click the toggle icon to show password
    await page.click('button[type="button"]');
    
    // Wait for the password field to update
    const passwordField = await page.$('input[name="password"]');
    const type = await passwordField.evaluate(el => el.type);
    
    // Check that password field type is now 'text'
    expect(type).toBe('text');
  
    // Click again to hide the password
    await page.click('button[type="button"]');
    
    // Wait for the password field to update again
    const passwordFieldHidden = await page.$('input[name="password"]');
    const typeHidden = await passwordFieldHidden.evaluate(el => el.type);
    
    // Check that password field type is now 'password'
    expect(typeHidden).toBe('password');
  });
  
});