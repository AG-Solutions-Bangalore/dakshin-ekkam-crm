import Cropper from "react-easy-crop";
import { useState, useCallback, useEffect } from "react";
import getCroppedImg from "./cropImageUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonConfig } from "@/config/ButtonConfig";

const CropImageModal = ({
  open,
  imageSrc,
  onCancel,
  onCropComplete,
  title = "Crop Image",
  maxCropSize = { width: 300, height: 300 },
  cropstucture = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const onCropAreaComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImageSize({ width: img.width, height: img.height });
  }, [imageSrc]);

  const cropSize = {
    width: Math.min(maxCropSize.width, imageSize.width),
    height: Math.min(maxCropSize.height, imageSize.height),
  };

  const aspectRatio =
    cropSize.width && cropSize.height
      ? cropSize.width / cropSize.height
      : 4 / 5;

  const handleOk = async () => {
    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      cropSize,
      cropstucture
    );
    onCropComplete(croppedImage);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="w-full max-w-xs sm:max-w-md lg:max-w-[800px] h-auto"
        aria-describedby={null}
      >
        <DialogHeader>
          <DialogTitle>{title || ""}</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 bg-black h-[64vh]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            cropSize={cropSize}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropAreaComplete}
            style={{
              containerStyle: { width: "100%", height: "100%" },
              mediaStyle: { objectFit: "contain" },
            }}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleOk}
            className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
          >
            Crop & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageModal;
