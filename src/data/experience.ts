import { ExperienceItem } from "@/types";

export const experiences: ExperienceItem[] = [
  {
    role: "Software Engineering Intern",
    organization: "Aaditya Technologies",
    location: "Mumbai, India",
    start: "January 2025",
    end: "July 2025",
    summary: "Python/Next.js backend services, JWT-secured APIs, microservices, Docker, AWS, and CI/CD.",
    bullets: [
      "Developed backend services in Python and Next.js API routes integrated with MySQL, optimizing relational database schemas and SQL queries for performance and reliability, reducing average response time by 22%",
      "Built secure REST APIs with JWT authentication and role-based access control, improving inter-module communication and application security through structured logging",
      "Containerized 4 services using Docker and deployed to AWS, managing build and deployment workflows with Git and GitHub to maintain environment consistency and reduce deployment friction",
      "Shipped 10 production-ready features across backend APIs, web application and dashboard modules, writing tests, managing integration and supporting cloud releases on AWS",
    ],
  },
  {
    role: "Web Development Intern",
    organization: "Creative Line",
    location: "Mumbai, India",
    start: "June 2024",
    end: "September 2024",
    summary: "Next.js performance optimization, API route automation, and reliability-focused delivery.",
    bullets: [
      "Refactored 7 reusable components across 3 features, reducing per-file code by nearly 70% and eliminating component coupling",
      "Developed and tested Next.js API routes with error handling and caching optimizations, improving integration reliability and application performance between frontend and backend services",
      "Integrated MySQL database with Next.js API routes, designing queries for efficient data retrieval, improving data retrieval speed by 23%, and wrote 2-3 unit tests to validate critical data flows",
      "Implemented API integrations across the stack following clean architecture and modular design principles, improving long-term maintainability and supporting new feature development",
    ],
  },
];

