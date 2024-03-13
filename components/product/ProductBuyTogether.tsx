import AddToCartBuyTogether from "$store/islands/AddToCartBuyTogether.tsx";
import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "deco-sites/vtexluizfelipe/apps/site.ts";

import { formatPrice } from "deco-sites/vtexluizfelipe/sdk/format.ts";
import { SectionProps } from "deco/mod.ts";

type LoaderResponse = {
  page: Product | null;
  products: ProductListType[];
  term: string;
};

export type TermsProps = {
  terms: string;
};

export type ProductListType = {
  id: string;
  name: string;
  image: string;
  price: number;
  seller: string;
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

  if (props.page === null) {
    throw new Error("Missing Product Details Page Info");
  }
  const { product } = props.page;
  const { terms } = props.terms;
  const nodeTerms = terms.split(",");
  const productTerm =
    nodeTerms.find((term) => product?.name?.toLowerCase().includes(term)) ?? "";

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
      name: product?.name ?? "",
      price: product?.offers?.offers?.[0]?.price ?? 0,
      image: product.image?.[0]?.url ?? "",
      seller: product?.offers?.offers?.[0]?.seller ?? "1",
    };

  });

  const productList = Object.values(productMap);

  return {
    page: product,
    products: productList,
    term: productTerm,
  };
}

function BuyTogether({ products }: SectionProps<typeof loader>) {

  if (products === null) {
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
        {!!products && products?.map((product: ProductListType) => (
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
        <AddToCartBuyTogether products={products} />
      </div>
    </div>
  );
}

export default BuyTogether;
