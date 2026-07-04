import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/state';
import { FullOffer, OffersList, FavoritesStatusData } from '../types/offer';
import {saveToken, dropToken} from '../services/token';
import { APIRoute } from '../const';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { Review, Comment } from '../types/review';

export const fetchOffersAction = createAsyncThunk<OffersList[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, {extra: api}) => {
    const { data } = await api.get<OffersList[]>(APIRoute.Offers);
    return data;
  },
);


export const fetchFullOfferAction = createAsyncThunk<FullOffer, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/loadFullOffer',
  async (id, {extra: api}) => {
    const { data } = await api.get<FullOffer>(`${APIRoute.Offers}/${id}`);
    return data;
  },
);

export const fetchReviewsAction = createAsyncThunk<Review[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/reviewsList',
  async (id, {extra: api}) => {
    const { data } = await api.get<Review[]>(`${APIRoute.Comments}/${id}`);
    return data;
  },
);

export const fetchNearbyOffersAction = createAsyncThunk<OffersList[], string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/nearbyOffersList',
  async (id, {extra: api}) => {
    const { data } = await api.get<OffersList[]>(`${APIRoute.Offers}/${id}${APIRoute.NeabyOffers}`);
    return data;
  },
);

export const fetchFavoriteOffersAction = createAsyncThunk<OffersList[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/favoriteOffersList',
  async (_arg, {extra: api}) => {
    const { data } = await api.get<OffersList[]>(`${APIRoute.FavoriteOffers}`);
    return data;
  },
);

export const changeFavoritesStatusAction = createAsyncThunk<OffersList, FavoritesStatusData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/changeFavoritesStatus',
  async ({id, isFavorite}, {extra: api}) => {
    const { data } = await api.post<OffersList>(`${APIRoute.FavoriteOffers}/${id}/${Number(isFavorite)}`);
    return data;
  }
);

export const sendCommentAction = createAsyncThunk<Review, Comment, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/sendCommentStatus',
  async ({comment, rating, id}, {extra: api}) => {
    const { data } = await api.post<Review>(`${APIRoute.Comments}/${id}`, {comment, rating});
    return data;
  },
);

export const checkAuthAction = createAsyncThunk<UserData, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {dispatch, extra: api}) => {
    const { data } = await api.get<UserData>(APIRoute.Login);
    dispatch(fetchFavoriteOffersAction());
    return data;
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({login: email, password}, {dispatch, extra: api}) => {
    const { data } = await api.post<UserData>(APIRoute.Login, {email, password});
    saveToken(data.token);
    dispatch(fetchFavoriteOffersAction());
    return data;
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, {extra: api}) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);

