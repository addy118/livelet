import type React from "react"
import { Github, Twitter, Linkedin } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="section-container">
        <div className="py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Left Section */}
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <img src="/LiveletWhite.svg" alt="Livelet" className="h-8 w-auto" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The future of collaborative coding. Build amazing projects together with real-time synchronization and
                seamless team integration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right Section */}
            <div className="text-gray-400">
              <p className="text-lg">Made with ❤️ by developers, for developers</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Livelet. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
