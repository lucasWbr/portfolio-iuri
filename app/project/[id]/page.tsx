import { list } from "@/components/data/itemsList";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

function page({ params }: { params: { id: string } }) {
  const project = list.find((item) => item.id === params.id);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen mx-auto max-w-7xl p-4 w-full justify-center bg-red-500">
        <h1>{project?.title}</h1>
        <p>{project?.description}</p>
        <img
          src={"../" + project?.images[0]}
          width="800"
          height="800"
          alt={project?.title}
        />
      </div>
      <Footer />
    </div>
  );
}
export default page;
