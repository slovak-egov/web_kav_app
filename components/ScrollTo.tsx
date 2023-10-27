import React from 'react';

export const scrollToAction = (ref) => {
  setTimeout(() => ref?.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 10);
};

const ScrollTo = React.forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <div className="relative">
      <div ref={ref} className="absolute block h-4 -z-10 bottom-0" />
    </div>
  );
});

export default ScrollTo;
