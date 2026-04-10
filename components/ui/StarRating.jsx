export default function StarRating({ rating = 0 }) {
  return <span>{rating.toFixed(1)} / 5</span>;
}
