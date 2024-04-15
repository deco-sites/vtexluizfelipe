import { ProductDetailsPage } from "apps/commerce/types.ts";
import { ExtensionOf } from "apps/website/loaders/extension.ts";
import { AppContext } from "deco-sites/vtexluizfelipe/apps/site.ts";

/**
 * @title ProductDetails With OrderForm
 */
const loader = (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): ExtensionOf<ProductDetailsPage | null> =>
async (productDetails: ProductDetailsPage | null) => {
  if (!productDetails) {
    return null;
  }

  const cartResponse = await ctx.invoke.vtex.loaders.cart();

  console.log(cartResponse);

  return {
    ...productDetails,
    ...cartResponse,
  };
};

export default loader;
