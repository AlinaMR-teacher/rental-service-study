import { useState } from 'react';
import { AppRoute, STARTS_COUNT } from '../../const';
import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';
import { BookmarkButton } from '../bookmark-button/bookmark-button';

type CitiesCardProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  isFavorite: boolean;
  previewImage: string;
  rating: number;
  onListItemHover?: (offerId: string) => void;
  block: string;
}

function CitiesCard({ id, title, type, price, previewImage, isPremium, isFavorite, rating, block, onListItemHover }: CitiesCardProps) {
  const [, setOfferId] = useState('');
  const [isFavoriteOffer, setIsFavoriteOffer] = useState(isFavorite);

  const handleButtonClick = () =>{
    setIsFavoriteOffer((prev) => !prev);
  };

  const handleCityCardOver = (event: MouseEvent<HTMLLIElement>) => {
    if (onListItemHover === undefined) {
      return;
    }
    event.preventDefault();
    setOfferId(id);
    onListItemHover(id);
  };

  const handleCityCardOut = (event: MouseEvent<HTMLLIElement>) => {
    if (onListItemHover === undefined) {
      return;
    }
    event.preventDefault();
    setOfferId('');
    onListItemHover('');
  };

  return (
    <article className={`${block}__card place-card`} onMouseOver={ handleCityCardOver } onMouseOut={ handleCityCardOut } >
      { isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>)}
      <div className={`${block}__image-wrapper place-card__image-wrapper`}>
        <Link to={ `${AppRoute.Offer}/${id}` }>
          <img className="place-card__image" src={ previewImage } width="260" height="200" alt="Place image" />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{ price }</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <BookmarkButton block={'place-card'} id={id} isFavorite={isFavoriteOffer} isDetailed = {false} onClick={handleButtonClick}/>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${ Math.round(rating) * 100 / STARTS_COUNT}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${id}`}>{ title }</Link>
        </h2>
        <p className="place-card__type">{ type.charAt(0).toUpperCase() + type.slice(1) }</p>
      </div>
    </article>

  );
}

export { CitiesCard };
