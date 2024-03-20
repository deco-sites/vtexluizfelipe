import { useCart } from "apps/vtex/hooks/useCart.ts";
import { ProductListType } from "deco-sites/vtexluizfelipe/sdk/useProductList.ts";
import Button from "./Button.tsx";

export interface Props {
  products: ProductListType[];
}

function AddToCartBuyTogether({ products }: Props) {
  if (!products) return null;
  const { addItems } = useCart();

  const handleAddToCart = (): void => {
    const orderItems = products.map((product) => ({
      id: product.id,
      seller: product.seller || "",
      quantity: 1,
    }));

    addItems({ orderItems });
  };
  "bg-amber-500 text-white"
  return (
    <Button
      onClick={handleAddToCart}
      class="text-white bg-[#f88417] border-[#f88417] hover:bg-[#c97f3a] hover:border-[#c97f3a] w-[74px] lg:w-[108px] h-9 min-h-fit rounded-lg"
    >
      Adicionar
    </Button>
  );
}

export default AddToCartBuyTogether;
