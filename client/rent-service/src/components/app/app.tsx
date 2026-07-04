import { Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoute } from '../../const';
import { MainPage } from '../../pages/main-page/main-page';
import { Favorites } from '../../pages/favorites/favorites';
import { Login } from '../../pages/login/login';
import { Offer } from '../../pages/offer/offer';
import { PageNotFound } from '../../pages/page-not-found/page-not-found';
import { PrivateRoute } from '../private-route/private-route';
import { useAppSelector } from '../../hooks';
import { LoadingPage } from '../../pages/loading-page/loading-page';
import { ErrorScreen } from '../../pages/error-screen/error-screen';
import { HistoryRouter } from '../history-route/history-route';
import { browserHistory } from '../../browser-history';
import { fetchOffersAction, checkAuthAction } from '../../store/api-actions';
import { useAppDispatch } from '../../hooks';
import { useEffect } from 'react';
import { isOffersDataLoading, getErrorStatus } from '../../store/offers/offers.selectors';
import { getAuthCheckedStatus, getAuthorizationStatus } from '../../store/user-process/user-process.selectors';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOffersAction());
    dispatch(checkAuthAction());
  }, [dispatch]);

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isOffersStatusLoading = useAppSelector(isOffersDataLoading);
  const isAuthChecked = useAppSelector(getAuthCheckedStatus);
  const hasError = useAppSelector(getErrorStatus);

  if (!isAuthChecked || isOffersStatusLoading) {
    return (
      <LoadingPage />
    );
  }

  if (hasError) {
    return (
      <ErrorScreen />);
  }


  return (
    <HelmetProvider>
      <HistoryRouter history={ browserHistory }>
        <Routes>
          <Route
            path={ AppRoute.Main }
            element={<MainPage/>}
          />
          <Route
            path={ AppRoute.Favorites }
            element={
              <PrivateRoute authorizationStatus={ authorizationStatus }>
                <Favorites/>
              </PrivateRoute>
            }
          />
          <Route
            path={ AppRoute.Login }
            element={ <Login /> }
          />
          <Route path={ `${AppRoute.Offer}/:id` } element={ <Offer /> } />
          <Route
            path="*"
            element={ <PageNotFound />}
          />
        </Routes>
      </HistoryRouter>
    </HelmetProvider>

  );
}

export { App };
