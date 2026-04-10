export default function CartItem({ item }) {
  return <div>{item?.name || "Cart Item"}</div>;
}
