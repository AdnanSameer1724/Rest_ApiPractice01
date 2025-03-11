const express = require('express');
const router = express.Router();
const Authentication = require('../models/authentication');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
    res.json({ message: "Welcome to API"});
});

router.post ('/login', async (req, res) => {
    try{
        const { emailID, password } = req.body;

        const user = await Authentication.findOne({ emailID }); 
        if(!user){
            return res.status(400).json({ message: 'Invalid Username' });
        }
        

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ emailID: user.emailID }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successfull', token})
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
});
  
router.post('/signup', async (req, res) => {
    try{
        const { emailID, password } = req.body;

        const existingUser = await Authentication.findOne({ emailID });
        if(existingUser){
            return res.status(400).json({ message: 'Account already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Authentication({
            emailID,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    }catch(err){
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

module.exports = router;