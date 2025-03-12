const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Authentication = require('../models/authentication');

router.get("/fecthUserDetails",authenticateToken, async(req, res) => {
    const user = await Authentication.findOne({ emailID: req.user.emailID }).select("-password");

    res.status(200).json({ 
        name: user.name || null,
        username: user.userName || null,
        email: user.emailID,
        phone: user.phoneNumber || null,
    })
})