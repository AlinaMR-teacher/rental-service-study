import { CityOffer } from './types/offer';

const AppRoute = {
  Main : '/',
  Login : '/login',
  Favorites : '/favorites',
  Offer : '/offer',
} as const;


const AuthorizationStatus = {
  Auth : 'AUTH',
  NoAuth : 'NO_AUTH',
  Unknown : 'UNKNOWN',
} as const;

const BlockName = {
  AllPages: 'cities',
  AllPagesList: 'cities__places-list',
  Offer: 'offer',
  NearOfferList: 'near-places__list',
  NearOffer: 'near-places',
} as const;

const STARTS_COUNT = 5;

const MIN_COMMENT_LENGTH = 50;

const MAX_COMMENT_LENGTH = 300;

const MIN_RATING = 0;

const MAX_RATING = 5;

const DISPLAYED_COMMENTS = 10;

const CITIES_LOCATION : CityOffer[] = [
  {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13
    }
  },
  {
    name: 'Cologne',
    location: {
      latitude: 50.938361,
      longitude: 6.959974,
      zoom: 13
    }
  },
  {
    name: 'Brussels',
    location: {
      latitude: 50.846557,
      longitude: 4.351697,
      zoom: 13
    }
  },
  {
    name: 'Amsterdam',
    location: {
      latitude: 52.37454,
      longitude: 4.897976,
      zoom: 13
    }
  },
  {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654,
      zoom: 13
    }
  },
  {
    name: 'Dusseldorf',
    location: {
      latitude: 51.225402,
      longitude: 6.776314,
      zoom: 13
    }
  },
];

const SortOffersType = {
  Popular : 'Popular',
  PriceToHigh : 'Price: low to high',
  PriceToLow : 'Price: high to low',
  TopRated : 'Top rated first',
};

const APIRoute = {
  Offers : '/offers',
  Login : '/login',
  Logout : '/logout',
  Comments: '/comments',
  NeabyOffers: '/nearby',
  FavoriteOffers: '/favorite',
} as const;

const NameSpace = {
  User: 'USER',
  Offers: 'OFFERS',
  Review: 'REVIEW'
} as const;

const Status = {
  Idle : 'idle',
  Loading : 'loading',
  Success : 'success',
  Error : 'error'
} as const;

const BookmarkButtonIconSize = {
  WidthFullOffer : 31,
  WidthPlaceCard : 18,
  HeightFullOffer : 33,
  HeightPlaceCard : 19,
} as const;

const URL_MARKER_DEFAULT = 'img/pin.svg';

const URL_MARKER_CURRENT = 'img/pin-active.svg';

export { AppRoute, AuthorizationStatus, URL_MARKER_DEFAULT, URL_MARKER_CURRENT, BlockName, STARTS_COUNT, CITIES_LOCATION, SortOffersType, APIRoute, MIN_COMMENT_LENGTH, MAX_COMMENT_LENGTH, MIN_RATING, MAX_RATING, NameSpace, DISPLAYED_COMMENTS, Status, BookmarkButtonIconSize };

