import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Logo } from '../../components/logo/logo';
import { AppRoute } from '../../const';

function PageNotFound() {
  return (
    <div className="page page--gray page--main">
      <header className="header">
        <Helmet>
          <title>Страница не найдена</title>
        </Helmet>
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
          </div>
        </div>
      </header>
      <main className="page__main page__main--index">
        <h1>PAGE NOT FOUND</h1>
        <Link to={ AppRoute.Main }>Перейдите на главную страницу</Link>
      </main>
    </div>

  );
}

export { PageNotFound };
