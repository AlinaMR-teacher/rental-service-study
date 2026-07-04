import { Helmet } from 'react-helmet-async';
import { Logo } from '../../components/logo/logo';
import { useParams } from 'react-router-dom';
import { CommentSubmissionForm } from '../../components/comment-submission-form/comment-submission-form';
import { AuthorizationStatus, BlockName, STARTS_COUNT } from '../../const';
import { PageNotFound } from '../page-not-found/page-not-found';
import { ReviewsList } from '../../components/reviews-list/reviews-list';
import { Map } from '../../components/map/map';
import { CitiesCardList } from '../../components/cities-card-list/cities-card-list';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchFullOfferAction, fetchNearbyOffersAction, fetchReviewsAction } from '../../store/api-actions';
import { LoadingPage } from '../loading-page/loading-page.tsx';
import { Header } from '../../components/header/header.tsx';
import { getFullOffer, getNearbyOffers, isFullOfferDataLoading, isNearbyOffersLoading } from '../../store/offers/offers.selectors.ts';
import { getComments, isReviewsStatusLoading } from '../../store/review-data/review-data.selectors.ts';
import { getAuthorizationStatus } from '../../store/user-process/user-process.selectors.ts';
import { BookmarkButton } from '../../components/bookmark-button/bookmark-button.tsx';
import { dropOffer } from '../../store/offers/offers.slice.ts';
import { getReviews } from '../../utils.ts';


function Offer(){

  const currentId = String(useParams().id);
  const dispatch = useAppDispatch();

  const fullOffer = useAppSelector(getFullOffer);
  const isFullOfferLoaded = useAppSelector(isFullOfferDataLoading);

  const comments = useAppSelector(getComments);
  const isReviewsLoaded = useAppSelector(isReviewsStatusLoading);
  const nearbyOffersList = useAppSelector(getNearbyOffers).slice(0, 3);
  const isNearbyOffersLoaded = useAppSelector(isNearbyOffersLoading);
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const [isFavoriteOffer, setIsFavoriteOffer] = useState(fullOffer?.isFavorite);

  useEffect(() => {
    if (currentId) {
      dispatch(fetchFullOfferAction(currentId));
      dispatch(fetchReviewsAction(currentId));
      dispatch(fetchNearbyOffersAction(currentId));
    }

    return () => {
      dispatch(dropOffer());
    };
  }, [dispatch, currentId]);

  if (isFullOfferLoaded || isReviewsLoaded || isNearbyOffersLoaded) {
    return (
      <LoadingPage />
    );
  }

  if (!fullOffer){
    return <PageNotFound/>;
  }
  const handleButtonClick = () =>{
    setIsFavoriteOffer((prev) => !prev);
  };

  return(
    <div className="page">
      <Helmet>
        <title>Предложение по аренде</title>
      </Helmet>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <Header/>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {fullOffer.images.map((item) => (
                <div key={item} className="offer__image-wrapper">
                  <img className="offer__image" src={ item } alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {fullOffer.isPremium ? (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>) : null}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {fullOffer.title}
                </h1>
                <BookmarkButton block={'offer'} id={fullOffer.id} isFavorite={isFavoriteOffer} isDetailed onClick={handleButtonClick}/>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${Math.round(fullOffer.rating) * 100 / STARTS_COUNT}%` }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{ fullOffer.rating }</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {fullOffer.type.charAt(0).toUpperCase() + fullOffer.type.slice(1)}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {fullOffer.bedrooms} {fullOffer.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
                </li>
                <li className="offer__feature offer__feature--adults">
                Max {fullOffer.maxAdults} {fullOffer.maxAdults > 1 ? 'adults' : 'adult'}
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{ fullOffer.price }</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {fullOffer.goods.map((good) => (
                    <li className="offer__inside-item" key={ good }>{ good }</li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper offer__avatar-wrapper${ fullOffer.host.isPro ? '--pro' : ''} user__avatar-wrapper`}>
                    <img className="offer__avatar user__avatar" src={ fullOffer.host.avatarUrl } width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    { fullOffer.host.name }
                  </span>
                  {fullOffer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    { fullOffer.description }
                  </p>
                </div>
              </div>
              <section className="offer__reviews reviews">
                <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{comments.length}</span></h2>
                {comments && <ReviewsList displayedComments={getReviews(comments)}/>}
                {authorizationStatus === AuthorizationStatus.Auth && <CommentSubmissionForm id={currentId} />}
              </section>
            </div>
          </div>
          <Map block={ BlockName.Offer } city={ fullOffer.city } offers={ nearbyOffersList } currentOffer={ fullOffer }/>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <CitiesCardList block={ BlockName.NearOffer } offersList={ nearbyOffersList }/>
          </section>
        </div>
      </main>
    </div>


  );
}


export { Offer };
