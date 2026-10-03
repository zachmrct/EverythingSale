const User = require('../models/User');

async function renderSingup (req, res) { 
    try {
        const usernames = await User.find({}, { username: 1, _id: 0 }).lean();

        //console.log(usernames);

        // render the signup function
        req.session.destroy(() => {
            res.render('signup',{
              layout: 'mainLayout',
              title:"signup",
              usernames
            });
        });
    } catch (error) {
        console.error('Error during fetching users:', error);
        return { success: false, message: "Internal Server Error", statusCode: 500 };
    }
};

async function loginUser(req, username, password) {
    try {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.profilePicture = user.profilePicture;
                req.session.firstName = user.firstName;
                req.session.lastName = user.lastName;
                req.session.email = user.email;
                req.session.number = user.number;
                req.session['loggedIn'] = true;
                return { success: true, redirectUrl: "/" }; 
            } else {
                console.log('Password mismatch');
            }
        } else {
            console.log('User not found');
        }
        return { success: false, message: "Incorrect username or password." };
    } catch (error) {
        console.error('Error during login process:', error);
        return { success: false, message: "Internal Server Error", statusCode: 500 };
    }
}

async function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login'); 
    });
}

async function login(req, res) {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);
    const loginResult = await loginUser(req, username, password);

    if (loginResult.success) {
        console.log('Login successful');
        return res.redirect(loginResult.redirectUrl);
    } else {
        console.log(`Login failed: ${loginResult.message}`);
        const redirectUrl = loginResult.statusCode === 500 ? '/error' : `/login?loadError=true`;
        return res.redirect(redirectUrl);
    }
}
async function signup(req, res){
    try {
        const { firstname, lastname, email, username, password, number } = req.body;

        // Log the attempt
        console.log(`Signup attempt for name: ${firstname} ${lastname}`);

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.redirect('/signup');
            return
        }

        // Check if the email is already registered
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.redirect('/signup');
            return
        }

        // Create a new user
        const newUser = new User({
            firstName: firstname,
            lastName: lastname,
            email,
            username,
            password: password,
            number
        });

        // Save the user to the database
        await newUser.save();

        // Send a success response
        res.redirect('/login');
    } catch (error) {
        // Handle errors
        console.error("Error during signup:", error);
        res.status(500).json({ message: "An error occurred during signup." });
    }
}
module.exports = { login, logout,signup, renderSingup };
