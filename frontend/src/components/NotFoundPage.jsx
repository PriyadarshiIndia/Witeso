const NotFoundPage = () => {
  return (
    <main className="min-h-screen pt-30 pb-30 flex flex-col items-center justify-center bg-[#1d3041] text-white font-sans">
      {/* Wrapper for Image and Animations */}
      <div className="relative w-full max-w-[440px] min-h-[410px] mt-10 mx-auto">
        {/* Cloud Image */}
        <img
          src="/images/cloud_warmcasino.png"
          alt="Cloud"
          className="w-full"
        />

        {/* Animated Elements */}
        <div
          className="absolute top-[108px] left-[102px] w-[84px] h-[106px] bg-[url('/images/404-1.png')] bg-no-repeat bg-center z-10 opacity-100 animate-[el1Move_800ms_linear_infinite]"
        ></div>
        <div
          className="absolute top-[92px] left-[136px] w-[184px] h-[106px] bg-[url('/images/404-2.png')] bg-no-repeat bg-center z-10 opacity-100 animate-[el2Move_800ms_linear_infinite]"
        ></div>
        <div
          className="absolute top-[108px] left-[180px] w-[284px] h-[106px] bg-[url('/images/404-3.png')] bg-no-repeat bg-center z-10 opacity-100 animate-[el3Move_800ms_linear_infinite]"
        ></div>
      </div>

      {/* Home Link */}
      <a
        href="/"
        className="mt-8 px-8 py-4 text-2xl font-bold uppercase text-white bg-green-500 shadow-[0_5px_0_#059916] rounded-full hover:bg-green-600 transition-colors"
      >
        Go Home
      </a>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes el1Move {
            0% {
              top: 108px;
              left: 102px;
              opacity: 1;
            }
            100% {
              top: -10px;
              left: 22px;
              opacity: 0;
            }
          }
          @keyframes el2Move {
            0% {
              top: 92px;
              left: 136px;
              opacity: 1;
            }
            100% {
              top: -10px;
              left: 108px;
              opacity: 0;
            }
          }
          @keyframes el3Move {
            0% {
              top: 108px;
              left: 180px;
              opacity: 1;
            }
            100% {
              top: 28px;
              left: 276px;
              opacity: 0;
            }
          }
        `}
      </style>
    </main>
  );
};

export default NotFoundPage;