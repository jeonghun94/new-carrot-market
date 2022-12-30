import Image from "next/image";
import noImage from "public/no-image.png";

interface ProductImageProps {
  url: string;
  width: number;
  height: number;
}

export default function ProductImage({
  url,
  width,
  height,
}: ProductImageProps) {
  return (
    <>
      <Image
        width={width}
        height={height}
        src={
          url
            ? `https://imagedelivery.net/jhi2XPYSyyyjQKL_zc893Q/${
                url.split(",")[0]
              }/avatar`
            : noImage
        }
        className={`w-12 h-12 rounded-md ${url ? " bg-slate-300" : ""}`}
      />
    </>
  );
}
