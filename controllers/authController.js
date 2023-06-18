import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  const user = await User.create({ name, email, password, lastName });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      name: user.name,
    },
    token,
    phoneNumber: user.phoneNumber,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all the values");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPassword = await user.comparePassword(password);

  if (!isPassword) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  user.password = undefined;

  res
    .status(StatusCodes.OK)
    .json({ user, token, phoneNumber: user.phoneNumber });
};

//UPDATE THE USER
const updateUser = async (req, res) => {
  const { email, name, lastName, phoneNumber } = req.body;
  if (!email || !name || !lastName || !phoneNumber) {
    throw BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.phoneNumber = phoneNumber;

  await user.save();

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user, token, phoneNumber: user.phoneNumber });
};

export { register, login, updateUser };
