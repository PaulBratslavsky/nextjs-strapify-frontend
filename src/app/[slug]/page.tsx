import React from "react";
import qs from "qs";
import type { PageProps } from "@/types";
import { getStrapiURL } from "@/lib/utils";

import { Container } from "@/components/Container";

interface StaticParamsProps {
  id: number;
  slug: string;
}

export async function generateStaticParams() {
  const { fetchData } = await import("@/lib/fetch");

  const path = "/api/pages";
  const baseUrl = getStrapiURL();

  const url = new URL(path, baseUrl);
  url.search = qs.stringify({
    fields: ["slug"],
  });

  const pages = await fetchData(url.href);

  return pages.data.map((page: Readonly<StaticParamsProps>) => ({
    slug: page.slug,
  }));
}

export default function DynamicPageRoute(props: Readonly<PageProps>) {
  const slug = props.params?.slug;
  return (
    <Container>
      <div>Dynamic Page Route: {slug}</div>
    </Container>
  );
}
