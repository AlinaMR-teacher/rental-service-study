import { AppRoute, STARTS_COUNT } from '../../const';
import { Link } from 'react-router-dom';
import { BookmarkButton } from '../bookmark-button/bookmark-button';
import { useState } from 'react';

type FavoriteCardProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  isFavorite: boolean;
  previewImage: string;
  rating: number;
}

function FavoriteCard({ id, title, type, price, previewImage, isFavorite, isPremium, rating }:FavoriteCardProps){

  const [isFavoriteOffer, setIsFavoriteOffer] = useState(isFavorite);

  const handleButtonClick = () =>{
    setIsFavoriteOffer((prev) => !prev);
  };
  return(
    <article className="favorites__card place-card">
      { isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>)}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`${AppRoute.Offer}/${id}`}>
          <img className="place-card__image" src={ previewImage } width="150" height="110" alt="Place image" />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{ price }</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <BookmarkButton block={'place-card'} id={id} isFavorite={isFavoriteOffer} isDetailed={false} onClick={handleButtonClick}/>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${Math.round(rating) * 100 / STARTS_COUNT}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <a href="#">{ title }</a>
        </h2>
        <p className="place-card__type">{ type }</p>
      </div>
    </article>
  );
}

export { FavoriteCard };
