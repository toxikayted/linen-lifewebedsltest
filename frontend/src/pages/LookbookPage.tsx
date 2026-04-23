import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/ui/Reveal'
import { X, ZoomIn } from 'lucide-react'

const PHOTOS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1539787701702-25e6f61d28b5?w=900', caption: 'Ceylon Breeze, Morning Light', span: 'col-span-1 row-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900', caption: 'Galle Trousers, Harbour View', span: 'col-span-1 row-span-1' },
  { id: 3, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900', caption: 'Artisan Weaver, Kandy Workshop', span: 'col-span-1 row-span-1' },
  { id: 4, src: 'https://images.unsplash.com/photo-1600950207944-0d63e8edbc3f?w=900', caption: 'Ella Kurta, Hillside', span: 'col-span-2 row-span-1' },
  { id: 5, src: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=900', caption: 'Kandy Morning Sheet, Dawn', span: 'col-span-1 row-span-1' },
  { id: 6, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900', caption: 'Colombo Night Jacket, City', span: 'col-span-1 row-span-2' },
  { id: 7, src: 'https://images.unsplash.com/photo-1588528402605-1f4ea7b7df4e?w=900', caption: 'Sigiriya Throw, Dusk Light', span: 'col-span-1 row-span-1' },
  { id: 8, src: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=900', caption: 'Linen Texture Detail', span: 'col-span-1 row-span-1' },
]

export default function LookbookPage() {
  const [lightbox, setLightbox] = useState<(typeof PHOTOS)[0] | null>(null)

  return (
    <main className="pt-28 min-h-screen">
      <section className="section">
        <div className="container-xl">
          <Reveal className="mb-14">
            <p className="mono text-xs tracking-widest text-[var(--accent-gold)] uppercase mb-2">Visual Archive</p>
            <h1 className="heading-display text-[clamp(3rem,7vw,6rem)]">
              The Lookbook
            </h1>
            <p className="script text-2xl text-[var(--accent-sage)] mt-2">Season 2025</p>
          </Reveal>

          {/* Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[220px] gap-4">
            {PHOTOS.map((photo, i) => (
              <Reveal key={photo.id} delay={i * 0.07} className={photo.span}>
                <motion.div
                  className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLightbox(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="mono text-[10px] text-white/80 uppercase tracking-wide">{photo.caption}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.caption} className="w-full h-full object-contain rounded-2xl" />
              <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-1.5">
                <p className="mono text-xs text-white/80">{lightbox.caption}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-8 h-8 glass rounded-full flex items-center justify-center text-white hover:border-[var(--accent-gold)] transition-all"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
