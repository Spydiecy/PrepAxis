import {
  Activity,
  BarChart,
  FileText,
  Mic,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

// Navigation items
export const NAVIGATION_ITEMS = [
  { title: "FEATURES", href: "#features" },
  { title: "PRICING", href: "#pricing" },
] as const;

// Hero section labels
export const HERO_LABELS = [
  { icon: Sparkles, label: "AI-Powered Feedback" },
  { icon: Mic, label: "Voice & Text Interviews" },
  { icon: Activity, label: "Real-time Analytics" },
] as const;

// Featured features
export const FEATURES = [
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
] as const;

// Pricing plans
export const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for beginners",
    features: [
      "5 mock interviews per month",
      "Resume analysis",
      "Basic feedback",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For serious learners",
    features: [
      "Unlimited mock interviews",
      "Advanced resume analysis",
      "AI-powered detailed feedback",
      "Priority email support",
      "Interview performance analytics",
      "STAR method masterclass",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams & organizations",
    features: [
      "Everything in Professional",
      "Team management",
      "Custom integrations",
      "24/7 phone support",
      "Dedicated account manager",
      "API access",
    ],
    highlighted: false,
  },
] as const;

// Hero title words
export const HERO_TITLE_WORDS = [
  "MASTER",
  "YOUR",
  "INTERVIEWS",
  "WITH",
  "AI",
  "COACHING",
] as const;

// Color constants
export const PRIMARY_COLOR = "#FF6B2C";
