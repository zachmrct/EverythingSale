// const mongoose = require('mongoose');
const User = require('../models/User')
// const bcrypt = require('bcrypt');


async function viewDashboard(req, res) {
    try {
        const otherUsers = await User.find({ _id: { $ne: req.session.userId } }).lean();
        const user = await User.findOne({ _id:  req.session.userId  }).lean();
        //console.log(`other users: ${otherUsers}`);
        res.render('users', { 
            layout: 'mainLayout',
            user: user,
            title: 'Orders',
            otherUsers
        });
} catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
    
}

async function getProfile(req, res) {
    try {
        const usernames = await User.find({}, { username: 1, _id: 0 }).lean();

        let profileId = req.params.id;
        let edit = false;
        // Check if profileId is the same as the session userId
        if (profileId === req.session.userId) {
            edit = true;
        }
    
        const profile = await User.findOne({ _id: profileId }).lean();
        res.render('viewprofile', { 
            layout: 'mainLayout',
            user: req.session,
            title: 'Orders',
            profile,
            edit,
            usernames
        });
    } catch (error) {
        console.log(error);
        res.redirect('/users');
    }
}

async function updateProfile(req,res) {
    try {
        const {username, email, number, bio, firstname, lastname, password} = req.body;
        const userid = req.body.editUserId;
        const now = new Date();
        const currentTime = now.toISOString();

        console.log(req.file == null);
        const updateData = {
            'username' : username,
            'email' : email,
            'password': password,
            'number' : number,
            'bio' : bio,
            'firstName' : firstname,
            'lastName' : lastname,
            'updatedAt' : currentTime
        };
        if (req.file != null){
            updateData.profilePicture = req.file.originalname;
        }

        const updatedUser = await User.findOneAndUpdate({'_id' : userid}, updateData, {new : true});

        console.log(updatedUser);
        req.session.userId = updatedUser._id;
        req.session.username = updatedUser.username;
        if (req.file != null){
            req.session.profilePicture = req.file.originalname;
        } else {
            req.session.profilePicture = null;
        }
        req.session.firstName = updatedUser.firstName;
        req.session.lastName = updatedUser.lastName;
        req.session.email = updatedUser.email;
        req.session.number = updatedUser.number;
        req.session['loggedIn'] = true;
        res.redirect('/users');
    } catch (e) {
        console.log(e);
        res.redirect('/users');
    }
}

async function deleteUser(req, res) {
    try {
        const { username } = req.body; // Only username for now

        if (!username) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }


        // Delete user
        await User.deleteOne({ _id: user._id });

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}



module.exports = {
    viewDashboard,
    getProfile,
    updateProfile,
    deleteUser
}