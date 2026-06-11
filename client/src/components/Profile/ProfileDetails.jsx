import { useEffect, useRef, useState } from "react";
import { ImageCropperModal } from "./ImageCropperModal";

export const ProfileDetails = ({ user, onSave, saving, message }) => {
  const usernameRef = useRef(null);
  const fileInputRef = useRef(null);
  const [rawFile, setRawFile] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [croppedFileUrl, setCroppedFileUrl] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [fileError, setFileError] = useState("");

  const previewUrl = croppedFileUrl || user?.imageUrl || "";

  useEffect(() => {
    return () => {
      if (croppedFileUrl) {
        URL.revokeObjectURL(croppedFileUrl);
      }
    };
  }, [croppedFileUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileError("");

    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("Please choose an image under 5MB.");
      event.target.value = "";
      return;
    }

    setRawFile(file);
    setShowCropper(true);
  };

  const handleCropConfirm = (file) => {
    if (croppedFileUrl) {
      URL.revokeObjectURL(croppedFileUrl);
    }
    setCroppedFile(file);
    setCroppedFileUrl(URL.createObjectURL(file));
    setRawFile(null);
    setShowCropper(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropCancel = () => {
    setRawFile(null);
    setShowCropper(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveClick = async () => {
    const newUsername =
      usernameRef.current?.value?.trim() || user?.userName || "";
    const saved = await onSave(newUsername, croppedFile);

    if (!saved || !croppedFile) return;

    setCroppedFile(null);
    if (croppedFileUrl) {
      URL.revokeObjectURL(croppedFileUrl);
      setCroppedFileUrl("");
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-secondary/20 p-6">
      <h2 className="text-xl font-semibold text-white">Profile Details</h2>
      <p className="mt-2 text-sm text-gray-400">
        Email and player ID are read-only fields. Update your username and
        profile image here.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-gray-300">Avatar</label>
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-background/80 p-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-primary/40 bg-primary/10">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {user?.userName?.[0] || "P"}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-3xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  Choose Image
                </button>
                <span className="text-sm text-gray-400">
                  JPEG or PNG, up to 5MB.
                </span>
                {rawFile && (
                  <span className="text-sm text-gray-200">{rawFile.name}</span>
                )}
                {croppedFile && (
                  <span className="text-sm text-emerald-300">
                    Cropped image ready to upload.
                  </span>
                )}
                {fileError && (
                  <span className="text-sm text-rose-300">{fileError}</span>
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-gray-300">
            Player ID
          </label>
          <input
            readOnly
            value={user?.playerId || user?._id || "-"}
            className="rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-gray-300">Email</label>
          <input
            readOnly
            value={user?.email || "-"}
            className="rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-gray-300">
            Username
          </label>
          <input
            ref={usernameRef}
            defaultValue={user?.userName || ""}
            className="rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-gray-300">Role</label>
          <input
            readOnly
            value={user?.role || "user"}
            className="rounded-3xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-emerald-300" : "text-rose-300"}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleSaveClick}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {showCropper && rawFile && (
        <ImageCropperModal
          file={rawFile}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};
