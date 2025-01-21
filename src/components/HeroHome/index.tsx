import { Button } from "../ui/button";
import Image from "next/image";

const HeroHome = () => {
  return (
    <div className=" bg-white text-black flex items-center justify-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl">
        {/* Left Section */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Informazioni sul sito.
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur delectus officiis incidunt temporibus esse deserunt expedita aut nulla.
          </p>
          <Button className="flex items-center space-x-2">
            <span>Scopri</span>
          </Button>
        </div>

        {/* Right Section */}
        {/* <div className="relative">
          <div className="w-full h-72 flex items-center justify-center">
            <Image src={"https://shadcnblocks.com/images/block/illustrations/tokyo-selecting-the-elements-of-the-horizontal-graph-chart.svg"} alt="" fill={true} />
          </div>
        </div> */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,#000_60%,transparent_100%)]"></div>
          <Image src={"https://shadcnblocks.com/images/block/illustrations/tokyo-selecting-the-elements-of-the-horizontal-graph-chart.svg"} alt="" width={"500"} height={"600"} className="mx-auto max-h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default HeroHome;
