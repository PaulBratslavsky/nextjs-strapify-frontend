import qs from "qs";
import { getStrapiURL } from "@/lib/utils";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { Benefits } from "@/components/Benefits";
import { ContentWithImage } from "@/components/ContentWithImage";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

async function loader() {
  const { fetchData } = await import("@/lib/fetch");
  const path = "/api/home";
  const baseUrl = getStrapiURL();

  const query = qs.stringify({
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
  console.dir(block, { depth: null });
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

export default async function Home() {
  const data = await loader();
  const blocks = data?.blocks;

  console.dir(blocks, { depth: null });

  return (
    <Container>
      {blocks ? blocks.map((block: any) => blockRenderer(block)) : null}
    </Container>
  );
}
