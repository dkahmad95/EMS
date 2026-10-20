import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Image
        src="/NoAccess.png"
        width={700}
        height={700}
        alt="رسم توضيحي: صفحة غير مصرح بها"
        priority
      />
    </div>
  );
};

export default page;
