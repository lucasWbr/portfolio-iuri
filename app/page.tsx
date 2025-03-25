import Image from "next/image";
import Navbar from "../components/navbar/Navbar";
import logo from "../public/logo.png";
import { list } from "../components/data/itemsList";
import Link from "next/link";
import Footer from "../components/footer/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center items-center mx-auto">
        <Image src={logo} alt="Iuri Lang Meira" width={200} height={200} />
        <p>
          {
            "I'm a software engineer, I love to learn new things and I'm always looking for new challenges"
          }
        </p>
      </div>
      <div className="grid grid-cols-1 mx-auto max-w-7xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {list.map((item) => (
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
