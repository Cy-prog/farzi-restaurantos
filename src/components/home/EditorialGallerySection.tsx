import React from 'react';
import { ArrowUpRight, Expand } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GalleryImage } from '../../types';

interface EditorialGallerySectionProps {
  images: GalleryImage[];
  onOpenLightbox: (index: number) => void;
}

export const fallbackGalleryImages: GalleryImage[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=85&w=1500&auto=format&fit=crop', title: 'An evening at Farzi', categoryName: 'The dining room', description: 'A warm welcome, always.', isVideo: false, displayOrder: 1 },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=85&w=1200&auto=format&fit=crop', title: 'Made to be shared', categoryName: 'From the kitchen', description: 'A new take on a familiar favourite.', isVideo: false, displayOrder: 2 },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=85&w=1200&auto=format&fit=crop', title: 'A little theatre', categoryName: 'At the table', description: 'The best part is the first bite.', isVideo: false, displayOrder: 3 },
];

export const EditorialGallerySection: React.FC<EditorialGallerySectionProps> = ({ images, onOpenLightbox }) => {
  const displayImages = images.length ? images.slice(0, 3) : fallbackGalleryImages;
  return (
    <section className="bg-[#fbfaf6] px-4 py-20 text-[#202019] sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-[#202019]/15 pb-5 sm:mb-14 sm:pb-7">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-[#a74326]">A place for good company</p>
            <h2 className="font-serif text-4xl leading-none tracking-[-0.04em] sm:text-6xl">A look around</h2>
          </div>
          <Link to="/gallery" className="inline-flex items-center gap-2 pb-1 text-sm hover:text-[#a74326]">More of Farzi <ArrowUpRight size={16} /></Link>
        </div>

        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          {displayImages.map((image, index) => (
            <button key={image.id} onClick={() => onOpenLightbox(index)} className={`group relative min-h-[300px] overflow-hidden bg-[#312b22] text-left md:min-h-[380px] ${index === 0 ? 'md:col-span-7 md:row-span-2 md:min-h-[600px]' : 'md:col-span-5'}`}>
              <img src={image.imageUrl} alt={image.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7">
                <span>
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/70">{image.categoryName || 'Farzi Café'}</span>
                  <span className="block font-serif text-2xl sm:text-3xl">{image.title}</span>
                </span>
                <span className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 transition group-hover:bg-white group-hover:text-[#202019]"><Expand size={15} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
