'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProjectStore } from '@/lib/stores/project-store';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function HeroSidebar() {
  const { getCompletedProjects } = useProjectStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const completedProjects = getCompletedProjects();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || completedProjects.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % completedProjects.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, completedProjects.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % completedProjects.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + completedProjects.length) % completedProjects.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (completedProjects.length === 0) return null;

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      
    </div>
  );
}