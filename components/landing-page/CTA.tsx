"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Sparkles } from "lucide-react"

const CTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".fade-in-stagger")
    elements.forEach((el, index) => {
      ;(el as HTMLElement).style.animationDelay = `${0.1 * (index + 1)}s`
      observer.observe(el)
    })

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el)
      })
    }
  }, [])

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="section-container text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-8 opacity-0 fade-in-stagger">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready to transform your workflow?
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 opacity-0 fade-in-stagger">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
              Start Coding Together
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Today
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed opacity-0 fade-in-stagger">
            Join thousands of developers who have already transformed their collaborative coding experience with
            Livelet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 fade-in-stagger">
            <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 active:scale-95 animate-button-pulse">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 inline transition-transform group-hover:translate-x-1" />
            </button>
            <button className="group bg-transparent border-2 border-gray-600 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 font-medium py-4 px-8 rounded-full transition-all duration-300 hover:bg-cyan-500/10">
              Schedule Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 opacity-0 fade-in-stagger">
            <p className="text-gray-400 text-sm mb-4">Trusted by developers at</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-gray-500 font-semibold">TechFlow</div>
              <div className="text-gray-500 font-semibold">CodeCraft</div>
              <div className="text-gray-500 font-semibold">InnovateLab</div>
              <div className="text-gray-500 font-semibold">DevStudio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
