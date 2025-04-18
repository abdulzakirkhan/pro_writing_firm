// context/TitleContext.tsx
import { createContext, useContext, useState } from 'react';

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const TitleContext = createContext<TitleContextType>({
  title: 'Dashboard',
  setTitle: () => {},
});

export const useTitle = () => useContext(TitleContext);

export const TitleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [title, setTitle] = useState("");
  
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};