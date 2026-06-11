import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProfileHeader } from "../components/Profile/ProfileHeader";
import { ProfileDetails } from "../components/Profile/ProfileDetails";
import { ProfileStats } from "../components/Profile/ProfileStats";
import {
  updateUserProfile,
  updateUserProfilePicture,
} from "../services/operations/user";
import { setUser } from "../slices/authSlice";

export const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  if (!user) {
    return (
      <div className="flex h-full min-h-[calc(100vh-4rem)] items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  const handleSave = async (usernameToSave, file) => {
    setSaving(true);
    setMessage(null);

    try {
      let updatedUser = { ...user };

      if (file) {
        const pictureResponse = await updateUserProfilePicture(token, file);
        const imageUrl =
          pictureResponse?.data?.imageUrl || pictureResponse?.imageUrl;

        if (!imageUrl) {
          throw new Error("Profile picture upload did not return an image URL");
        }

        updatedUser = {
          ...updatedUser,
          imageUrl,
        };
      }

      if (usernameToSave.trim() !== user.userName) {
        const response = await updateUserProfile(token, {
          userName: usernameToSave.trim(),
        });
        updatedUser = {
          ...response.data,
          playerId: response.data._id,
          imageUrl: updatedUser.imageUrl,
        };
      }

      dispatch(setUser(updatedUser));
      setMessage({ type: "success", text: "Profile updated successfully." });
      return true;
    } catch (error) {
      setMessage({ type: "error", text: "Unable to save profile. Try again." });
      console.error("Profile update failed:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            Profile
          </p>
          <h1 className="text-3xl font-bold text-white">Player Profile</h1>
        </div>
      </div>

      <ProfileHeader user={user} />

      <div className="">
        <ProfileDetails
          user={user}
          onSave={handleSave}
          saving={saving}
          message={message}
        />
        {/* <ProfileStats user={user} /> */}
      </div>
    </div>
  );
};
