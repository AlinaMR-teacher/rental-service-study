import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import * as dotenv from 'dotenv';
import ApiError from '../error/ApiError.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateJwt = (id, email, username, userType, avatar) => {
  return jwt.sign(
    { id, email, username, userType, avatar },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};


export const registration = async (req, res, next) => {
  try {
    const { email, password, userType, username } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'));
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'));
    }

    let avatarImage = '';
    if (req.files?.avatar) {
      const staticPath = path.resolve(__dirname, '..', 'static');
      if (!fs.existsSync(staticPath)) fs.mkdirSync(staticPath);
      const previewFile = req.files.avatar;
      const fileName = `${uuidv4()}.jpg`;
      const uploadPath = path.resolve(staticPath, fileName);
      await previewFile.mv(uploadPath);
      avatarImage = `/static/${fileName}`;
    } else {
      return next(ApiError.badRequest('Фотография аватарки обязательна для загрузки'));
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      userType,
      username,
      avatar: avatarImage,
      password: hashPassword
    });

    const token = generateJwt(user.id, user.email, user.username, user.userType, user.avatar);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatar,
        isPro: user.userType === 'pro'
      }
    });
  } catch (error) {
    next(ApiError.internal('Ошибка регистрации'));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('BODY:', req.body);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(ApiError.internal('Неверный пароль'));
    }

    const token = generateJwt(user.id, user.email, user.username, user.userType, user.avatar);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatar,
        isPro: user.userType === 'pro'
      }
    });
  } catch (error) {
    next(ApiError.internal('Ошибка на сервере: ' + error.message));
  }
};

export const checkAuth = (req, res) => {
  const user = req.user; // уже подставлен через middleware

  // Генерируем новый токен для обновления на фронте
  const token = generateJwt(
    user.id,
    user.email,
    user.username,
    user.userType,
    user.avatar
  );

  return res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    avatar: user.avatar,
    isPro: user.userType === 'pro',
    token
  });
};


