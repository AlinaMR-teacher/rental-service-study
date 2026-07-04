import { store } from '../store';
import { AuthorizationStatusType } from './authorization-status.js';
import { CityOffer, FullOffer, OffersList } from '../types/offer';
import { Review } from '../types/review';
import { UserData } from './user-data';
import { SortOffer } from './sort.js';

export type UserProcess = {
  authorizationStatus: AuthorizationStatusType;
  setUserInfo: UserData | null;
};

export type OffersProcess = {
  city: CityOffer | undefined;
  offers: OffersList[];
  offersDefault : OffersList[];
  activeSortOffersType: SortOffer;
  fullOffer: FullOffer | null;
  nearbyOffers: OffersList[];
  favoriteOffers: OffersList[];
  isOffersDataLoading: boolean;
  isFullOfferDataLoading: boolean;
  isNearbyOffersLoading: boolean;
  isFavoriteOffersLoading: boolean;
  hasError: boolean;
}

export type Reviews = {
  reviews: Review[];
  isReviewsDataLoading: boolean;
  displayedComments: Review[];
  isCommentPosting: string;
}

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
