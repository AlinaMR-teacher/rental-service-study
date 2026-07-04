import { useAppDispatch } from '../../hooks';
import { fetchOffersAction } from '../../store/api-actions';

function ErrorScreen() {
  const dispatch = useAppDispatch();

  return (
    <>
      <p className="error__text">Не удалось загрузить предложения аренды</p>
      <button
        onClick={() => {
          dispatch(fetchOffersAction());
        }}
        className="replay replay--error"
        type="button"
      >
        Попробовать ещё раз
      </button>
    </>
  );
}

export { ErrorScreen };
