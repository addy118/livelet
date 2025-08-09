"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

interface TestimonialProps {
  content: string
  author: string
  role: string
  company: string
  avatar: string
  rating: number
}

const testimonials: TestimonialProps[] = [
  {
    content:
      "Livelet has revolutionized how our team collaborates on code. The real-time editing and live cursor tracking make it feel like we're all in the same room, even when we're continents apart.",
    author: "Sarah Chen",
    role: "Senior Developer",
    company: "TechFlow Inc.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    content:
      "The multi-language support and intelligent autocompletion have significantly boosted our productivity. We can seamlessly switch between projects without missing a beat.",
    author: "Michael Rodriguez",
    role: "Lead Engineer",
    company: "CodeCraft Solutions",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    content:
      "As a startup, we needed a solution that could scale with us. Livelet's role-based access control and secure authentication give us the flexibility and security we need.",
    author: "Dr. Amara Patel",
    role: "CTO",
    company: "InnovateLab",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    content:
      "The instant code execution feature is a game-changer. We can test ideas on the fly and iterate quickly, which has dramatically improved our development cycle.",
    author: "Jason Lee",
    role: "Full Stack Developer",
    company: "DevStudio Pro",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
  {
    content:
      "Livelet's intuitive interface made onboarding our remote team effortless. Within minutes, everyone was collaborating like they'd been using it for years.",
    author: "Emma Thompson",
    role: "Project Manager",
    company: "AgileWorks",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
  },
]

const TestimonialCard = ({ testimonial, isActive }: { testimonial: TestimonialProps; isActive: boolean }) => {
  return (
    <div className={`transition-all duration-500 h-full ${isActive ? "opacity-100 scale-100" : "opacity-70 scale-95"}`}>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden h-full flex flex-col justify-between min-h-[320px]">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 text-cyan-500/20">
          <Quote className="w-12 h-12" />
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>

          {/* Content */}
          <blockquote className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10 flex-grow">
            "{testimonial.content}"
          </blockquote>
        </div>

        {/* Author */}
        <div className="flex items-center mt-auto">
          <img
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.author}
            className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-cyan-500/30"
          />
          <div>
            <h4 className="font-semibold text-white text-lg">{testimonial.author}</h4>
            <p className="text-gray-400 text-sm">{testimonial.role}</p>
            <p className="text-cyan-400 text-sm font-medium">{testimonial.company}</p>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none"></div>
      </div>
    </div>
  )
}

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden" id="testimonials" ref={sectionRef}>
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="section-container opacity-0 animate-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-6 text-white">Loved by Developers Worldwide</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of developers who have transformed their collaboration experience
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
            <div className="flex justify-between items-center absolute top-1/2 left-[-4.5rem] right-[-4.5rem] -translate-y-1/2 w-[calc(100%+9rem)] pointer-events-none">
              <div className="flex items-center h-full">
              <button
                onClick={prevTestimonial}
                className="pointer-events-auto z-10 w-14 h-14 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              </div>
              <div className="flex items-center h-full">
              <button
                onClick={nextTestimonial}
                className="pointer-events-auto z-10 w-14 h-14 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
              </div>
            </div>

          {/* Testimonial Cards */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard testimonial={testimonial} isActive={index === currentIndex} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-cyan-500 scale-125" : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
