import { CityOffer, OffersList } from './types/offer';
import { SortOffer } from './types/sort';
import { SortOffersType } from './const';
import { Review } from './types/review';

function getOffersByCity (city: string | undefined, offers: OffersList[]): OffersList[]{
  return offers.filter((offer) => offer.city.name === city);
}

function getCity(selectedCity: string | undefined, cities: CityOffer[]): CityOffer| undefined{
  return cities.find((item) => item.name === selectedCity);
}

function sortOffersByType (offers: OffersList[], offersDefault: OffersList[] ,type: SortOffer): OffersList[] {
  switch (type) {
    case SortOffersType.PriceToHigh:
      return offers.sort((a, b) => a.price - b.price);
    case SortOffersType.PriceToLow:
      return offers.sort((a, b) => b.price - a.price);
    case SortOffersType.TopRated:
      return offers.sort((a, b) => b.rating - a.rating);
    default:
      return offersDefault;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en', options);
}

function getRandomValueFromArray<CityOffer>(array: CityOffer[]): CityOffer {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const MAX_COUNT_LAST_REVIEWS = 10;

export const getReviews = (reviews: readonly Review[]): Review[] => (
  [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_COUNT_LAST_REVIEWS)
);


export { getOffersByCity, getCity, sortOffersByType, formatDate, getRandomValueFromArray };
