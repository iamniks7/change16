import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ImageFile } from '../../types';
import { RotatePreview } from './RotatePreview';
import { RotateControls } from './RotateControls';
import { RotateInstructions } from './RotateInstructions';

interface Props {
  image: ImageFile;
  onClose: () => void;
  onApply: (rotatedImage: string, file: File) => void;
}

export function RotateModal({ image, onClose, onApply }: Props) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const handleRotate = (degrees: number) => {
    setRotation((prev) => {
      const newRotation = prev + degrees;
      return newRotation >= 360 ? newRotation - 360 : newRotation < 0 ? newRotation + 360 : newRotation;
    });
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(5, prev + delta)));
  };

  const resetTransforms = () => {
    setRotation(0);
    setZoom(1);
    setFlipX(false);
    setFlipY(false);
  };

  const handleApply = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const radians = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const width = img.width * cos + img.height * sin;
      const height = img.width * sin + img.height * cos;

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, width, height);

        ctx.translate(width / 2, height / 2);
        ctx.rotate(radians);
        ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        const isRightAngleRotation = rotation % 90 === 0;
        const outputFormat = isRightAngleRotation ? image.file.type : 'image/png';
        const fileName = isRightAngleRotation 
          ? image.file.name 
          : image.file.name.replace(/\.[^/.]+$/, '') + '.png';

        const rotatedImage = canvas.toDataURL(outputFormat);
        const rotatedFile = new File(
          [new Blob([new Uint8Array(atob(rotatedImage.split(',')[1]).split('').map(char => char.charCodeAt(0)))])],
          fileName,
          { type: outputFormat }
        );
        
        onApply(rotatedImage, rotatedFile);
      }
    };

    img.src = image.preview;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-xl w-[90vw] max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Rotate Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* <RotateInstructions /> */}

        <RotatePreview
          image={image}
          rotation={rotation}
          zoom={zoom}
          flipX={flipX}
          flipY={flipY}
        />

        <div className="p-4 border-t">
          <RotateControls
            rotation={rotation}
            zoom={zoom}
            flipX={flipX}
            flipY={flipY}
            onRotate={handleRotate}
            onZoom={handleZoom}
            onFlipX={() => setFlipX(!flipX)}
            onFlipY={() => setFlipY(!flipY)}
            onReset={resetTransforms}
          />
  <RotateInstructions />
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Apply Rotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}