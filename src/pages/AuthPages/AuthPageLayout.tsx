import React, { useEffect, useState } from "react";
import animationData from "../../assets/Student.json";
import teamAnimations from "../../assets/TeamAni.json";
import Lottie from "lottie-react";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      animation: animationData,
      title: "Ace your studies with ease.",
      text: "Struggling to keep up with your studies? We’ve got you covered!"
    },
    {
      animation: teamAnimations,
      title: "Our Team of Experts is here to help you Succeed.",
      text: "Whether it’s assignments, projects, or any other academic tasks, our talented team got you covered."
    }
  ];

   // Auto-advance slider every 5 seconds
   useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-[#6da5f9] lg:grid">
          <div className="relative flex items-center justify-center z-1 h-full">
            {/* Slider container */}
            <div className="relative w-full h-full">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto">
                    <div className={`w-full max-w-[400px] h-[300px] ${index !== 0 ? "mb-12" : ""}`}>
                      <Lottie 
                        animationData={slide.animation}
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                    <h1 className="text-white md:text-2xl lg:text-3xl mb-2 text-center">
                      {slide.title}
                    </h1>
                    <p className="text-center text-white/90">
                      {slide.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute bottom-6 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeSlide === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
