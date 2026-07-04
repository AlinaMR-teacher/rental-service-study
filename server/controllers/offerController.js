import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Offer from "../models/offer.js";
import ApiError from '../error/ApiError.js';
import User from '../models/user.js';
import { Op } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cityCoordinates = {
  Paris: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  Cologne: { latitude: 50.9375, longitude: 6.9603, zoom: 13 },
  Brussels: { latitude: 50.8503, longitude: 4.3517, zoom: 13 },
  Amsterdam: { latitude: 52.3676, longitude: 4.9041, zoom: 13 },
  Hamburg: { latitude: 53.5511, longitude: 9.9937, zoom: 13 },
  Dusseldorf: { latitude: 51.2277, longitude: 6.7735, zoom: 13 }
};

export async function createOffer(req, res, next) {
  try {
    const {
      title, description, publishDate, city,
      isPremium, isFavorite, rating, type, rooms, guests, price,
      features, commentsCount, latitude, longitude, userId
    } = req.body;

    const staticPath = path.resolve(__dirname, '..', 'static');
    if (!fs.existsSync(staticPath)) {
      fs.mkdirSync(staticPath);
    }

    let previewImagePath = '';
    if (req.files?.previewImage) {
      const previewFile = req.files.previewImage;
      const fileName = `${uuidv4()}.jpg`;
      const uploadPath = path.resolve(staticPath, fileName);

      await previewFile.mv(uploadPath);
      previewImagePath = `/static/${fileName}`;
    } else {
      return next(ApiError.badRequest('Превью изображение обязательно для загрузки'));
    }

    let processedPhotos = [];
    if (req.files?.photos) {
      const photoFiles = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

      for (const photo of photoFiles) {
        const photoFileName = `${uuidv4()}.jpg`;
        const photoPath = path.resolve(staticPath, photoFileName);

        await photo.mv(photoPath);
        processedPhotos.push(`/static/${photoFileName}`);
      }
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch (e) {
        parsedFeatures = features.split(',');
      }
    }

    const offer = await Offer.create({
      title,
      description,
      publishDate,
      city,
      previewImage: previewImagePath,
      photos: processedPhotos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features: parsedFeatures,
      commentsCount,
      latitude,
      longitude,
      authorId: userId
    });

    return res.status(201).json(offer);
  } catch (error) {
    next(ApiError.internal('Не удалось добавить предложение: ' + error.message));
  }
}


export async function getAllOffers(req, res, next) {
  const adaptOfferToClient = (offer) => {
    const baseUrl = `${process.env.HOST}:${process.env.PORT || 5000}`;
    let previewImage = offer.previewImage;
    
    const cityLocation = cityCoordinates[offer.city];
    if (previewImage && !previewImage.startsWith('http')) {
      previewImage = `${baseUrl}${previewImage.startsWith('/') ? '' : '/'}${previewImage}`;
    }

    return {
      id: String(offer.id), 
      title: offer.title,
      type: offer.type,
      price: offer.price,
      city: {
        name: offer.city,
        location: cityLocation
      },
      location: offer.latitude && offer.longitude ? {
        latitude: offer.latitude,
        longitude: offer.longitude
      } : { latitude: 0, longitude: 0 },
      isFavorite: offer.isFavorite,
      isPremium: offer.isPremium,
      rating: parseFloat(offer.rating),
      previewImage: previewImage
    };
  };
  
  try {
    const offers = await Offer.findAll();
    const adaptedOffers = offers.map(adaptOfferToClient);
    res.send(adaptedOffers);
  } catch (error) {
    next(ApiError.internal('Не удалось получить список предложений'));
  }
}

const adaptFullOfferToClient = (offer, author) => {
  const baseUrl = `${process.env.HOST}:${process.env.PORT || 5000}`;
  const cityLocation = cityCoordinates[offer.city];
  const prepareUrl = (url) => (url && !url.startsWith('http') ? `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}` : url);

  return {
    id: String(offer.id),
    title: offer.title,
    type: offer.type,
    price: offer.price,
    city: {
      name: offer.city,
      location: cityLocation
    },
    location: offer.latitude && offer.longitude ? {
      latitude: offer.latitude,
      longitude: offer.longitude
    } : { latitude: 0, longitude: 0 },
    isFavorite: offer.isFavorite,
    isPremium: offer.isPremium,
    rating: parseFloat(offer.rating),
    description: offer.description,
    bedrooms: offer.rooms,
    goods: offer.features,
    host: {
      name: author?.name || 'Unknown',
      isPro: author?.isPro || false,
      avatarUrl: prepareUrl(author?.avatarUrl || '')
    },
    images: (offer.photos || []).map(prepareUrl),
    maxAdults: offer.guests
  };
};


