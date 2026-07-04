import { createAction } from '@reduxjs/toolkit';
import { AppRouteType } from '../types/approute';


const redirectToRoute = createAction('redirectToRoute',(appRoute: AppRouteType) => ({
  payload: appRoute
}));

export { redirectToRoute };

