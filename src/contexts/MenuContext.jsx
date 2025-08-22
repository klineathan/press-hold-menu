import { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [activeMenuIteration, setActiveMenuIteration] = useState(null); // null means use default Menu

  const value = {
    activeMenuIteration,
    setActiveMenuIteration,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;