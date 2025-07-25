/*
	Installed from https://reactbits.dev/tailwind/
*/

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export const Card = forwardRef(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  )
);
Card.displayName = "Card";

const makeSlot = (
  i,
  distX,
  distY,
  total
) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwap = forwardRef(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  firstSwapDelay = null, // NEW: Custom delay for first swap
  pauseOnHover = false,
  onCardClick,
  onSwap, // NEW: Callback when cards swap
  autoStart = true, // NEW: Control when to start swapping
  skewAmount = 6,
  easing = "elastic",
  children,
}, ref) => {
  const config =
    easing === "elastic"
      ? {
        ease: "elastic.out(0.6,0.9)",
        durDrop: 0.5,     // Reduced for faster animation
        durMove: 0.5,     // Reduced for faster animation
        durReturn: 0.5,   // Reduced for faster animation
        promoteOverlap: 0.9,
        returnDelay: 0.05,
      }
      : {
        ease: "power1.inOut",
        durDrop: 0.3,     // Reduced for faster animation
        durMove: 0.3,     // Reduced for faster animation
        durReturn: 0.3,   // Reduced for faster animation
        promoteOverlap: 0.45,
        returnDelay: 0.2,
      };

  const childArr = useMemo(
    () => Children.toArray(children),
    [children]
  );
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(
    Array.from({ length: childArr.length }, (_, i) => i)
  );

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);
  const swapFunction = useRef(null);

  // Expose start/stop methods to parent (simplified)
  useImperativeHandle(ref, () => ({
    startSwapping: () => {
      if (swapFunction.current && !intervalRef.current) {
        console.log('CardSwap: Starting swapping manually');
        const initialDelay = firstSwapDelay || delay;
        
        intervalRef.current = window.setTimeout(() => {
          if (swapFunction.current) {
            swapFunction.current();
            intervalRef.current = window.setInterval(swapFunction.current, delay);
          }
        }, initialDelay);
      }
    },
    stopSwapping: () => {
      console.log('CardSwap: Stopping swapping manually');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    },
    triggerSingleSwap: () => {
      if (swapFunction.current) {
        swapFunction.current();
      }
    }
  }));

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, cardDistance, verticalDistance, total),
        skewAmount
      )
    );

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return"
      );
      tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
      tl.to(
        elFront,
        {
          y: backSlot.y,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );

      tl.call(() => {
        order.current = [...rest, front];
        // NEW: Notify parent about the swap with the new front card index
        if (onSwap) {
          onSwap(rest[0]); // The new front card index
        }
      });
    };

    // Store swap function in ref for external access
    swapFunction.current = swap;

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  // Handle autoStart - simple and clean
  useEffect(() => {
    console.log('CardSwap: autoStart changed to', autoStart);
    
    if (autoStart && swapFunction.current && !intervalRef.current) {
      console.log('CardSwap: Auto-starting with firstSwapDelay:', firstSwapDelay || delay);
      
      // Call onSwap immediately for the initial state (index 0)
      if (onSwap) {
        onSwap(0);
      }
      
      // Start swapping after firstSwapDelay
      const initialDelay = firstSwapDelay || delay;
      intervalRef.current = window.setTimeout(() => {
        if (swapFunction.current) {
          console.log('CardSwap: Executing first swap');
          swapFunction.current();
          // Continue with regular intervals
          intervalRef.current = window.setInterval(swapFunction.current, delay);
        }
      }, initialDelay);
    }
    
    // Stop if autoStart becomes false
    if (!autoStart && intervalRef.current) {
      console.log('CardSwap: Stopping due to autoStart false');
      clearInterval(intervalRef.current);
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, [autoStart]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(child.props.style ?? {}) },
        onClick: (e) => {
          child.props.onClick?.(e);
          onCardClick?.(i);
        },
      }) : child
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
});

CardSwap.displayName = "CardSwap";

export default CardSwap;