export async function getFullOffer(req, res, next) {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: { model: User, as: 'author' }
    });

    if (!offer) {
      return next(ApiError.badRequest('Offer not found'));
    }

    const fullOffer = adaptFullOfferToClient(offer, offer.author);
    res.send(fullOffer);

  } catch (error) {
    console.error(error);
    next(ApiError.internal('Ошибка сервера при получении предложения'));
  }
}

export async function getNearbyOffers(req, res, next) {
  const { id } = req.params;

  try {
    // Находим исходный оффер, чтобы узнать его город
    const currentOffer = await Offer.findByPk(id);

    if (!currentOffer) {
      return next(ApiError.badRequest('Offer not found'));
    }

    // Ищем другие 3 оффера из того же города, исключая текущий по id
    const nearbyOffers = await Offer.findAll({
      where: {
        city: currentOffer.city,
        id: { [Op.ne]: id }  // Исключаем сам оффер
      },
      limit: 3
    });

    // Используем адаптер из getAllOffers, чтобы отдать клиенту ожидаемый формат
    const adaptOfferToClient = (offer) => {
      const baseUrl = `${process.env.HOST}:${process.env.PORT || 5000}`;
      let previewImage = offer.previewImage;

      if (previewImage && !previewImage.startsWith('http')) {
        previewImage = `${baseUrl}${previewImage.startsWith('/') ? '' : '/'}${previewImage}`;
      }

      return {
        id: String(offer.id),
        title: offer.title,
        type: offer.type,
        price: offer.price,
        city: { name: offer.city },
        location: offer.latitude && offer.longitude ? {
          latitude: offer.latitude,
          longitude: offer.longitude
        } : { latitude: 0, longitude: 0 },
        isFavorite: offer.isFavorite,
        isPremium: offer.isPremium,
        rating: parseFloat(offer.rating),
        previewImage: previewImage
      };
    };

    const adaptedOffers = nearbyOffers.map(adaptOfferToClient);
    res.send(adaptedOffers);

  } catch (error) {
    console.error(error);
    next(ApiError.internal('Ошибка сервера при поиске ближайших офферов'));
  }
}


export const toggleFavorite = async (req, res, next) => {
  try {
    const { offerId, status } = req.params;

    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return next(ApiError.notFound('Предложение не найдено'));
    }

    offer.isFavorite = status === '1';
    await offer.save();

    res.json(offer);
  } catch (error) {
    next(ApiError.internal('Ошибка при обновлении статуса избранного'));
  }
};


export const getFavoriteOffers = async (req, res, next) => {
  const adaptOfferToClient = (offer) => {
    const baseUrl = `${process.env.HOST}:${process.env.PORT || 5000}`;
    let previewImage = offer.previewImage;
    

    if (previewImage && !previewImage.startsWith('http')) {
      previewImage = `${baseUrl}${previewImage.startsWith('/') ? '' : '/'}${previewImage}`;
    }

    return {
      id: String(offer.id), 
      title: offer.title,
      type: offer.type,
      price: offer.price,
      city: {
        name: offer.city
      },
      location: offer.latitude && offer.longitude ? {
        latitude: offer.latitude,
        longitude: offer.longitude
      } : { latitude: 0, longitude: 0 },
      isFavorite: offer.isFavorite,
      isPremium: offer.isPremium,
      rating: parseFloat(offer.rating),
      previewImage: previewImage
    };
  };
  
  try {
    const favoriteOffers = await Offer.findAll({
      where: {
        isFavorite: true
      }
    });
    const adaptedOffers = favoriteOffers.map(adaptOfferToClient);
    res.status(200).json(adaptedOffers);
  } catch (error) {
    console.error(error);
    next(ApiError.internal('Ошибка при получении избранных предложений'));
  }
};

