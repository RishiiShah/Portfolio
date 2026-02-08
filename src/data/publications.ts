import { PublicationItem } from "@/types";

export const publications: PublicationItem[] = [
  {
    title: "Intelligent Traffic Surveillance: A Vision-Based System for Detecting Traffic Rule Violations",
    venue: "2nd International Conference on Integration of Computatonal Inteliigent System",
    year: 2025,
    authors: ["Harsh Samant", "Kush Doshi", "Rishabh Shah", "Shreevardhan Bhosale", "Dashrath Kale"],
    abstract: "Developed a vision-based system using YOLOv12 and OCR to automate traffic violation detection, achieving 93.76% accuracy.",
    featured: false,
    links: [],
  },
  {
    title: "Bridging Financial Data Gaps with WGAN-GP: Generating Synthetic Time Series for Robust Models",
    venue: "1st International Conference on Next-Generation AI & ML",
    year: 2025,
    authors: ["Rishabh Shah", "Fayed Hakim", "Armaan Attar", "Harsh Samant", "Nilesh Patil", "Chinmay Raut"],
    abstract: "Research on using Wasserstein GAN with Gradient Penalty (WGAN-GP) to generate synthetic financial time series data for improving model robustness and addressing data scarcity challenges in financial modeling.",
    featured: true,
    links: [],
  },
  {
    title: "JARVIS: Voice Assistant with Smart Home Automation",
    venue: "International Conference on STEM for Sustainable Development 2025",
    year: 2025,
    authors: ["Rishabh Shah", "Alan George", "Yukta Saraf", "Rujuta Jariwala"],
    abstract: "Designed and deployed a voice-controlled IoT automation system using LLMs and Raspberry Pi to simplify daily routines.",
    featured: false,
    links: [
      { label: "Paper", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141" },
      { label: "Journal", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf" },
    ],
  },
];


