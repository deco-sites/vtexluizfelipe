import type { OrderForm } from "apps/vtex/utils/types.ts";
import {
  default as extend,
  Props,
} from "apps/website/loaders/extension.ts";

/**
 * @title Extend your cart
 */
export default function ProductDetailsExt(
  props: Props<OrderForm | null>,
): Promise<OrderForm | null> {
  return extend(props);
}
