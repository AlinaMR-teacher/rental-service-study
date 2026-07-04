import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DISPLAYED_COMMENTS, NameSpace, Status } from '../../const';
import { fetchReviewsAction, sendCommentAction } from '../api-actions';
import { Reviews } from '../../types/state';

const initialState: Reviews = {
  reviews: [],
  isReviewsDataLoading: false,
  displayedComments: [],
  isCommentPosting: Status.Idle,
};

export const reviewsData = createSlice({
  name: NameSpace.Review,
  initialState,
  reducers: {
    setCommentPostStatus: (state, action: PayloadAction<string>) => {
      state.isCommentPosting = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReviewsAction.pending, (state) => {
        state.isReviewsDataLoading = true;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.displayedComments = state.reviews.slice(0, DISPLAYED_COMMENTS).reverse();
        state.isReviewsDataLoading = false;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.isReviewsDataLoading = false;
      })
      .addCase(sendCommentAction.fulfilled, (state, action) => {
        state.isCommentPosting = Status.Success;
        state.reviews.unshift(action.payload);
      });
  }
});

export const { setCommentPostStatus } = reviewsData.actions;
