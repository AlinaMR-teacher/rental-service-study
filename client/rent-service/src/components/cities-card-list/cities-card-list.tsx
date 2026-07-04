import { OffersList } from '../../types/offer';
import { CitiesCard } from '../cities-card/cities-card';
import { BlockName } from '../../const';

type CitiesCardListProps = {
offersList: OffersList[];
onListItemHover?: (offerId: string) => void;
block: string;
};


function CitiesCardList({ block, offersList, onListItemHover }: CitiesCardListProps){
  return(
    <div className={`${block.includes('cities') ? BlockName.AllPagesList : BlockName.NearOfferList} places__list`}>
      {Array.from(offersList, (item) =>
        <CitiesCard key={ item.id } id={ item.id } title={ item.title } type={ item.type } price={ item.price } previewImage={ item.previewImage } isPremium={ item.isPremium } isFavorite={item.isFavorite} rating={ item.rating } block={ block } onListItemHover= { onListItemHover }/>)}
    </div>
  );
}

export { CitiesCardList };
