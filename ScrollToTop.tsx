// components/ScrollToTop.tsx

import React, { useEffect, useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ScrollToTopProps {
  threshold?: number; // Optional: Customize when the button appears (scrollY value)
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ threshold = 100 }) => {
  const [visible, setVisible] = useState(false);

  // Toggle visibility based on scroll position
  const handleScroll = () => {
    setVisible(window.scrollY > threshold);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Zoom in={visible}>
      <Fab
        color="primary"
        size="small"
        onClick={scrollToTop}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16 
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;
