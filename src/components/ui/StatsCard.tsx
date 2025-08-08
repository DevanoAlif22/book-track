import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color,
  index,
}) => (
  <div
    className="bg-theme-card rounded-xl shadow-sm border border-theme p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    data-aos="flip-up"
    data-aos-delay={index * 200}
    data-aos-duration="600"
  >
    <div className="flex items-center space-x-4">
      <div
        className={`p-3 rounded-full ${color} transform transition-transform duration-300 hover:scale-110`}
        data-aos="zoom-in"
        data-aos-delay={index * 200 + 300}
      >
        {icon}
      </div>
      <div>
        <h3
          className="font-semibold text-theme-primary"
          data-aos="fade-right"
          data-aos-delay={index * 200 + 400}
        >
          {title}
        </h3>
        <p
          className="text-2xl font-bold text-theme-primary"
          data-aos="fade-up"
          data-aos-delay={index * 200 + 500}
        >
          {value}
        </p>
        <p
          className="text-sm text-theme-muted"
          data-aos="fade-left"
          data-aos-delay={index * 200 + 600}
        >
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

export default StatsCard;
