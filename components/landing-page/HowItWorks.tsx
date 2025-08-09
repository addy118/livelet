"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Users, Code, Rocket, Zap } from "lucide-react"

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(-1) // Changed to -1 so no card is active initially
  const sectionRef = useRef<HTMLDivElement>(null)

  const stepsData = [
    {
      id: 1,
      title: "Create Your Space",
      subtitle: "Instant Setup",
      description: "Launch your collaborative coding environment in seconds with intelligent room creation.",
      features: [
        "One-click room creation",
        "Smart privacy controls",
        "Team invitation system",
        "Custom workspace settings",
      ],
      icon: <Users className="w-8 h-8" />,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: 2,
      title: "Code Together",
      subtitle: "Real-time Magic",
      description:
        "Experience seamless collaboration with live cursors, instant sync, and intelligent conflict resolution.",
      features: ["Live cursor tracking", "Real-time code sync", "Smart conflict resolution", "Multi-language support"],
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-purple-500",
    },
    {
      id: 3,
      title: "Execute & Deploy",
      subtitle: "Instant Results",
      description: "Run code instantly across 5+ languages and deploy with seamless CI/CD integration.",
      features: ["Instant code execution", "Multi-language runtime", "One-click deployment", "CI/CD integration"],
      icon: <Rocket className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
    },
  ]

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

  const handleStepHover = (stepIndex: number) => {
    setActiveStep(stepIndex)
  }

  const handleStepLeave = () => {
    setActiveStep(-1) // Reset to no active card
  }

  return (
    <section className="py-32 bg-gray-950 relative overflow-hidden" id="how-it-works" ref={sectionRef}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-20 opacity-0 fade-in-stagger">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            How Livelet Works
          </div>
          <h2 className="section-title mb-6 text-white">
            From Idea to
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              Deployment
            </span>
          </h2>
          <p className="section-subtitle mx-auto text-gray-400">
            Experience the future of collaborative development with our innovative three-step workflow
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {stepsData.map((step, index) => {
              const isActive = activeStep === index

              return (
                <div
                  key={step.id}
                  className="relative opacity-0 fade-in-stagger cursor-pointer group transition-all duration-700 ease-out"
                  onMouseEnter={() => handleStepHover(index)}
                  onMouseLeave={handleStepLeave}
                  style={{ animationDelay: `${0.1 * (index + 2)}s` }}
                >
                  {/* Step Card */}
                  <div
                    className={cn(
                      "relative rounded-3xl p-8 border transition-all duration-500 bg-gray-900/50 backdrop-blur-sm",
                      isActive
                        ? "border-cyan-500/50 shadow-2xl shadow-cyan-500/10 scale-105"
                        : "border-gray-800/50 hover:border-cyan-500/30",
                    )}
                  >
                    {/* Active Glow Effect - Only when hovered */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>
                    )}

                    {/* Step Content */}
                    <div className="relative z-10">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
                          isActive
                            ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                            : "bg-gray-800 text-gray-400 group-hover:bg-gray-700",
                        )}
                      >
                        {step.icon}
                      </div>

                      {/* Step Info */}
                      <div className="mb-6">
                        <div className="flex items-center mb-2">
                          <span
                            className={cn(
                              "text-xs font-bold px-3 py-1 rounded-full",
                              isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-800 text-gray-500",
                            )}
                          >
                            STEP {step.id}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p
                          className={cn(
                            "font-medium text-sm mb-4 transition-colors duration-300",
                            isActive ? "text-cyan-400" : "text-gray-500",
                          )}
                        >
                          {step.subtitle}
                        </p>
                        <p className="text-gray-300 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-400">
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-300",
                                isActive ? "bg-cyan-400" : "bg-gray-600",
                              )}
                            ></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step Indicator (Mobile) */}
                  <div className="lg:hidden flex justify-center mt-4">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors duration-300",
                        isActive ? "bg-cyan-400" : "bg-gray-600",
                      )}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
