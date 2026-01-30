
import Image from "next/image";


export default function Logo() {
  return (
    <div
      className={` flex flex-row items-center justify-center gap-2 md:flex-col` }
    >
    <Image
  src="/almabbaratLogo.webp"
  alt="Logo"
  className="w-15 h-15 md:w-25 md:h-25"
sizes="(max-width: 768px) 6rem, 10rem" 
    width={100}
    height={100}
    priority
/>

      <p className="text-[20px] text-white inline">جمعية المبرات</p>
    </div>
  );
}