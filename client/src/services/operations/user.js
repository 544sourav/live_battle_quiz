import { apiConnector } from "../apiConnector";
import { userApi } from "../apis";
const {
  GET_USER_PROFILE_API,
  UPDATE_USER_PROFILE_API,
  UPDATE_USER_PROFILE_PICTURE_API,
} = userApi;

export const getUserProfile = async (token) => {
  try {
    const response = await apiConnector("GET", GET_USER_PROFILE_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (token, userData) => {
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_USER_PROFILE_API,
      userData,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const updateUserProfilePicture = async (token, file) => {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("profilePicture", file);
    const response = await apiConnector(
      "PUT",
      UPDATE_USER_PROFILE_PICTURE_API,
      bodyFormData,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};
// export const updateUserProfile = async (token, userData) => {
//   try {
//     const response = await apiConnector(
//       "PUT",
//       UPDATE_USER_PROFILE_API,
//       userData,
//       {
//         Authorization: `Bearer ${token}`,
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     throw error;
//   }
// };
