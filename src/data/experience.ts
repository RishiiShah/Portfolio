import { ExperienceItem } from "@/types";

export const experiences: ExperienceItem[] = [
  {
    role: "Software Engineering Intern",
    organization: "Aaditya Technologies",
    location: "Mumbai, India",
    start: "Jan. 2025",
    end: "Jul. 2025",
    summary: "Backend services, REST APIs, microservices, Docker, AWS",
    bullets: [
      "Engineered and implemented backend services using Python, Next.js, and MySQL, developing modular APIs, refining database schema, and optimizing queries to improve data handling efficiency and reduce average response time by 22%.",
      "Rolled out secure REST APIs with JWT-based authentication, enabling seamless communication between modules, integrating error-handling and logging systems, and enhancing data reliability by 32% while reducing integration issues.",
      "Containerized and deployed scalable microservices using Docker and AWS, automating CI/CD workflows with GitHub Actions, improving deployment speed by 45%, ensuring consistent environments, and minimizing downtime during updates.",
    ],
  },
  {
    role: "Web Developer Intern",
    organization: "Creative Line",
    location: "Mumbai, India",
    start: "Jun. 2024",
    end: "Sep. 2024",
    summary: "Next.js optimization, API development, MySQL query optimization",
    bullets: [
      "Optimized a core Next.js app, reducing page load time by 18%, enhancing responsiveness via code-splitting, asset compression.",
      "Automated key data flows by building and testing Next.js API routes, reducing manual operations by 38%, and accelerated data retrieval by 23% through MySQL query optimization.",
      "Conducted testing, debugging, and documenting code, improving overall application reliability and helping reduce development issues by 15% and creating reusable documentation to enhance team workflow and efficiency.",
    ],
  },
];

