import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "deco-sites/vtexluizfelipe/apps/site.ts";
import AddToCartBuyTogether from "deco-sites/vtexluizfelipe/components/ui/AddToCardButton.tsx";
import { invoke } from "deco-sites/vtexluizfelipe/runtime.ts";
import { formatPrice } from "deco-sites/vtexluizfelipe/sdk/format.ts";
import { useOffer } from "deco-sites/vtexluizfelipe/sdk/useOffer.ts";

export type ProductListType = {
  id: string;
  name: string | undefined;
  image: string | null;
  price: number | null;
  seller: string | undefined;
};

interface BuyTogetherProps {
  page: ProductDetailsPage | null;
  productList?: ProductListType[];
}

export type Props = BuyTogetherProps;

export async function loader(props: Props, _req: Request, _ctx: AppContext) {
  if (props.page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product } = props.page;

  console.log()
  const { offers } = product;

  const { teasers }: any = useOffer(offers);

  const getSkuIds = (name: string) => {
    return teasers?.find((teaser: any) =>
      teaser.conditions?.parameters?.some((param: any) => param.name === name)
    )?.conditions?.parameters?.find((param: any) => param.name === name)
      ?.value;
  };

  const skuIdsList1 = getSkuIds("SkuIdsList1");
  const skuIdsList2 = getSkuIds("SkuIdsList2");

  const skuIdsList2Array = skuIdsList2 ? skuIdsList2.split(",") : [];

  const updatedProductIds: string[] = [skuIdsList1, ...skuIdsList2Array].filter(
    Boolean,
  ) as string[];

  console.log("Updated Product IDs:", updatedProductIds);

  if (!updatedProductIds.length) return null;

  const response = await invoke.vtex.loaders.intelligentSearch.productList({
    props: {
      ids: updatedProductIds
    }
  }) ?? [];

  console.log("RESPONSE", response)

  const validProductIds = new Set(updatedProductIds);

  const productMap: Record<string, ProductListType> = {};

  response?.forEach((product: Product) => {
    const productId = product.productID;

    if (validProductIds.has(productId)) {
      productMap[productId] = {
        id: product.productID,
        name: product.name,
        price: product?.offers?.offers?.[0]?.price ?? null,
        image: product.image?.[0]?.url ?? null,
        seller: product?.offers?.offers?.[0]?.seller,
      };

      if (product.isVariantOf?.hasVariant) {
        product.isVariantOf.hasVariant.forEach((variant) => {
          const variantId = variant.productID;

          if (validProductIds.has(variantId)) {
            productMap[variantId] = {
              id: product.productID,
              name: variant.name,
              price: variant?.offers?.offers?.[0]?.price ?? null,
              image: variant.image?.[0]?.url ?? null,
              seller: variant?.offers?.offers?.[0]?.seller,
            };
          }
        });
      }
    }
  });

  const skuList = Object.values(productMap);

  return {
    page: response,
    skuList,
  };
}

function BuyTogether({ productList }: Props) {
  if (productList === null) {
    throw new Error("Missing Product Details Page Info");
  }

  return (
    <div
      class="container mx-4 lg:mx-auto w-auto my-16"
      id="buy-together"
    >
      <h2 class="text-xl lg:text-[28px] text-black font-bold mb-8">
        Compre junto
      </h2>
      <div class="flex flex-row">
        {productList?.map((product: ProductListType) => (
          <div
            class="h-[152px] w-96 bg-white py-7 px-6 mr-9 rounded-lg border-2 border-[#E4E4E4]"
            key={product.id}
          >
            <div class="flex flex-row">
              <img
                src={product.image ?? ""}
                alt={product.name}
                class="w-24 h-24 mr-6"
              />
              <div class="flex flex-col justify-center">
                <p class="text-sm font-bold text-[#56565A] max-w-[300px] mb-4">
                  {product.name}
                </p>
                <p class="text-base font-bold text-[#101820]">
                  {formatPrice(product.price ?? 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <AddToCartBuyTogether products={productList} />
      </div>
    </div>
  );
}

export default BuyTogether;