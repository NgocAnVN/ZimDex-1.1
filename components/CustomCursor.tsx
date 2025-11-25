
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

type CursorVariant = 'default' | 'pointer' | 'text' | 'wait' | 'grab' | 'grabbing' | 'not-allowed';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add class to body to hide default cursor
    document.body.classList.add('custom-cursor-active');

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      const cursor = computedStyle.cursor;

      // Priority based detection
      if (cursor === 'wait' || cursor === 'progress') {
        setCursorVariant('wait');
      } else if (cursor === 'not-allowed') {
        setCursorVariant('not-allowed');
      } else if (cursor === 'grab') {
        setCursorVariant('grab');
      } else if (cursor === 'grabbing') {
        setCursorVariant('grabbing');
      } else if (
        cursor === 'text' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable || 
        (target.tagName === 'INPUT' && !['submit', 'button', 'checkbox', 'radio', 'range', 'color', 'file', 'image'].includes((target as HTMLInputElement).type))
      ) {
        setCursorVariant('text');
      } else if (
        cursor === 'pointer' ||
        target.matches('button, a, [role="button"], .cursor-pointer') ||
        target.closest('button, a, [role="button"], .cursor-pointer')
      ) {
        setCursorVariant('pointer');
      } else {
        setCursorVariant('default');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  // Animation config
  const springTransition = { type: "spring" as const, stiffness: 500, damping: 28, mass: 0.5 };
  const textTransition = { type: "tween" as const, ease: "backOut" as const, duration: 0.15 };

  // Helper to determine variant visuals
  const isText = cursorVariant === 'text';
  const isPointer = cursorVariant === 'pointer';
  const isWait = cursorVariant === 'wait';
  const isGrab = cursorVariant === 'grab';
  const isGrabbing = cursorVariant === 'grabbing';
  const isNotAllowed = cursorVariant === 'not-allowed';

  return createPortal(
    <>
      {/* Main Cursor Shape (Dot / I-Beam) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999999] bg-white shadow-[0_0_2px_1px_rgba(0,0,0,0.3)]"
        animate={{
          x: mousePosition.x - (isText ? 2 : 5),
          y: mousePosition.y - (isText ? 10 : 5),
          height: isText ? 20 : 10,
          width: isText ? 4 : 10,
          borderRadius: isText ? 2 : "50%",
          scale: (isPointer || isWait || isNotAllowed) ? 0 : 1, // Hide dot for these states
        }}
        transition={textTransition}
        style={{ mixBlendMode: 'normal' }} 
      />
      
      {/* Outer Ring / Interaction Indicator */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[999998] flex items-center justify-center shadow-[0_0_4px_rgba(0,0,0,0.2)] rounded-full"
        animate={{
          x: mousePosition.x - (isPointer ? 24 : isWait ? 16 : isGrab ? 20 : isGrabbing ? 16 : isNotAllowed ? 12 : 10),
          y: mousePosition.y - (isPointer ? 24 : isWait ? 16 : isGrab ? 20 : isGrabbing ? 16 : isNotAllowed ? 12 : 10),
          width: isPointer ? 48 : isWait ? 32 : isGrab ? 40 : isGrabbing ? 32 : isNotAllowed ? 24 : 20,
          height: isPointer ? 48 : isWait ? 32 : isGrab ? 40 : isGrabbing ? 32 : isNotAllowed ? 24 : 20,
          
          // Styling
          backgroundColor: isPointer ? "rgba(255, 255, 255, 0.1)" : "transparent",
          borderColor: "white",
          borderWidth: isWait ? 3 : isGrabbing ? 3 : 1,
          
          // Wait Spinner Props
          borderTopColor: isWait ? "transparent" : "white",
          borderRightColor: "white",
          borderBottomColor: "white",
          borderLeftColor: "white",
          
          // Shape
          borderRadius: isNotAllowed ? "0%" : "50%",
          rotate: isWait ? 360 : isNotAllowed ? 45 : 0,
          
          opacity: isText ? 0 : 1,
          scale: isClicking && !isText ? 0.8 : 1,
        }}
        transition={
          isWait 
          ? { duration: 1, repeat: Infinity, ease: "linear" } 
          : springTransition
        }
        style={{
            borderStyle: 'solid',
            mixBlendMode: 'normal'
        }}
      >
         {/* Cross line for Not Allowed state */}
         {isNotAllowed && (
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="w-[140%] h-[2px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 shadow-sm" 
            />
         )}
      </motion.div>
    </>,
    document.body
  );
};
