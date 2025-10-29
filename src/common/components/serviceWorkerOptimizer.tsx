import { useEffect } from 'react';

interface ServiceWorkerOptimizerProps {
  delay?: number;
}

const ServiceWorkerOptimizer = ({ delay = 5000 }: ServiceWorkerOptimizerProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return null;
};

export default ServiceWorkerOptimizer;
