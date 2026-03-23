import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bird, Menu, CheckCircle2 } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Button } from "./button";
import {
  NAVIGATION_ITEMS,
  HERO_LABELS,
  FEATURES,
  PRICING_PLANS,
  HERO_TITLE_WORDS,
  PRIMARY_COLOR,
} from "./constants";

// Navigation Component
function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Bird className="h-8 w-8" style={{ color: PRIMARY_COLOR }} />
          <span className="font-mono text-xl font-bold">PrepAxis</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAVIGATION_ITEMS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-sm font-mono transition-colors hover:text-[#FF6B2C]"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button className="hidden md:inline-flex rounded-none font-mono">
              GET STARTED <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-6 mt-6">
                {NAVIGATION_ITEMS.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="text-sm font-mono transition-colors hover:text-[#FF6B2C]"
                  >
                    {item.title}
                  </a>
                ))}
                <Link to="/login" className="block">
                  <Button className="w-full rounded-none font-mono">
                    GET STARTED <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-32">
      <div className="flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl leading-tight"
        >
          {HERO_TITLE_WORDS.map((text, index) => (
            <motion.span
              key={text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
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
          className="mt-8 max-w-2xl text-xl font-mono text-muted-foreground"
        >
          Practice interviews with AI feedback, analyze your resume, and ace your next opportunity.
        </motion.p>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          {HERO_LABELS.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.8 + index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="flex items-center gap-2 px-6"
            >
              <feature.icon className="h-5 w-5" style={{ color: PRIMARY_COLOR }} />
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
          }}
        >
          <Link to="/login">
            <Button size="lg" className="mt-12 rounded-none font-mono">
              TRY NOW <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className="container mx-auto px-4 py-32" ref={ref} id="features">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="text-center text-4xl font-mono font-bold mb-16"
      >
        Everything You Need to Succeed
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            className="flex flex-col items-center text-center p-8 border rounded-lg transition-colors hover:border-[#FF6B2C]"
          >
            <div className="mb-6 rounded-full p-4" style={{ backgroundColor: `${PRIMARY_COLOR}15` }}>
              <feature.icon className="h-8 w-8" style={{ color: PRIMARY_COLOR }} />
            </div>
            <h3 className="mb-4 text-xl font-mono font-bold">{feature.label}</h3>
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// Pricing Section Component
function PricingSection() {
  return (
    <section className="container mx-auto px-4 py-32" id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg font-mono text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for your interview preparation journey
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {PRICING_PLANS.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            className={`relative rounded-lg p-8 border transition-all flex flex-col ${
              plan.highlighted
                ? "border-[#FF6B2C] scale-105"
                : "border-gray-200 hover:border-[#FF6B2C]/50"
            }`}
            style={plan.highlighted ? { backgroundColor: `${PRIMARY_COLOR}08` } : {}}
          >
            {plan.highlighted && (
              <div className="absolute top-4 right-4 bg-[#FF6B2C] text-white font-mono text-xs px-3 py-1 rounded-full">
                POPULAR
              </div>
            )}

            <h3 className="text-2xl font-mono font-bold mb-2">{plan.name}</h3>
            <p className="text-sm font-mono text-muted-foreground mb-4">{plan.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-mono font-bold">{plan.price}</span>
              <span className="text-sm font-mono text-muted-foreground">{plan.period}</span>
            </div>

            <Link to="/login" className="w-full block">
              <Button
                className="w-full rounded-none font-mono mb-8"
                variant={plan.highlighted ? "default" : "outline"}
              >
                Get Started
              </Button>
            </Link>

            <div className="space-y-3 flex-grow">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: PRIMARY_COLOR }} />
                  <span className="text-sm font-mono">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="container mx-auto px-4 py-40 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6">
          Ready to transform your interview skills?
        </h2>
        <Link to="/login">
          <Button size="lg" className="rounded-none font-mono">
            LAUNCH APP <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="border-t py-12 mt-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm font-mono text-muted-foreground">
          © 2026 PrepAxis. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <button className="text-sm font-mono text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </button>
          <button className="text-sm font-mono text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </button>
          <button className="text-sm font-mono text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}

// Main Component
export function MynaHero() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
