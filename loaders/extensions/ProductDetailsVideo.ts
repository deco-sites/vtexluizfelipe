import { ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "apps/verified-reviews/mod.ts";
import { ExtensionOf } from "apps/website/loaders/extension.ts";

export interface Props {
  textUrl?: "";
  count?: number;
  offset?: number;
  order?:
    | "date_desc"
    | "date_ASC"
    | "rate_DESC"
    | "rate_ASC"
    | "helpfulrating_DESC";
}

/**
 * @title Product Details With Video Placeholder API
 */
export default function productDetailsPage(
  config: Props,
  _req: Request,
  _ctx: AppContext,
): ExtensionOf<ProductDetailsPage | null> {
  return (productDetailsPage: ProductDetailsPage | null) => {
    if (!productDetailsPage?.product) {
      return null;
    }

    console.log(config?.textUrl);

    const url = `https://placehold.co/3840x2160.mp4?text=${config?.textUrl}`;

    if (!productDetailsPage.product.video) {
      productDetailsPage.product.video = [];
    }

    productDetailsPage.product.video.push({
      "@type": "VideoObject",
      contentUrl: url,
      encodingFormat: "video",
    });

    return productDetailsPage;
  };
}
