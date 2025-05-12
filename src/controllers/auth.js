// import { registerUser, loginUser, refreshUser, logoutUser } from '../servises/auth.js';

// const setupSession = (res, session) => {
//   res.cookie('refreshToken', session.refreshToken, {
//     httpOnly: true,
//     expires: session.refreshTokeValidUntil,
//   });
//   res.cookie('sessionId', session._id, {
//     httpOnly: true,
//     expires: session.refreshTokeValidUntil,
//   });
// };

// export const registerController = async (req, res) => {
//   const { name, email } = await registerUser(req.body);
//   res.status(201).json({
//     status: 201,
//     message: 'Successfull register user',
//     data: {
//       name,
//       email,
//     },
//   });
// };

// export const LoginController = async (req, res) => {
//   const session = await loginUser(req.body);
//   setupSession(res, session);
//   res.json({
//     status: 200,
//     message: 'Successfully logged in an user!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };

// export const refreshController = async (req, res) => {
//   const session = await refreshUser(req.cookies);
//   setupSession(res, session);
//   res.json({
//     status: 200,
//     message: 'Successfully refreshed a session!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };

// export const logoutController = async (req, res) => {
//   if (req.cookies.sessionId) {
//     await logoutUser(req.cookies.sessionId);
//   }
//   res.clearCookie('sessionId');
//   res.clearCookie('refreshToken');
//   res.status(204).send();
// };

import {
  loginUser,
  logoutUser,
  refreshUser,
  registerUser,
} from '../services/auth.js';

export const authRegisterController = async (req, res) => {
  const data = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name: data.name,
      email: data.email,
    },
  });
};

export const authLoginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
  const session = await refreshUser(req.cookies);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};