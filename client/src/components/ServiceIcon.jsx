import React from 'react';
import { 
  Laptop, 
  Code, 
  ShoppingBag, 
  Layout, 
  Server, 
  Database 
} from 'lucide-react';

export const IconMap = {
  Laptop: Laptop,
  Code: Code,
  LaptopCode: Laptop,
  ShoppingBag: ShoppingBag,
  Layout: Layout,
  Server: Server,
  Database: Database
};

export const ServiceIcon = ({ name, className = "w-4 h-4" }) => {
  const Component = IconMap[name] || Code;
  return <Component className={className} />;
};

export default ServiceIcon;
