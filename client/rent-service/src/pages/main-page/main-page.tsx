import { useState, useCallback, useMemo} from 'react';
import { Helmet } from 'react-helmet-async';
import { CitiesCardList } from '../../components/cities-card-list/cities-card-list';
import { Logo } from '../../components/logo/logo';
import { OffersList } from '../../types/offer';
import { BlockName } from '../../const';
import { Map } from '../../components/map/map';
import { CitiesListComponent } from '../../components/cities-list/cities-list';
import { useAppSelector } from '../../hooks';
import { getOffersByCity } from '../../utils';
import { SortOptionsComponent } from '../../components/sort-options/sort-options';
import { Header } from '../../components/header/header';
import { getActiveCity, getOffers } from '../../store/offers/offers.selectors';
import { MainPageEmpty } from './main-page-empty';

function MainPage() {
  const selectedCity = useAppSelector(getActiveCity);
  const offersList = useAppSelector(getOffers);
  const selectedCityOffers = useMemo(() => getOffersByCity(selectedCity?.name, offersList), [selectedCity, offersList]);
  const city = selectedCityOffers[0]?.city;
  const rentalOffersCount = useMemo(() => selectedCityOffers.length, [selectedCityOffers]);

  const [selectedOffer, setSelectedOffer] = useState< OffersList | undefined>(
    undefined
  );

  const handleListItemHover = useCallback((offerId: string) => {
    const currentOffer = offersList.find((offer) => offer.id === offerId);

    setSelectedOffer(currentOffer);
  }, [offersList]);

  return (
    <div className="page page--gray page--main">
      <Helmet>
        <title>Шесть городов</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <Header/>
          </div>
        </div>
      </header >
      {selectedCityOffers.length === 0 ? <MainPageEmpty /> :

        <main className="page__main page__main--index">
          <h1 className="visually-hidden">Cities</h1>
          <div className="tabs">
            <section className="locations container">
              <CitiesListComponent />
            </section>
          </div>
          <div className="cities">
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">{rentalOffersCount} {rentalOffersCount > 1 ? 'places' : 'place'} to stay in {selectedCity?.name}</b>
                <SortOptionsComponent />
                <CitiesCardList block={BlockName.AllPages} offersList={selectedCityOffers} onListItemHover={handleListItemHover} />
              </section>
              <div className="cities__right-section">
                <Map block={BlockName.AllPages} city={city} offers={selectedCityOffers} selectedOffer={selectedOffer} />
              </div>
            </div>
          </div>
        </main>}
    </div>

  );
}

export { MainPage };
