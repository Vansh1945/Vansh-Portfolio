import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const marqueeStyle = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee-infinite {
    display: flex;
    width: max-content;
    animation: marquee 30s linear infinite;
  }
  .animate-marquee-infinite:hover {
    animation-play-state: paused;
  }
`;

const SkillsStrip = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${API_URL}skills`);
        if (res.data && res.data.success) {
          setSkills(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading || skills.length === 0) {
    return null; // hide or return loading skeleton if empty
  }

  // Duplicate skills list to make a seamless infinite loop marquee
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <section className="py-6 bg-transparent border-y border-gray-100/60 overflow-hidden relative w-full">
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />
      
      <div className="relative w-full flex items-center overflow-hidden">
        {/* Infinite scrolling marquee wrapper */}
        <div className="animate-marquee-infinite flex items-center gap-5">
          {duplicatedSkills.map((skill, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-transparent px-5 py-2 select-none min-w-[130px] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img
                  src={skill.logo}
                  alt={skill.name}
                  className="max-w-full max-h-full object-contain"
                  draggable="false"
                />
              </div>
              <span className="text-xs font-bold text-gray-700 tracking-wide whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsStrip;
