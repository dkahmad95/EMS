"use client";

const WelcomePage = () => {
  return (
    <div className="flex justify-center w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 items-center h-full">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-white mb-4">مرحباً</h1>
        <p className="text-2xl md:text-3xl text-primary-100 font-light tracking-wide">
          EMS By Ahmad Dekmak
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
