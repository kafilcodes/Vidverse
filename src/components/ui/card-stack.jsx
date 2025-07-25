"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

let interval;

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards];
        // move the last element to the front
        newArray.unshift(newArray.pop());
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-[480px] w-[90vw] max-w-[700px]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="benefit-card absolute left-1/2 top-1/2 w-full h-[480px]"
            style={{
              transformOrigin: "center center",
            }}
            animate={{
              x: "-50%",
              y: "-50%",
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="benefit-card-inner flex flex-col items-center justify-center text-center p-8">
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
