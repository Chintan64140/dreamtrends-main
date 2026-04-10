export default function ImageGallery({ images = [] }) {
  return (
    <div>
      {images.length ? images[0]?.alt || "Image Gallery" : "No images"}
    </div>
  );
}
