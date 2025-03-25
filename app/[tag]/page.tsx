import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { list } from "@/components/data/itemsList";
import Link from "next/link";

function page({ params }: { params: { tag: string } }) {
  const currentTag = params.tag;
  const items = list.filter((item) => item.tags.includes(currentTag));

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 mx-auto max-w-7xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 min-h-screen">
        {items.map((item) => (
          <Link key={item.id} href={`/project/${item.id}`} passHref>
            <img
              src={item.images[0]}
              alt={item.title}
              width={300}
              height={300}
            />
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
export default page;
