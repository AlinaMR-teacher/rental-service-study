import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute, AuthorizationStatus, BookmarkButtonIconSize } from '../../const';
import { changeFavoritesStatusAction } from '../../store/api-actions';
import { getAuthorizationStatus } from '../../store/user-process/user-process.selectors';


type BookmarkButtonProps = {
  id: string;
  isFavorite?: boolean;
  isDetailed: boolean;
  block: string;
  onClick : () => void;
}

function BookmarkButton({block, id, isFavorite, isDetailed, onClick}: BookmarkButtonProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  const handleBookmarkButtonClick = () => {
    if (authorizationStatus === AuthorizationStatus.NoAuth || authorizationStatus === AuthorizationStatus.Unknown) {
      navigate(AppRoute.Login);
      return;
    }
    onClick();

    const favoriteInfo = {
      id: id,
      isFavorite: !isFavorite,
    };

    dispatch(changeFavoritesStatusAction(favoriteInfo));

  };

  return (
    <button className={`${block}__bookmark-button ${isFavorite ? `${block}__bookmark-button--active` : ''} button`} type="button" onClick={handleBookmarkButtonClick}>
      <svg className={`${block}__bookmark-icon`} width={isDetailed ? BookmarkButtonIconSize.WidthFullOffer : BookmarkButtonIconSize.WidthPlaceCard} height={isDetailed ? BookmarkButtonIconSize.HeightFullOffer : BookmarkButtonIconSize.HeightPlaceCard}>
        <use xlinkHref="#icon-bookmark"></use>
      </svg>
      <span className="visually-hidden">To bookmarks</span>
    </button>
  );
}

export { BookmarkButton };
