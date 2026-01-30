import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Image src="/NoAccess.png" width={700} height={700} alt="404" />
    </div>
  );
};

export default page;
