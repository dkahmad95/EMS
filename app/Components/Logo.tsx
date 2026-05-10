import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-row items-center gap-3">
      <Image
        src="/almabbaratLogo.webp"
        alt="شعار جمعية المبرات"
        className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-contain flex-shrink-0"
        width={40}
        height={40}
        priority
      />
      <p className="text-white font-bold text-base leading-tight">
        جمعية المبرات
      </p>
    </div>
  );
}
