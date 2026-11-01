"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface EffectContextType {
  clickEffect: boolean;
  mouseTrail: boolean;
  seasonalEffect: boolean;
  yinghuaEffect: boolean;
  sparkleEffect: boolean;
  toggleClickEffect: () => void;
  toggleMouseTrail: () => void;
  toggleSeasonalEffect: () => void;
  toggleyinghuaEffect: () => void;
  toggleSparkleEffect: () => void;
}

const EffectContext = createContext<EffectContextType>({
  clickEffect: true,
  mouseTrail: false,
  seasonalEffect: false,
  yinghuaEffect: false,
  sparkleEffect: false,
  toggleClickEffect: () => {},
  toggleMouseTrail: () => {},
  toggleSeasonalEffect: () => {},
  toggleSparkleEffect: () => {},
  toggleyinghuaEffect: () => {},
});

export function EffectProvider({ children }: { children: ReactNode }) {
  const [clickEffect, setClickEffect] = useState(true);
  const [mouseTrail, setMouseTrail] = useState(false);
  const [seasonalEffect, setSeasonalEffect] = useState(false);
  const [yinghuaEffect, setYinghuaEffect] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);

  // 从 localStorage 恢复状态
  useEffect(() => {
    const savedClick = localStorage.getItem("clickEffect");
    const savedTrail = localStorage.getItem("mouseTrail");
    const savedSeasonal = localStorage.getItem("seasonalEffect");
    const savedSparkle = localStorage.getItem("sparkleEffect");
    const savedYinghua = localStorage.getItem("yinghuaEffect");
        
    if (savedClick !== null) setClickEffect(savedClick === "true");
    if (savedTrail !== null) setMouseTrail(savedTrail === "true");
    if (savedSeasonal !== null) setSeasonalEffect(savedSeasonal === "true");
    if (savedYinghua !== null) setYinghuaEffect(savedYinghua === "true");
    if (savedSparkle !== null) setSparkleEffect(savedSparkle === "true");
    
  }, []);

  const toggleClickEffect = () => {
    setClickEffect((prev) => {
      localStorage.setItem("clickEffect", String(!prev));
      return !prev;
    });
  };

  const toggleMouseTrail = () => {
    setMouseTrail((prev) => {
      localStorage.setItem("mouseTrail", String(!prev));
      return !prev;
    });
  };

  const toggleSeasonalEffect = () => {
    setSeasonalEffect((prev) => {
      localStorage.setItem("seasonalEffect", String(!prev));
      return !prev;
    });
  };

  const toggleyinghuaEffect = () => {
    setYinghuaEffect((prev) => {
      localStorage.setItem("yinghuaEffect", String(!prev));
      return !prev;
    });
  };

  const toggleSparkleEffect = () => {
    setSparkleEffect((prev) => {
      localStorage.setItem("sparkleEffect", String(!prev));
      return !prev;
    });
  };

  return (
    <EffectContext.Provider value={{ clickEffect, mouseTrail, seasonalEffect, yinghuaEffect, sparkleEffect, toggleClickEffect, toggleMouseTrail, toggleSeasonalEffect, toggleyinghuaEffect, toggleSparkleEffect }}>           
      {children}
    </EffectContext.Provider>
  );
}

export function useEffects() {
  return useContext(EffectContext);
}
