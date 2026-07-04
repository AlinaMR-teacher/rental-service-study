import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, CITIES_LOCATION, SortOffersType } from '../../const';
import { fetchOffersAction, fetchFullOfferAction, fetchNearbyOffersAction, fetchFavoriteOffersAction, changeFavoritesStatusAction } from '../api-actions';
import { OffersProcess } from '../../types/state';
import { getCity, sortOffersByType } from '../../utils';
import { CityOffer } from '../../types/offer';
import { SortOffer } from '../../types/sort';

const defaultCity = getCity('Paris', CITIES_LOCATION);

const initialState : OffersProcess = {
  city: defaultCity,
  offers: [],
  offersDefault: [],
  activeSortOffersType: SortOffersType.Popular,
  fullOffer: null,
  nearbyOffers: [],
  favoriteOffers: [],
  isOffersDataLoading: false,
  isFullOfferDataLoading: false,
  isNearbyOffersLoading: false,
  isFavoriteOffersLoading: false,
  hasError: false,
};

export const offersData = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {
    changeCity(state, action: PayloadAction<CityOffer>) {
      state.city = action.payload;
    },
    sortOffers(state, action: PayloadAction<SortOffer>){
      state.activeSortOffersType = action.payload;
      state.offers = sortOffersByType(state.offers, state.offersDefault, state.activeSortOffersType);
    },
    dropOffer: (state) => {
      state.fullOffer = null;
      state.nearbyOffers = [];
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersDataLoading = true;
        state.hasError = false;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.offersDefault = action.payload;
        state.isOffersDataLoading = false;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersDataLoading = false;
        state.hasError = true;
      })
      .addCase(fetchFullOfferAction.pending, (state) => {
        state.isFullOfferDataLoading = true;
      })
      .addCase(fetchFullOfferAction.fulfilled, (state, action) => {
        state.fullOffer = action.payload;
        state.isFullOfferDataLoading = false;
      })
      .addCase(fetchFullOfferAction.rejected, (state) => {
        state.isFullOfferDataLoading = false;
      })
      .addCase(fetchNearbyOffersAction.pending, (state) => {
        state.isNearbyOffersLoading = true;
      })
      .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
        state.isNearbyOffersLoading = false;
      })
      .addCase(fetchNearbyOffersAction.rejected, (state) => {
        state.isNearbyOffersLoading = false;
      })
      .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
      })
      .addCase(changeFavoritesStatusAction.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          state.favoriteOffers.push(action.payload);
          return;
        }
        state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== action.payload.id);
      });

  },
});

export const { changeCity, sortOffers, dropOffer } = offersData.actions;
