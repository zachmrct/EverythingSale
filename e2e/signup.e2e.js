const BASE_URL = 'http://localhost:3000'; // Replace with your app's URL

describe('Sign Up Flow', () => {
    it('SIGN UP : Valid User Addition', async () => {
      jest.setTimeout(60000);
      await page.goto(`${BASE_URL}/signup`);
  
      

      await page.type('#firstname', 'Lance');
      await page.type('#lastname', 'Colorina');
      await page.type('#email', 'dsad@gmail.com');
      await page.type('#number', '1234567430');
      await page.type('#username', 'YUJJJ');
      await page.type('#password', '1234');
      

      await page.click('button[type="submit"]');
      

      await page.waitForNavigation();
      

      expect(page.url()).toBe(`${BASE_URL}/login`);
    });

    it('SIGN UP : Existing Email Address', async () => {
        await page.goto(`${BASE_URL}/signup`);

        await page.type('#firstname', 'new');
        await page.type('#lastname', 'user');
        await page.type('#email', 'admin@gmail.com');
        await page.type('#number', '1234567430');
        await page.type('#username', 'yes');
        await page.type('#password', '1234');
        

        await page.click('button[type="submit"]');
        

        expect(page.url()).toBe(`${BASE_URL}/signup`);
      });

      it('SIGN UP : Existing Username', async () => {
        await page.goto(`${BASE_URL}/signup`);

        await page.type('#firstname', 'new');
        await page.type('#lastname', 'user');
        await page.type('#email', 'new@gmail.com');
        await page.type('#number', '1234567430');
        await page.type('#username', 'Abstrak_Admin');
        await page.type('#password', '1234');

        await page.click('button[type="submit"]');
        

        expect(page.url()).toBe(`${BASE_URL}/signup`);
      });

      it('SIGN UP : Missing Required Fields', async () => {
        await page.goto(`${BASE_URL}/signup`);
    
        

        await page.type('#firstname', '');
        await page.type('#lastname', 'Colorina');
        await page.type('#email', 'new@gmail.com');
        await page.type('#number', '1234567430');
        await page.type('#username', 'Max_Verstappen');
        await page.type('#password', '1234');

        await page.click('button[type="submit"]');
        expect(page.url()).toBe(`${BASE_URL}/signup`);
      });
  });