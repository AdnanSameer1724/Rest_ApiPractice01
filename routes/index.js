const express = require('express');
const router = express.Router();
const Authentication = require('../models/authentication');

router.get('/login', getDetails,async (req, res) => {
    res.send(res.user.name)
    // try{
    //     const dataBase = await Authentication.find();
    //     res.send(dataBase);
    // } catch(err){
    //     res.status(500).json({ message: err.message })
    // }
})

router.post('/signup',async (req, res) => {
    const dataBase = new Authentication({
        emailID: req.body.emailID,
        password: req.body.password,
    })
    try{
        const newUser = await dataBase.save()
        res.status(201).json(newUser)
    }catch(err){
        res.status(400).json({ message: err.message })
    }
})


async function getDetails(req, res, next){
    let user
    try{
        user = await Authentication.findById(req.params.id)
        if(user == null){
            return res.status(404).json({ message: "1st message"})
        }
    }catch(err){
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}
module.exports = router;