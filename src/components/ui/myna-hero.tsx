"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart,
  Bird,
  Menu,
  Sparkles,
  Zap,
  Mic,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "./button";

const navigationItems = [
  { title: "FEATURES", href: "#features" },
  { title: "HOW IT WORKS", href: "#how-it-works" },
  { title: "PRICING", href: "#pricing" },
  { title: "ABOUT", href: "#about" },
];

const labels = [
  { icon: Sparkles, label: "AI-Powered Feedback" },
  { icon: Mic, label: "Voice & Text Interviews" },
  { icon: Activity, label: "Real-time Analytics" },
];

const features = [
  {
    icon: BarChart,
    label: "Performance Tracking",
    description: "Track your progress with detailed interview reports and analytics.",
  },
  {
    icon: Mic,
    label: "Mock Interviews",
    description: "Practice with realistic interview scenarios powered by AI.",
  },
  {
    icon: FileText,
    label: "Resume Analysis",
    description: "Get personalized suggestions to improve your resume.",
  },
  {
    icon: TrendingUp,
    label: "Skill Development",
    description: "Focus on areas that need improvement with targeted feedback.",  
  },
  {
    icon: Zap,
    label: "Instant Feedback",
    description: "Receive immediate insights after each practice session.",
  },
  {
    icon: Activity,
    label: "Interview Preparation",
    description: "Master the STAR method and behavioral interview techniques.",
  },
];

export function MynaHero() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const titleWords = [
    "MASTER",
    "YOUR", 
    "INTERVIEWS",
    "WITH",
    "AI",
    "COACHING",
  ];

  return (
    <div className="container mx-auto px-4 min-h-screen bg-background">
      {/* Header/Navigation */}
      <header>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Bird className="h-8 w-8 text-[#FF6B2C]" />
              <span className="font-mono text-xl font-bold">PrepAxis</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors cursor-pointer"
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Desktop CTA & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              className="rounded-none hidden md:inline-flex bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-6 mt-6">
                  {navigationItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="text-sm font-mono text-foreground hover:text-[#FF6B2C] transition-colors cursor-pointer"
                    >
                      {item.title}
                    </a>
                  ))}
                  <Button className="cursor-pointer rounded-none bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono w-full" onClick={() => window.scrollTo(0, 0)}>
                    GET STARTED <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container py-24">
          <div className="flex flex-col items-center text-center">
            {/* Main Title */}
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto leading-tight"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15, 
                    duration: 0.6 
                  }}
                  className="inline-block mx-2 md:mx-4"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-xl text-foreground font-mono"
            >
              Practice interviews with AI feedback, analyze your resume, and ace your next opportunity.
            </motion.p>

            {/* Feature Labels */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              {labels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 1.8 + (index * 0.15), 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                  className="flex items-center gap-2 px-6"
                >
                  <feature.icon className="h-5 w-5 text-[#FF6B2C]" />
                  <span className="text-sm font-mono">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 2.4, 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            >
              <Button
                size="lg"
                className="cursor-pointer rounded-none mt-12 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
              >
                START FREE TRIAL <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 3.0, 
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="text-center text-4xl font-mono font-bold mb-6"
            id="features"
          >
            Everything You Need to Succeed
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 3.2 + (index * 0.2), 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                className="flex flex-col items-center text-center p-8 bg-background border rounded-lg hover:border-[#FF6B2C] transition-colors"
              >
                <div className="mb-6 rounded-full bg-[#FF6B2C]/10 p-4">
                  <feature.icon className="h-8 w-8 text-[#FF6B2C]" />
                </div>
                <h3 className="mb-4 text-xl font-mono font-bold">
                  {feature.label}
                </h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.0, duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6">
              Ready to transform your interview skills?
            </h2>
            <Button
              size="lg"
              className="cursor-pointer rounded-none bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 font-mono"
            >
              START YOUR FREE TRIAL <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-mono text-muted-foreground">
            © 2024 PrepAxis. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <button className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Privacy
            </button>
            <button className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Terms
            </button>
            <button className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
