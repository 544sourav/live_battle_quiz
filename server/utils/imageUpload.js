import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (file, folder, quality) => {
  const options = {
    folder,
    resource_type: "auto",
    ...(quality && { quality }),
  };

  return cloudinary.uploader.upload(file.tempFilePath, options);
};
