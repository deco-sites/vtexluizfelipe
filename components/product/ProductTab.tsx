import { usePartialSection } from "deco/hooks/usePartialSection.ts";

interface Props {
  activeIndex: number;
}

function ProductTab({ activeIndex }: Props) {
  return (
    <div>
      <button
        class={activeIndex === 0 ? "bg-red-700" : ""}
        {...usePartialSection<typeof ProductTab>({
          props: { activeIndex: 0 },
        })}
      >
        Aba 1
      </button>
      <button
        class={activeIndex === 1 ? "bg-blue-700" : ""}
        {...usePartialSection<typeof ProductTab>({
          props: { activeIndex: 1 },
        })}
      >
        Aba 2
      </button>
      <button
        class={activeIndex === 2 ? "bg-orange-600" : ""}
        {...usePartialSection<typeof ProductTab>({
          props: { activeIndex: 2 },
        })}
      >
        Aba 3
      </button>
    </div>
  );
}

export default ProductTab;
