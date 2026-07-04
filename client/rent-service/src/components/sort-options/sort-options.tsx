import { SortOffersType } from '../../const';
import { useState, KeyboardEvent, memo } from 'react';
import classNames from 'classnames';
import { SortOffer } from '../../types/sort';
import { useAppSelector } from '../../hooks';
import { getActiveSortOffersType } from '../../store/offers/offers.selectors';
import { useAppDispatch } from '../../hooks';
import { sortOffers } from '../../store/offers/offers.slice';


const SortOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const activeSorting = useAppSelector(getActiveSortOffersType);
  const dispatch = useAppDispatch();

  const iconStyle = {
    transform: `translateY(-50%) ${ isOpen ? 'rotate(180deg)' : '' }`
  };

  function keyDownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && isOpen) {
      evt.preventDefault();
      setIsOpen(false);
    }
  }

  function typeClickHandler() {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }

  function sortingItemClickHandler (type: SortOffer) {
    dispatch(sortOffers(type));
    setIsOpen(false);
  }

  return(
    <form className="places__sorting" action="#" method="get" onKeyDown={ keyDownHandler }>
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0} onClick={ typeClickHandler }>
        { activeSorting }
        <svg className="places__sorting-arrow" width={7} height={4} style={ iconStyle }>
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={ classNames({'places__options--opened' : isOpen }, 'places__options', 'places__options--custom')}>
        { Object.values(SortOffersType).map((type) => (
          <li key={type} className={classNames({'places__option--active': type === activeSorting }, 'places__option')} tabIndex={0} onClick={() => sortingItemClickHandler(type)}>
            { type };
          </li>
        ))}
      </ul>
    </form>

  );
};

export const SortOptionsComponent = memo(SortOptions);
