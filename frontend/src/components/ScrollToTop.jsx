import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import useScrollState from '../hooks/useScrollState';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { scrollY, isAtTop } = useScrollState();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    // Show button when scrolled down more than 300px
    setShowButton(scrollY > 300 && !isAtTop);
  }, [scrollY, isAtTop]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 left-8 z-50 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group"
      aria-label="Scroll to top"
    >
      <FontAwesomeIcon 
        icon={faArrowUp} 
        className="text-[23px] group-hover:-translate-y-0.5 transition-transform duration-300"
      />
    </button>
  );
};

export default ScrollToTop;
