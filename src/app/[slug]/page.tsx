import React from "react";
import qs from "qs";
import type { PageProps } from "@/types";
import { getStrapiURL } from "@/lib/utils";

import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { Benefits } from "@/components/Benefits";
import { ContentWithImage } from "@/components/ContentWithImage";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

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

async function loader(slug: string) {
  const { fetchData } = await import("@/lib/fetch");
  const path = "/api/pages";
  const baseUrl = getStrapiURL();

  const query = qs.stringify({
    filters: {
      slug: slug,
    },
    populate: {
      blocks: {
        populate: {
          cta: {
            populate: true,
          },
          image: {
            fields: ["url", "alternativeText", "name"],
          },
          item: {
            populate: true,
          },
          card: {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          questions: {
            populate: true,
          },
        },
      },
    },
  });

  const url = new URL(path, baseUrl);
  url.search = query;
  const data = await fetchData(url.href);
  return data;
}

function blockRenderer(block: any) {
  switch (block.__component) {
    case "layout.hero":
      return <Hero key={block.id} data={block} />;
    case "layout.section-heading":
      return <SectionHeading key={block.id} data={block} />;
    case "layout.content-items":
      return <Benefits key={block.id} data={block} />;
    case "layout.content-image":
      return <ContentWithImage key={block.id} data={block} />;
    case "layout.yt-video":
      return <Video key={block.id} data={block} />;
    case "layout.card-quote":
      return <Testimonials key={block.id} data={block} />;
    case "layout.fa-qs":
      return <Faq key={block.id} data={block} />;
    case "layout.cta":
      return <Cta key={block.id} data={block} />;
    default:
      return null;
  }
}

export default async function DynamicPageRoute(props: Readonly<PageProps>) {
  const slug = props.params?.slug;
  const { data } = await loader(slug);
  if (!data) return null;

  const blocks = data[0]?.blocks;

  // console.dir(blocks, { depth: null });
  // console.log(slug);

  return (
    <Container>
      {blocks ? blocks.map((block: any) => blockRenderer(block)) : null}
    </Container>
  );
}
