import { getRandomValueFromArray } from '../../utils';
import { CITIES_LOCATION } from '../../const';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { useAppDispatch } from '../../hooks';
import { changeCity } from '../../store/offers/offers.slice';
import { memo } from 'react';

const RandomCity = () => {
  const dispatch = useAppDispatch();
  const randomCity = getRandomValueFromArray(CITIES_LOCATION);

  const handleButtonClick = () => {
    if(randomCity !== undefined){
      dispatch(changeCity(randomCity));
    }
  };

  return (
    <div className="locations__item">
      <Link className="locations__item-link" to={AppRoute.Main} onClick={handleButtonClick}>
        <span>{randomCity.name}</span>
      </Link>
    </div>
  );
};

export const RandomCityButton = memo(RandomCity);
