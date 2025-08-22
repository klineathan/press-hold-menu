import { useMenu } from '../contexts/MenuContext';
import Menu from './Menu';
import MenuIteration1 from './MenuIteration1';
import MenuIteration2 from './MenuIteration2';
import MenuIteration3 from './MenuIteration3';
import MenuIteration4 from './MenuIteration4';

function DynamicMenu() {
  const { activeMenuIteration } = useMenu();

  // Return the appropriate menu component based on the active iteration
  switch (activeMenuIteration) {
    case 1:
      return <MenuIteration1 />;
    case 2:
      return <MenuIteration2 />;
    case 3:
      return <MenuIteration3 />;
    case 4:
      return <MenuIteration4 />;
    default:
      return <Menu />; // Default menu
  }
}

export default DynamicMenu;