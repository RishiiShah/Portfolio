import { PublicationItem } from "@/types";

export const publications: PublicationItem[] = [
  {
    title: "Intelligent Traffic Surveillance: A Vision-Based System for Detecting Traffic Rule Violations",
    venue: "2nd International Conference on Integration of Computatonal Inteliigent System",
    year: 2025,
    publishedAt: "September 2025",
    authors: ["Harsh Samant", "Kush Doshi", "Rishabh Shah", "Shreevardhan Bhosale", "Dashrath Kale"],
    abstract: "India’s vast and growing urban population has increased the number of vehicles on the road. Traditional traffic monitoring is quite slow and inefficient as it relies heavily on manual oversight, which is more prone to delays and mistakes for ensuring compliance with traffic laws. This paper proposes an intelligent, vision-based traffic surveillance system designed to automatically detect and classify and report violations like red light jumping, speeding, helmet-less riding, lack of valid insurance, and non-compliance of pollution control. The system is utilizing a custom-trained state-of-the-art object detection algorithm, especially YOLOv12 (You Only Look Once). It integrates real-time object tracking with license plate extraction with vision-based models and Optical Character Recognition (OCR) while delivery of the challan is achieved via an API backend. Experimental testing and evaluations have an accuracy of 93.76% overall across multiple test cases. The results showcase a potential to enhance traffic law enforcement and improve overall road safety.",
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
    abstract: "The inherent inconsistencies and scarcity of data in time series datasets, particularly in stock prices, pose significant challenges to time-series models due to random fluctuations in the prices, causing problems in prediction and classification of the rare events. To address these limitations, we propose a methodology to synthesize time series data using a Wasserstein Generative Adversarial Network with Gradient Penalty (WGAN-GP) demonstrating the ability to recreate real-world data and augment available datasets. Through this framework, we enhanced the predictive capabilities of models by 0.9% in the accuracy, leading to more reliable forecasting outcomes and improved event classification, including the identification of rare events such as recessions or pandemics.",
    featured: true,
    links: [],
  },
  {
    title: "JARVIS: Voice Assistant with Smart Home Automation",
    venue: "International Conference on STEM for Sustainable Development 2025",
    year: 2025,
    publishedAt: "June 2025",
    authors: ["Rishabh Shah", "Alan George", "Yukta Saraf", "Rujuta Jariwala"],
    abstract: "This paper explores the integration of virtual assistant technology with home automation systems. The voice assistant JARVIS leverages natural language processing to understand user requests and perform tasks such as information retrieval from Wikipedia, open YouTube, and perform mathematical calculations and manage alarms. It answers user queries using LLM models and simplifies daily routines, thereby revolutionizing our interaction with the technology in our homes. We utilize various artificial intelligence (AI) and natural language processing (NLP) libraries for improving speech recognition of our system. Our setup involves using Raspberry Pi 3B+ to link with IoT devices and sending signals over the Internet for home automation. We prioritize the security of the user by ensuring that the data does not get stored in the cache memory. This research takes a thorough look at how we can blend virtual assistant technology into home automation systems to make living spaces more accessible to users.",
    featured: false,
    links: [
      { type: "paper", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf#page=141" },
      { type: "journal", url: "https://www.researchgate.net/profile/Vijay-Shelake/publication/393335295_Next-Gen_Predictive_Maintenancepage310_320/links/686616a5e4632b045dc9754a/Next-Gen-Predictive-Maintenancepage310-320.pdf" },
    ],
  },
];


