import { Product } from "apps/commerce/types.ts";

export type ProductListType = {
  id: string;
  inProductGroupWithID: string;
  name: string;
  image: string;
  price: number;
  seller: string;
  variants: Product[];
};

export const useProductList = (product: Product) => {
  const productMap: ProductListType = {
    id: product?.productID,
    inProductGroupWithID: product?.inProductGroupWithID ?? "",
    name: product?.name ?? "",
    price: product?.offers?.offers?.[0]?.price ?? 0,
    image: product.image?.[0]?.url ?? "",
    seller: product?.offers?.offers?.[0]?.seller ?? "1",
    variants: product?.isVariantOf?.hasVariant ?? []
  }

  return { productMap };
} 