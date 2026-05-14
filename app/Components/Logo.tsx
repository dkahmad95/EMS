import Image from "next/image";

interface LogoProps {
  logoSize?: number;
  nameWidth?: number;
  textSize?: string;
}

export default function Logo({
  logoSize = 48,
  nameWidth = 140,
  textSize = "10px",
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Right Logo */}
      <Image
        src="/almabbaratLogo.webp"
        alt="شعار جمعية المبرات"
        width={logoSize}
        height={logoSize}
        priority
        className="object-contain flex-shrink-0"
      />

      {/* Left Content */}
      <div className="flex flex-col justify-center">
        <Image
          src="/MabarratLogoName.png"
          alt="اسم جمعية المبرات"
          width={nameWidth}
          height={60}
          priority
          className="h-auto object-contain"
        />

        <p
          className="text-white font-medium whitespace-nowrap leading-none text-center"
          style={{ fontSize: textSize }}
        >
          مديرية التكفل و العلاقات الخارجية
        </p>
      </div>
    </div>
  );
}