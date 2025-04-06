import { useState } from 'preact/hooks';

const Card = ({ 
    profile_pic, 
    full_name, 
    username, 
    view_profile_link,
    leetcode,
    codechef,
    codeforces,
    geekforgeeks,
    codestudio,
    github
 }) => {

    const [isFlipped, setIsFlipped] = useState(false);

    const handleMouseEnter = () => {
      setIsFlipped(true);
  };

  const handleMouseLeave = () => {
      setIsFlipped(false);
  };

    return (
      <main className="w-full min-h-[80vh] pt-11 no-scrollbar bg-gray-900">
        <div className="content">
          <main className="md:h-[94vh] w-full relative flex flex-col items-center md:flex-row">
            {/* WitesoCard Info */}
            <div className="pt-20 md:pt-2 relative bg-neutral-900 dark:bg-darkBox-900 h-full w-full flex justify-center items-center flex-1 perspective-1000">
              <div className="relative flex flex-col w-full gap-4 p-4 flex-1">
                <div className="flex flex-col items-center justify-center gap-2">
                  <img src="/images/witeso_logo.webp" width="440" height="440" className="mb-4 hidden md:flex sm:mt-4" alt="witeso" />
                  <p className="text-lg font-semibold text-gray-500 dark:text-darkText-300">Share your</p>
                  <div className="flex text-4xl font-semibold text-green-500 lg:text-6xl">
                    <span className="dark:text-white">#</span>
                    <span className="dark:text-white">Wite</span>
                    <span className="text-green-500">so</span>
                    <span className="dark:text-white">Card</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-500 dark:text-darkText-300">with friends and recruiters</p>
                </div>
                <div>
                  <div className="flex justify-center gap-4">
                    <div className="flex gap-4">
                      <div className="relative group flex items-center">
                        <button className="text-white rounded bg-green-500 relative group border flex gap-2 items-center dark:border-dark-900 py-1.5 px-4">
                          Download
                          <div className="inline-block" style={{ transform: "none" }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              className="text-white"
                            >
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-1 border border-gray-300 rounded aspect-square dark:border-darkBorder-700">
                      <button className="relative group">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                          className="text-gray-400"
                        >
                          <path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path>
                        </svg>
                        <div className="absolute z-[100] items-center hidden gap-2 px-2 py-1 text-xs text-black font-normal dark:bg-darkBox-800 dark:text-darkText-300 bg-white border rounded shadow-md whitespace-nowrap group-hover:flex top-8 dark:border-darkBorder-700">
                          <span>Share via link</span>
                        </div>
                      </button>
                    </div>
                    <a
                      href={view_profile_link}
                      className="flex items-center justify-center py-1 px-2 border border-gray-300 rounded aspect-square group text-gray-400 relative dark:border-darkBorder-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"></path>
                      </svg>
                      <div className="absolute z-[100] items-center hidden gap-2 px-2 py-1 text-xs text-black font-normal dark:bg-darkBox-800 dark:text-darkText-300 bg-white border rounded shadow-md whitespace-nowrap group-hover:flex top-8 dark:border-darkBorder-700">
                        <span>View Profile</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Witeso Flip Card */}
            <div id="flipCard" className="relative bg-neutral-900 dark:bg-darkBox-900 h-full w-full flex justify-center items-center flex-1 perspective-1000">
              <div class="bg-green-500/10 rounded-full w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-2xl md:blur-3xl"></div>
              <div className="w-fit">
                <div className="react-card-flip" style={{ zIndex: 'auto' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <div
                    className="react-card-flipper"
                    style={{ height: "100%", perspective: "1000px", position: "relative", width: "100%" }}
                  >
                    <div
                      className="react-card-front"
                      style={{
                        backfaceVisibility: "hidden",
                        height: "100%",
                        left: "0px",
                        position: isFlipped ? "absolute" : "relative",
                        top: "0px",
                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                        transition: "1s",
                        width: "100%",
                        zIndex: 2,
                      }}
                    >
                      <div className="w-full scale-[0.85] h-full rounded-3xl backface-hidden">
                        <div
                          id="profileCard"
                          className="border-[3px] bg-white dark:bg-black order-2 md:order-1 bg-center relative w-[360px] h-[620px] mx-auto bg-cover bg-no-repeat bg-opacity-10 p-2 rounded-3xl border-gray-200 dark:border-gray-500"
                          style={{ backgroundImage: "url('/images/witeso_card_bg.svg')" }}
                        >
                          <div className="ml-4">
                            <div className="flex text-sm font-semibold">
                              <span>Wite</span>
                              <span className="text-green-500">so</span>
                            </div>
                            <div>
                              <span className="text-darkBox-800 dark:text-gray-300">CARD</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-full">
                            <div className="relative z-10 flex items-center justify-center mx-auto w-fit">
                              <img
                                src={profile_pic.replace('=s96-c', '=s0')}
                                width="180"
                                height="180"
                                alt="Pushpender"
                                className="border-[5px] aspect-square rounded-full border-green-500"
                              />
                              <div className="absolute right-0 flex items-center justify-center p-2 rounded-full aspect-square bottom-2 bg-green-500">
                                <img src="/images/favicon.ico" width="30" height="30" alt="witeso" />
                              </div>
                            </div>
                          </div>
                          <div className="border-green-500 flex bg-gray-50 dark:bg-darkBox-800 dark:border-darkBorder-700 dark:bg-opacity-60 flex-col gap-2 -mt-20 border-[1px] p-2 rounded-2xl">
                            <div className="mt-20">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div className="flex items-center gap-1">
                                  <h3 className="text-2xl font-[500]">{full_name}</h3>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    className="text-green-500"
                                  >
                                    <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                                  </svg>
                                </div>
                                <div className="p-1 rounded-full flex justify-center items-center text-green-600 dark:text-[#EDC3A0] px-2 text-sm font-[500] bg-green-100 dark:bg-[#DBAB85]/30">
                                  @{username}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                              <div className="p-2 flex-1 border-[1px] round-border shadow-sm border-gray-100 bg-white dark:bg-darkBox-800 dark:border-darkBorder-700">
                                <h4 className="text-green-500 text-center text-sm font-[500]">DSA Solved</h4>
                                <hr className="my-2 border-gray-200" />
                                <span className="block text-4xl text-center">-</span>
                              </div>
                              <div className="p-2 flex-1 border-[1px] bg-white dark:bg-darkBox-800 dark:border-darkBorder-700 round-border shadow-sm border-gray-100">
                                <h4 className="text-green-500 text-center text-sm font-[500]">Active Days</h4>
                                <hr className="my-2 border-gray-200" />
                                <span className="block text-4xl text-center">-</span>
                              </div>
                            </div>
                            <div className="flex p-2 min-h-[85px] bg-white dark:bg-darkBox-800 dark:border-darkBorder-700 border-[1px] border-gray-100 gap-2 round-border shadow-sm flex-col justify-center items-center">
                              <div>
                                <h4 className="text-sm font-[550] text-gray-500">You can find me on ...</h4>
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <a href={leetcode}>
                                  <img src="/icons/leetcode_light.webp" className="w-7" alt="leetcode" />
                                </a>
                                <a href={codechef}>
                                  <img src="/icons/codechef_light.webp" className="w-7" alt="codechef" />
                                </a>
                                <a href={codeforces}>
                                  <img src="/icons/codeforces.webp" className="w-7" alt="codeforces" />
                                </a>
                                <a href={geekforgeeks}>
                                  <img src="/icons/gfg.webp" className="w-7" alt="geeksforgeeks" />
                                </a>
                                <a href={codestudio}>
                                  <img src="/icons/codestudio_light.webp" className="w-7" alt="codestudio" />
                                </a> 
                              </div>
                            </div>
                            <div className="flex p-1 min-h-[80px] bg-white dark:bg-darkBox-800 dark:border-darkBorder-700 border-[1px] border-gray-100 gap-1 round-border shadow-sm flex-col justify-center items-center">
                              <div className="flex flex-wrap items-center gap-1">
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#JAVA</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#C++</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#EXPERT</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#DSA</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#PYTHON3</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#5STARS</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      id="witeso_backcard"
                      className="react-card-back"
                      style={{
                        backfaceVisibility: "hidden",
                        height: "100%",
                        left: "0px",
                        position: isFlipped ? "relative" : "absolute",
                        top: "0px",
                        transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
                        transformStyle: "preserve-3d",
                        transition: "1s",
                        width: "100%",
                        zIndex: 1,
                      }}
                    >
                      <div className="w-full scale-[0.85] h-full rounded-3xl backface-hidden">
                        <div
                          id="devCard"
                          className="border-[3px] bg-white dark:bg-black order-2 md:order-1 bg-center relative w-[360px] h-[620px] mx-auto bg-cover bg-no-repeat bg-opacity-10 p-2 rounded-3xl border-gray-200 dark:border-gray-500"
                          style={{ backgroundImage: "url('/images/witeso_card_bg.svg')" }}
                        >
                          <div className="ml-4">
                            <div className="flex text-sm font-semibold">
                              <span>Wite</span>
                              <span className="text-green-500">so</span>
                            </div>
                            <div>
                              <span className="text-darkBox-800 dark:text-gray-300">CARD</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-full">
                            <div className="relative z-10 flex items-center justify-center mx-auto w-fit">
                              <img
                                src={profile_pic.replace('=s96-c', '=s0')}
                                width="180"
                                height="180"
                                alt="Pushpender"
                                className="border-[5px] aspect-square rounded-full border-green-500"
                              />
                              <div className="absolute right-0 flex items-center justify-center p-2 rounded-full aspect-square bottom-2 bg-green-500">
                                <img src="/images/favicon.ico" width="30" height="30" alt="witeso" />
                              </div>
                            </div>
                          </div>
                          <div className="border-green-500 flex bg-gray-50 dark:bg-darkBox-800 dark:border-darkBorder-700 dark:bg-opacity-60 flex-col gap-2 -mt-20 border-[1px] p-2 rounded-2xl">
                            <div className="mt-20">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <div className="flex items-center gap-1">
                                  <h3 className="text-2xl font-[500]">{full_name}</h3>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    className="text-green-500"
                                  >
                                    <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
                                  </svg>
                                </div>
                                <div className="p-1 rounded-full flex justify-center items-center text-green-600 dark:text-[#EDC3A0] px-2 text-sm font-[500] bg-green-100 dark:bg-[#DBAB85]/30">
                                  @{username}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                              <div className="p-2 flex-1 border-[1px] bg-white dark:bg-darkBox-800 dark:border-darkBorder-700 round-border shadow-sm border-gray-100">
                                <h4 className="text-green-500 text-center text-sm font-[500]">Active Days</h4>
                                <hr className="my-2 border-gray-200" />
                                <span className="block text-4xl text-center">-</span>
                              </div>
                              <div className="p-2 flex-1 border-[1px] rounded shadow-sm border-gray-100 bg-white dark:bg-darkBox-800 dark:border-darkBorder-700">
                                <h4 className="text-green-500 text-center text-sm font-[500]">Contributions</h4>
                                <hr className="my-2 border-gray-200" />
                                <span className="block text-4xl text-center">-</span>
                              </div>
                            </div>
                            <div className="flex p-2 min-h-[85px] bg-white dark:bg-darkBox-800 dark:border-darkBorder-700 border-[1px] border-gray-100 gap-2 round-border shadow-sm flex-col justify-center items-center">
                              <div>
                                <h4 className="text-sm font-[550] text-gray-500">You can find me on ...</h4>
                              </div>
                              <a
                                href={github}
                                target="blank"
                                className="flex gap-1 items-center bg-gray-200 dark:bg-darkBox-900 rounded-full py-1 px-2 w-fit"
                              >
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth="0"
                                  viewBox="0 0 496 512"
                                  className="text-gray-500"
                                  height="18"
                                  width="18"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                                </svg>
                                <span className="text-gray-500 text-xs dark:text-darkText-400 font-[450]">{github.toLowerCase().replace("https://", "").replace("www.", "").replace("github.com", "")}</span>
                              </a>
                            </div>
                            <div className="flex p-1 min-h-[80px] bg-white dark:bg-darkBox-800 dark:border-darkBorder-700 border-[1px] border-gray-100 gap-1 round-border shadow-sm flex-col justify-center items-center">
                              <div className="flex flex-wrap items-center gap-1">
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#LOLCODE</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#C++</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#CSS</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#HACK</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#PROCFILE</p>
                                </div>
                                <div className="flex items-center justify-center px-1 py-0.5 rounded-full bg-gray-200/80 dark:bg-zinc-600">
                                  <p className="text-gray-600 dark:text-zinc-400 m-1 px-2 text-xs font-medium">#MAKEFILE</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </main>
    );
  };
  
  export default Card;