require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateUserName = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let userName = "";

    for(let i = 0; i < 5; i++){
        userName = chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return userName;
};

const userSchema = new mongoose.Schema({
  emailID: { type: String, required: true, unique: true, },
  password: { type: String, required: true, },
  name: { type: String, required: true, },
  userName: { type: String, required: true, unique: true, default: generateUserName},
  phoneNumber: { type: Number, required: true, },
  address: { type: String, required: true, },
  token: { type: String },
}); 

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, emailID: this.emailID },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  this.token = token;
  return token;
};

module.exports = mongoose.model("Authentication", userSchema);