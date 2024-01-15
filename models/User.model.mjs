import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "please provide a valid email id",
    ],
    unique: true,
  },
  mobile: {
    type: String,
    required: [true, "please provide mobile"],
    minlength: 10,
    maxlength: 10,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePassword = async function (upassword) {
  const isMatch = await bcrypt.compare(upassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
