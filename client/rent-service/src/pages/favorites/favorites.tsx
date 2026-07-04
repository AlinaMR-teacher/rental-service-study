import { Helmet } from 'react-helmet-async';
import { Logo } from '../../components/logo/logo';
import { FavoriteCardList } from '../../components/favorite-card-list/favorite-card-list';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { Header } from '../../components/header/header';
import { useAppSelector } from '../../hooks';
import { getFavoriteOffers } from '../../store/offers/offers.selectors';
import { FavoritesEmpty } from './favorites-empty';


function Favorites(){
  const favoritesOffers = useAppSelector(getFavoriteOffers);
  const isEmpty = favoritesOffers.length === 0;
  const cities = favoritesOffers.reduce<string[]>((acc, item) => {
    const cityName = item.city.name;
    if (!acc.includes(cityName)) {
      acc.push(cityName);
    }
    return acc;
  }, []);

  if(isEmpty){
    return <FavoritesEmpty/>;
  }

  return(
    <div className="page">
      <Helmet>
        <title>Избранное</title>
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
      </header>
      <main className="page__main page__main--favorites">
        <FavoriteCardList favoritesOffers={favoritesOffers} cities={cities} />

      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={ AppRoute.Main }>
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>


  );
}

export { Favorites };
