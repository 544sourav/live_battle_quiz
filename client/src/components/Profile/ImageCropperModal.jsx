import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

const CROP_SIZE = 320;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = url;
  });

const getCroppedFile = async (imageSrc, pixelCrop, fileName) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to crop image");
  }

  canvas.width = CROP_SIZE;
  canvas.height = CROP_SIZE;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    CROP_SIZE,
    CROP_SIZE,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to create cropped image"));
        return;
      }

      resolve(new File([blob], fileName, { type: "image/png" }));
    }, "image/png");
  });
};

export const ImageCropperModal = ({ file, onConfirm, onCancel }) => {
  const imageUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || !imageUrl) return;

    setCropping(true);
    setError("");

    try {
      const croppedFile = await getCroppedFile(
        imageUrl,
        croppedAreaPixels,
        file.name,
      );
      onConfirm(croppedFile);
    } catch (cropError) {
      console.error("Image crop failed:", cropError);
      setError("Unable to crop image. Please choose another image.");
    } finally {
      setCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-darkblue p-6 text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Crop profile picture</h2>
              <p className="text-sm text-gray-300">
                Adjust the image so the face area is centered before saving.
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>

          <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4">
            <div className="relative h-80 w-80 overflow-hidden rounded-3xl border border-white/20 bg-slate-950">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="w-full px-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Zoom
              </label>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={cropping}
                className="rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
              >
                {cropping ? "Cropping..." : "Use cropped image"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
