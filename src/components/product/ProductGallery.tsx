'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || '');

  return (
    <div className="space-y-4">
      {/* Main Image Viewer */}
      <div className="relative aspect-square w-full rounded-2xl bg-secondary/50 border border-border overflow-hidden">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center filter brightness-95"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeImage === img
                  ? 'border-brand-lime shadow-md shadow-brand-lime/20 scale-105'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <Image
                src={img}
                alt={`${title} - view ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
