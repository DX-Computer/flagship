import TokensEntry from "@/app/componentes/Tokens/modules/TokensEntry";
import { getDictionary } from "../dictionaries";
import { tParams } from "../layout";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team & Tokens",
  alternates: {
    canonical: `https://dx.computer/tokens/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://dx.computer/${item}/tokens/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default async function ComputationalManufacturing({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <TokensEntry dict={dict} />;
}
