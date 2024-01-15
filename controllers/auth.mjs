import UserModel from "../models/User.model.mjs";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.mjs";
import UnauthenticatedError from "../errors/unauthenticated.mjs";

export const register = async (req, res) => {
  const user = await UserModel.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("please provide email and password");
  const user = await UserModel.findOne({ email });
  if (!user) throw new UnauthenticatedError("invalid email/password");

  const isMatch = await user.comparePassword(password);

  if (!isMatch) throw new UnauthenticatedError("invalid credentials");
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
