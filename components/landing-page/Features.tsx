"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Code, Lock, Globe, Zap, Shield, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)

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

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(
        "feature-card glass-card opacity-0 p-4 sm:p-6 bg-gray-800/50 border border-gray-700/50",
        "lg:hover:bg-gradient-to-br lg:hover:from-gray-800/70 lg:hover:to-cyan-900/20",
        "transition-all duration-300 group",
      )}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-cyan-400 mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">{title}</h3>
      <p className="text-gray-300 text-sm sm:text-base">{description}</p>
    </div>
  )
}

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element")
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in")
              }, index * 100)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section className="py-12 sm:py-16 md:py-20 pb-0 relative bg-gray-900" id="features" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="section-title mb-3 sm:mb-4 opacity-0 fade-in-element text-white">
            Powerful Features <br className="hidden sm:block" />
            for Seamless Collaboration
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <FeatureCard
            icon={<Zap className="text-purple-400 mt-1" />}
            title="Live Code Collaboration"
            description="Write, edit, and debug code together in real time — no refresh, no lag."
            index={0}
          />
          <FeatureCard
            icon={<Code className="text-green-400 mt-1" />}
            title="Multi-Language Support"
            description="Supports 5 major languages with intelligent syntax highlighting and autocompletion."
            index={1}
          />
          <FeatureCard
            icon={<Lock className="text-red-400 mt-1" />}
            title="Secure Authentication"
            description="Auth.js with Google/GitHub sign-in, email verification & OTPs for sensitive actions."
            index={2}
          />
          <FeatureCard
            icon={<Shield className="text-pink-400 mt-1" />}
            title="Role-Based Access Control"
            description="Assign roles (Owner, Editor, Viewer) and manage permissions per room."
            index={3}
          />
          <FeatureCard
            icon={<Globe className="text-blue-400 mt-1" />}
            title="Public & Private Rooms"
            description="Host your sessions with custom visibility and secure collaboration settings."
            index={4}
          />
          <FeatureCard
            icon={<Eye className="text-fuchsia-400 mt-1" />}
            title="Live Cursor Presence"
            description="See collaborators' cursors and selections in real-time for precise communication."
            index={5}
          />
        </div>
      </div>
    </section>
  )
}

export default Features
