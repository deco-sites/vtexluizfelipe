import type { SectionProps } from "deco/mod.ts";

type LoaderResponse = {
  dogFacts: string[];
  title: string;
};

export interface Props {
  title: string;
  numberOfFacts: number;
}

export async function loader(
  { numberOfFacts, title }: Props,
  _req: Request,
): Promise<LoaderResponse> {
  const data = await fetch(
    `https://dogapi.dog/api/facts?number=${numberOfFacts ?? 1}`,
  );
  const { facts: dogFacts } = await data.json();
  return { dogFacts, title };
}

export default function DogFacts(
  { title, dogFacts }: SectionProps<typeof loader>,
) {
  return (
    <div class="p-4">
      <h1 class="font-bold">{title}</h1>
      <ul>
        {dogFacts.map((fact) => <li>{fact}</li>)}
      </ul>
    </div>
  );
}
