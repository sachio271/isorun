"use client";

import Image from "next/image";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
};

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/30 backdrop-blur-sm">
    <div className="animate-bounce">
      <Image
        src="/logo.png"
        alt="Loading logo"
        width={130}
        height={130}
        priority
      />
    </div>
  </div>
);
