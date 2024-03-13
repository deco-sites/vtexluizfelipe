import { Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "deco-sites/vtexluizfelipe/apps/site.ts";
import AddToCartBuyTogether from "deco-sites/vtexluizfelipe/components/ui/AddToCardButton.tsx";
import { invoke } from "deco-sites/vtexluizfelipe/runtime.ts";
import { formatPrice } from "deco-sites/vtexluizfelipe/sdk/format.ts";
import { useOffer } from "deco-sites/vtexluizfelipe/sdk/useOffer.ts";
import { SectionProps } from "deco/mod.ts";

type LoaderResponse = {
  page: Product[] | null;
  products: ProductListType[];
}

export type TermsProps = {
  terms: string;
}

export type ProductListType = {
  id: string;
  name: string | undefined;
  image: string | null;
  price: number | null;
  seller: string | undefined;
};

interface Props {
  page: ProductDetailsPage | null;
  terms: TermsProps;
}

export async function loader(props: Props, _req: Request, _ctx: AppContext): Promise<LoaderResponse> {
  if (props.page === null) {
    throw new Error("Missing Product Details Page Info");
  }
  const { product } = props.page;
  const { terms } = props.terms;
  const nodeTerms = terms.split(',');
  const productTerm = nodeTerms.find((term) => product?.name?.toLowerCase().includes(term)) ?? '';
  console.log(productTerm);
  // product.name.includes(terms)

  console.log(product);
  // const { offers } = product;

  // const { teasers }: any = useOffer(offers);

  // const updatedProductIds = ['60639']

  const response = await invoke.vtex.loaders.intelligentSearch.productList({
    props: {
      query: productTerm,
      count: 3
    }
  })

  const productMap: Record<string, ProductListType> = {};

  response?.forEach((product: Product) => {
    const productId = product.productID;

      productMap[productId] = {
        id: product.productID,
        name: product.name,
        price: product?.offers?.offers?.[0]?.price ?? null,
        image: product.image?.[0]?.url ?? null,
        seller: product?.offers?.offers?.[0]?.seller,
      }
    })
  console.log(response);

  const products = Object.values(productMap);
  console.log(products)

  return {
    page: response,
    products
  };
}

function BuyTogether({page, products}: SectionProps<typeof loader>) {

  console.log(page)
  console.log(products)
//   const productList: ProductListType[] = [{
//     id: '1',
//     name: 'dino',
//     image: 'teste',
//     price: 199,
//     seller: '1',
//   },
//   {
//     id: '2',
//     name: 'dino',
//     image: 'teste',
//     price: 199,
//     seller: '1',
//   }
// ];

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
