const BASE_URL = import.meta.env.VITE_BASE_URL;

export const userApi = {
  GET_USER_PROFILE_API: `${BASE_URL}/user/profile`,
  UPDATE_USER_PROFILE_API: `${BASE_URL}/user/profile/update`,
  UPDATE_USER_PROFILE_PICTURE_API: `${BASE_URL}/user/profile/picture`,
};

export const matchApi = {
  GET_MATCH_BY_USERID_API: `${BASE_URL}/match/matchhistory`,
  GET_MATCH_DATA_API: `${BASE_URL}/match/getmatch`,
};
