import React, { useRef, useState } from 'react';
import { PRESET_ARTWORKS } from '../data/canvasPresets';
import { Upload, Image as ImageIcon, Check, X, Sparkles, AlertCircle } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, name: string, dimensions?: { width: number; height: number }) => void;
  currentImage: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor, selecciona un archivo de imagen válido (JPEG, PNG, WebP).');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Preload image to get real dimensions
      const img = new Image();
      img.onload = () => {
        onSelectImage(result, file.name, { width: img.naturalWidth, height: img.naturalHeight });
        onClose();
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Seleccionar o Subir Fotografía
            </h3>
            <p className="text-xs text-neutral-500">
              Sube tus fotos familiares, recuerdos de viaje o elige una obra de la galería
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#e60067] bg-rose-50/70 scale-[0.99]'
                : 'border-neutral-300 hover:border-[#e60067] hover:bg-neutral-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="w-12 h-12 rounded-full bg-rose-100/70 text-[#e60067] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <p className="text-sm font-bold text-neutral-900">
              Haz clic para subir desde tu dispositivo o arrastra aquí tu foto
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Compatible con JPG, PNG, WebP (Se recomiendan imágenes de al menos 2000px de resolución)
            </p>

            {uploadError && (
              <div className="mt-3 text-xs text-rose-600 flex items-center justify-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Curated Gallery Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Colección de Obras & Fotos de Muestra
              </h4>
              <span className="text-[11px] text-neutral-500">Alta resolución garantizada</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PRESET_ARTWORKS.map((art) => {
                const isCurrent = currentImage === art.url;
                return (
                  <button
                    key={art.id}
                    onClick={() => {
                      onSelectImage(art.url, art.title, { width: 3600, height: 4800 });
                      onClose();
                    }}
                    className={`group relative rounded-xl overflow-hidden border text-left transition-all ${
                      isCurrent
                        ? 'border-[#e60067] ring-2 ring-[#e60067]/40 shadow-md'
                        : 'border-neutral-200 hover:border-neutral-400 shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200 relative">
                      <img
                        src={art.url}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isCurrent && (
                        <div className="absolute top-2 right-2 bg-[#e60067] text-white p-1 rounded-full shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white">
                      <p className="text-xs font-bold text-neutral-900 truncate">{art.title}</p>
                      <p className="text-[10px] text-neutral-500">{art.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-lg text-xs font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
