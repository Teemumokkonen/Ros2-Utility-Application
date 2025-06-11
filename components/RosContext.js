import React, { createContext, useContext, useState } from 'react';

const RosContext = createContext(null);

export const RosProvider = ({ children }) => {
  const [ros, setRos] = useState(null);
  return (
    <RosContext.Provider value={{ ros, setRos }}>
      {children}
    </RosContext.Provider>
  );
};

export const useRos = () => {
  const context = useContext(RosContext);
  if (!context) {
    throw new Error('useRos must be used within a RosProvider');
  }
  return context;
};
