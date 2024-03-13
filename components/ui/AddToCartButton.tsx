import { useCart } from "apps/vtex/hooks/useCart.ts";
import { ProductListType } from "deco-sites/vtexluizfelipe/components/product/ProductBuyTogether.tsx";
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
  return (
    <Button
      onClick={handleAddToCart}
      class="text-white bg-[#27239E] border-[#27239E] hover:bg-[#6562E5] hover:border-[#6562E5] w-[74px] lg:w-[108px] h-9 min-h-fit rounded-lg"
    >
      Adicionar
    </Button>
  );
}

export default AddToCartBuyTogether;
