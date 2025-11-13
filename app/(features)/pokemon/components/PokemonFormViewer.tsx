'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import type { PokemonVariant } from '@/domain/pokemon/types';

type PokemonFormViewerProps = {
  variants?: PokemonVariant[] | null;
  fallbackName: string;
  fallbackImage: string | null;
  currentSlug: string;
};

export function PokemonFormViewer({ variants: providedVariants, fallbackName, fallbackImage, currentSlug }: PokemonFormViewerProps) {
  const router = useRouter();
  const variants = useMemo<PokemonVariant[]>(() => {
    if (providedVariants && providedVariants.length > 0) {
      return providedVariants;
    }
    return [
      {
        slug: currentSlug,
        name: fallbackName,
        image: fallbackImage,
      },
    ];
  }, [currentSlug, fallbackImage, fallbackName, providedVariants]);

  const total = variants.length;
  const currentIndex = variants.findIndex(variant => variant.slug === currentSlug);
  const activeVariant = currentIndex >= 0 ? variants[currentIndex] : variants[0];
  const showControls = total > 1;

  const navigateToOffset = (offset: number) => {
    if (!showControls) {
      return;
    }
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const targetIndex = (baseIndex + offset + total) % total;
    const target = variants[targetIndex];
    if (target && target.slug !== currentSlug) {
      router.push(`/pokemon/${target.slug}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {showControls && (
        <div className="pointer-events-none absolute inset-y-0 -left-14 -right-14 z-10 flex items-center justify-between sm:-left-20 sm:-right-20 lg:-left-28 lg:-right-28">
          <button
            type="button"
            onClick={() => navigateToOffset(-1)}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center text-white transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Previous form"
          >
            <Image
              src="/chevron_left.svg"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 brightness-0 invert"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => navigateToOffset(1)}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center text-white transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Next form"
          >
            <Image
              src="/chevron_right.svg"
              alt=""
              width={48}
              height={48}
              className="h-10 w-10 brightness-0 invert"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      <div className="flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
        {activeVariant?.image ? (
          <Image
            src={activeVariant.image}
            alt={`${activeVariant.name} artwork`}
            width={320}
            height={320}
            priority
            className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
          />
        ) : (
          <Image src="/Pokeball.svg" alt="Pokéball placeholder" width={200} height={200} className="opacity-70" />
        )}
      </div>
      {showControls && activeVariant && (
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
          {activeVariant.name}
        </p>
      )}
    </div>
  );
}
