import { PublicationItem } from "@/types";

export const publications: PublicationItem[] = [
  {
    title: "Intelligent Traffic Surveillance: A Vision-Based System for Detecting Traffic Rule Violations",
    venue: "2nd International Conference on Integration of Computatonal Inteliigent System",
    year: 2025,
    publishedAt: "September 2025",
    authors: ["Harsh Samant", "Kush Doshi", "Rishabh Shah", "Shreevardhan Bhosale", "Dashrath Kale"],
    abstract: "Developed a vision-based system using YOLOv12 and OCR to automate traffic violation detection, achieving 93.76% accuracy. This rigorous study involved processing over 100,000 traffic camera frames in real-time, tackling diverse weather and lighting conditions. We integrated advanced spatial-temporal tracking to differentiate between dynamic vehicular movements and static occlusions. The final production pipeline drastically minimized manual review throughput while providing interpretable bounding-box evidence for automated citation generation.",
    featured: false,
    links: [
      { type: "paper", url: "https://ieeexplore.ieee.org/document/11371065/" },
    ],
  },
  {
    title: "Bridging Financial Data Gaps with WGAN-GP: Generating Synthetic Time Series for Robust Models",
    venue: "1st International Conference on Next-Generation AI & ML",
    year: 2025,
    publishedAt: "August 2025",
    authors: ["Rishabh Shah", "Fayed Hakim", "Armaan Attar", "Harsh Samant", "Nilesh Patil", "Chinmay Raut"],
    abstract: "Designed a WGAN-GP generator with multi-head attention, dual TCN layers, stacked LSTMs and GRU trained on Apple stock data using AdamW over 3000 epochs with log returns and hybrid min-max and standard scaling preprocessing. Validated synthetic data quality with Pearson and Spearman correlations above 0.80 and R-squared above 0.63 across all price features including Open, High, Low, Close and Adjusted Close. Augmented real stock data with generated samples, improving downstream prediction model accuracy from 97.93% to 98.83%, demonstrating generalization gains for rare market events like recessions and global crises.",
    featured: true,
    links: [],
  },
  {
    title: "JARVIS: Voice Assistant with Smart Home Automation",
    venue: "International Conference on STEM for Sustainable Development 2025",
    year: 2025,
    publishedAt: "June 2025",
    authors: ["Rishabh Shah", "Alan George", "Yukta Saraf", "Rujuta Jariwala"],
    abstract: "Designed and deployed a voice-controlled IoT automation system using LLMs and Raspberry Pi to simplify daily routines.",
    featured: false,
    links: [
      { type: "paper", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141" },
      { type: "journal", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf" },
    ],
  },
];


