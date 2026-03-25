import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";

const useTimer = (expiryTimestamp: number) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryTimestamp - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor(diff / (1000 * 60 * 60)) / (1000 * 60);

      setTimeLeft(`${h}h ${m}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // every min
    return () => clearInterval(interval);
  }, [expiryTimestamp]);
};

export default useTimer;
