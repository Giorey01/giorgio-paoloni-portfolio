import Image from "next/image";
import hero_image_mobile from "@/assets/Hero_picture_mobile.jpg";

export default function Home() {
  return (
    <div className="mt-12">
      <h1 className="text-4xl font-extrabold text-center italic">
        Hi i’m Giorgio
      </h1>
      <div className="flex flex-col justify-center items-center mt-20">
        <Image
          src={hero_image_mobile}
          width={310}
          height={310}
          alt="Picture of the author"
        />
        <h2 className="text-3xl font-semibold mt-4">
          {"Moments Made Eternal"}
        </h2>
        <span className="text-lg font-medium text-gray-500 text-center leading-9">
          <p className="tracking-wide ">Turn fleeting moments</p>
          <p className="tracking-wide">into everlasting</p>
          <p className="tracking-wide">memories.</p>
        </span>
      </div>
    </div>
  );
}
