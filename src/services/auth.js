import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';

const SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: '1h' });

  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return { ...userWithoutPassword, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });

  const { password: _, ...userWithoutPassword } = user.toObject();
  return { ...userWithoutPassword, token };
};


// export const loginUser = async ({ email, password }) => {
//   const user = await User.findOne({ email });
  
//   if (!user) throw createHttpError(401, 'Invalid email or password');

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) throw createHttpError(401, 'Invalid email or password');

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '1d',
//   });

//   user.token = token;
//   await user.save();

//   return {
//     token,
//     user: {
//       name: user.name,
//       email: user.email,
//       _id: user._id
//     }
//   };
// };
