"use client";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

import { useEffect } from "react";
import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import WhyLivelet from "@/components/landing-page/WhyLivelet";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Features from "@/components/landing-page/Features";
import Testimonials from "@/components/landing-page/Testimonials";
import Footer from "@/components/landing-page/Footer";

export const LandingPage = () => {
  // Initialize intersection observer to detect when elements enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    // This helps ensure smooth scrolling for the anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = e.currentTarget as HTMLAnchorElement;
        const targetId = target.getAttribute("href")?.substring(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        // Increased offset to account for mobile nav
        const offset = window.innerWidth < 768 ? 100 : 80;

        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: "smooth",
        });
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="space-y-4 sm:space-y-8">
        {" "}
        {/* Reduced space on mobile */}
        <Hero />
        <WhyLivelet />
        <HowItWorks />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

// export const LandingPage = () => {
//   console.log("landing page");
//   return (
//     <div className="space-y-6 text-center">
//       <h1
//         className={cn(
//           "text-6xl font-semibold text-white drop-shadow-md",
//           font.className
//         )}
//       >
//         Livelet
//       </h1>
//       <p className="text-gray-300">A collaborative code environment service</p>
//       <div>
//         <LoginButton>
//           <Button variant="secondary" size="lg">
//             Sign in
//           </Button>
//         </LoginButton>
//       </div>
//     </div>
//   );
// };
