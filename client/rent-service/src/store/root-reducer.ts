import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { offersData } from './offers/offers.slice';
import { reviewsData } from './review-data/review-data.slice';
import { userProcess } from './user-process/user-process.slice';

export const rootReducer = combineReducers({
  [NameSpace.Offers]: offersData.reducer,
  [NameSpace.Review]: reviewsData.reducer,
  [NameSpace.User]: userProcess.reducer,
});
