import { NameSpace } from '../../const';
import { Review } from '../../types/review';
import { State } from '../../types/state';

export const getReviewsCount = (state: State): number => state[NameSpace.Review].reviews.length;
export const getComments = (state: State): Review[] => state[NameSpace.Review].reviews;
export const isReviewsStatusLoading = (state: State): boolean => state[NameSpace.Review].isReviewsDataLoading;
export const getCommentPostStatus = (state: State): string => state[NameSpace.Review].isCommentPosting;
