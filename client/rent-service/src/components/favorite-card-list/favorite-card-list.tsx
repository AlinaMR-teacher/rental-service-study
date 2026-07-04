import { FavoriteCard } from '../favorive-card/favorite-card';
import { OffersList } from '../../types/offer';

type FavoriteCardListProps = {
  favoritesOffers: OffersList[];
  cities: string[];
};

function FavoriteCardList ({ favoritesOffers, cities }: FavoriteCardListProps){
  return(
    <main className="page__main page__main--favorites">
      <div className="page__favorites-container container">
        <section className="favorites">
          <h1 className="favorites__title">Saved listing</h1>
          <ul className="favorites__list">
            {cities.map((city, i) => (
              <li className="favorites__locations-items" key={favoritesOffers[i].id}>
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href='#'>
                      <span>{city}</span>
                    </a>
                  </div>
                </div>
                <div className="favorites__places">
                  {favoritesOffers.filter((item) => item.city.name === city).map((item) => (
                    <FavoriteCard key={item.id} id={item.id} title={item.title} type={item.type} price={item.price} previewImage={item.previewImage} isPremium={item.isPremium} isFavorite={item.isFavorite} rating={item.rating} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export { FavoriteCardList };
