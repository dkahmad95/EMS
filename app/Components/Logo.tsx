import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Right Logo */}
      <Image
        src="/almabbaratLogo.webp"
        alt="شعار جمعية المبرات"
        width={48}
        height={48}
        priority
        className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
      />

      {/* Left Content */}
      <div className="flex flex-col justify-center">
        <Image
          src="/MabarratLogoName.png"
          alt="اسم جمعية المبرات"
          width={140}
          height={60}
          priority
          className="w-32  lg:w-36 h-auto object-contain"
        />

      <p className="text-white font-medium text-[10px]  whitespace-nowrap leading-none text-center">
          مديرية التكفل و العلاقات  الخارجية
        </p>
      </div>
    </div>
  );
}