import { NameSpace } from '../../const';
import { State } from '../../types/state';
import { AuthorizationStatusType } from '../../types/authorization-status';
import { AuthorizationStatus } from '../../const';
import { UserData } from '../../types/user-data';


export const getAuthorizationStatus = (state: State): AuthorizationStatusType => state[NameSpace.User].authorizationStatus;
export const getAuthCheckedStatus = (state: State): boolean => state[NameSpace.User].authorizationStatus !== AuthorizationStatus.Unknown;
export const getUserInfo = (state: State): UserData | null => state[NameSpace.User].setUserInfo;
