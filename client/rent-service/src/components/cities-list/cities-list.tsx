import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeCity } from '../../store/offers/offers.slice';
import { AppRoute, CITIES_LOCATION } from '../../const';
import { getActiveCity } from '../../store/offers/offers.selectors';
import { CityOffer } from '../../types/offer';
import { MouseEvent, memo, useCallback } from 'react';


const CitiesList = () => {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(getActiveCity);
  const handleCityClick = useCallback((city: CityOffer) => (evt: MouseEvent<HTMLLIElement>) => {
    evt.preventDefault();
    dispatch(changeCity(city));
  }, [dispatch]);

  return (
    <ul className="locations__list tabs__list">
      {CITIES_LOCATION.map((city) => (
        <li key={city.name} className="locations__item" onClick={handleCityClick(city)}>
          <Link className={`${city.name === selectedCity?.name ? 'tabs__item--active' : 'tabs__item--disable'} locations__item-link tabs__item`} to={AppRoute.Main}>
            <span>{ city.name }</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const CitiesListComponent = memo(CitiesList);
