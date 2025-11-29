// safehands/src/context/QuarantineContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../utils/auth';
import { onExposureUpdateForUser } from '../utils/database';
import { auth } from '../firebase';

export const QuarantineContext = createContext({
  isQuarantined: false,
});

export const useQuarantine = () => useContext(QuarantineContext);

export const QuarantineProvider = ({ children }) => {
  const [isQuarantined, setIsQuarantined] = useState(false);

  useEffect(() => {
    const handleAuthChange = (user) => {
      if (user) {
        const unsubscribe = onExposureUpdateForUser(user.uid, (exposureData) => {
          if (exposureData && exposureData.status === 'active') {
            setIsQuarantined(true);
          } else {
            setIsQuarantined(false);
          }
        });
        return unsubscribe;
      } else {
        setIsQuarantined(false);
      }
    };

    const unsubscribeAuth = auth.onAuthStateChanged(handleAuthChange);

    return () => {
      unsubscribeAuth();
    };
  }, []);
  
  const value = { isQuarantined };

  return (
    <QuarantineContext.Provider value={value}>
      {children}
    </QuarantineContext.Provider>
  );
};
