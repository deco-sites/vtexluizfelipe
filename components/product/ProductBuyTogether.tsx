import AddToCartBuyTogether from "$store/islands/AddToCartBuyTogether.tsx";
import {
  Product,
  ProductDetailsPage,
  PropertyValue,
} from "apps/commerce/types.ts";
import { AppContext } from "deco-sites/vtexluizfelipe/apps/site.ts";

import { formatPrice } from "deco-sites/vtexluizfelipe/sdk/format.ts";
import {
  ProductListType,
  useProductList,
} from "deco-sites/vtexluizfelipe/sdk/useProductList.ts";
import { SectionProps } from "deco/mod.ts";
import { JSX } from "preact";
import { useCallback, useState } from "preact/hooks";

type LoaderResponse = {
  products: ProductListType[];
};

export type TermsProps = {
  terms: string;
};

interface Props {
  page: ProductDetailsPage | null;
  terms: TermsProps;
}

export async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<LoaderResponse> {
  if (!props.page?.product) {
    throw new Error("Missing Product Details Page Info");
  }
  const { product } = props.page;
  const { terms } = props.terms;

  const splitedTerms = terms.split(",");
  const productTerm =
    splitedTerms.find((term) => product?.name?.toLowerCase().includes(term)) ??
      "";

  const response = await ctx.invoke.vtex.loaders.intelligentSearch.productList({
    props: {
      query: productTerm,
      count: 3,
    },
  });

  const productMap: Record<string, ProductListType> = {};

  response?.forEach((product: Product) => {
    const productId = product.productID;

    productMap[productId] = {
      id: product?.productID,
      inProductGroupWithID: product?.inProductGroupWithID ?? "",
      name: product?.name ?? "",
      price: product?.offers?.offers?.[0]?.price ?? 0,
      image: product.image?.[0]?.url ?? "",
      seller: product?.offers?.offers?.[0]?.seller ?? "1",
      variants: product?.isVariantOf?.hasVariant ?? [],
    };
  });

  const productList = Object.values(productMap);

  return {
    products: productList,
  };
}

function ProductBuyTogether({ products }: SectionProps<typeof loader>) {
  const [productsVariant, setProductVariant] = useState<ProductListType[]>(
    products,
  );

  if (!products) {
    throw new Error("Missing Product Details Page Info");
  }

  const totalPrice = productsVariant.reduce(
    (accumulator, product) => accumulator + product.price,
    0,
  );

  const handleClick = useCallback(
    (event: JSX.TargetedMouseEvent<HTMLButtonElement>, product: Product) => {
      event.preventDefault();

      setProductVariant((prevState) => {
        const filteredPrevState = prevState.filter((prev) =>
          prev.inProductGroupWithID !== product.inProductGroupWithID
        );

        const { productMap } = useProductList(product);

        return [
          ...filteredPrevState,
          productMap,
        ];
      });
    },
    [],
  );

  return (
    <div
      class="container mx-4 lg:mx-auto w-auto my-16"
      id="buy-together"
    >
      <h2 class="text-xl lg:text-[28px] text-black font-bold mb-8">
        Compre junto
      </h2>
      <div class="flex flex-row">
        {products?.map((product: ProductListType) => (
          <div
            class="w-96 bg-white py-7 px-6 mr-9 rounded-lg"
            key={product.id}
          >
            <div class="flex flex-col">
              <img
                src={product.image ?? ""}
                alt={product.name}
                class="w-100% h-100% mr-6"
              />
              <div class="flex flex-col justify-center">
                <div class="flex justify-center align-middle w-100% gap-2">
                  {product.variants.map((variant: Product) => {
                    const tamanhoProperty = variant.additionalProperty?.find((
                      property: PropertyValue,
                    ) => property?.name === "Tamanho");
                    null;
                    const tamanhoValue = tamanhoProperty
                      ? tamanhoProperty.value
                      : null;
                    const selectedSku = productsVariant.some((pvariant) =>
                      pvariant.name == variant.name
                    );
                    const blockClassSelected = selectedSku
                      ? "bg-[#f88417] text-white"
                      : "";
                    return (
                      <button
                        class={`mt-2 mb-2 w-10 rounded ${blockClassSelected}`}
                        onClick={(event) => handleClick(event, variant)}
                      >
                        {tamanhoValue}
                      </button>
                    );
                  })}
                </div>
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
        <span>{formatPrice(totalPrice ?? 0)}</span>
        <AddToCartBuyTogether products={productsVariant} />
      </div>
    </div>
  );
}

export default ProductBuyTogether;
