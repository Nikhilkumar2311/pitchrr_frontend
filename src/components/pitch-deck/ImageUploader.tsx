import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Move } from 'lucide-react';

interface ImageUploaderProps {
    image?: string;
    onImageChange: (image: string | undefined) => void;
    className?: string;
}

export function ImageUploader({ image, onImageChange, className = '' }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isRepositioning, setIsRepositioning] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, []);

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Max 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be smaller than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            // Compress if needed
            compressImage(result, (compressed) => {
                onImageChange(compressed);
            });
        };
        reader.readAsDataURL(file);
    };

    const compressImage = (dataUrl: string, callback: (result: string) => void) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 800;
            let { width, height } = img;

            if (width > maxSize || height > maxSize) {
                if (width > height) {
                    height = (height / width) * maxSize;
                    width = maxSize;
                } else {
                    width = (width / height) * maxSize;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = dataUrl;
    };

    const handleRepositionDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isRepositioning) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        setImagePosition({ x, y });
    };

    if (image) {
        return (
            <div className={`relative rounded-lg overflow-hidden ${className}`}>
                <div
                    className="relative w-full h-32 cursor-move"
                    onMouseMove={handleRepositionDrag}
                    onMouseDown={() => setIsRepositioning(true)}
                    onMouseUp={() => setIsRepositioning(false)}
                    onMouseLeave={() => setIsRepositioning(false)}
                >
                    <img
                        src={image}
                        alt="Slide image"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: `${imagePosition.x}% ${imagePosition.y}%` }}
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                        <Move className="w-6 h-6 text-white" />
                    </div>
                </div>
                <button
                    onClick={() => onImageChange(undefined)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg"
                    title="Remove image"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            className={`
                relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer
                ${isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
                ${className}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('image-upload-input')?.click()}
        >
            <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            <div className="flex flex-col items-center gap-2 text-gray-500">
                {isDragging ? (
                    <>
                        <Upload className="w-8 h-8 text-blue-500" />
                        <span className="text-sm text-blue-600">Drop image here</span>
                    </>
                ) : (
                    <>
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-sm">Drag & drop or click to upload</span>
                        <span className="text-xs text-gray-400">Max 2MB</span>
                    </>
                )}
            </div>
        </div>
    );
}
