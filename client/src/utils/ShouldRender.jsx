import EmployeeHeader from '../components/shared/EmployeeHeader';
import Footer from '../components/shared/Footer';
import Header from '../components/shared/Header';

const eCommersRoutesWithHeaderAndFooter = [
  'home',
  'about',
  'contact-us',
  'services',
  'store',
  'product',
  'bag',
  'profile',
  'favourites',
  'checkout',
  'history',
];

const routesWithEmployeeHeader = [
  'inventory',
  'presenter',
  'engineer',
  'factory',
  'operator',
  'actor',
];

export const shouldRenderECommersHeader = (location) => {
  let flag;
  const firstPath = location?.pathname.split('/')[1];
  flag = eCommersRoutesWithHeaderAndFooter.includes(firstPath);
  return flag ? <Header /> : null;
};

export const shouldRenderECommersFooter = (location) => {
  let flag;
  const firstPath = location?.pathname.split('/')[1];
  flag = eCommersRoutesWithHeaderAndFooter.includes(firstPath);
  return flag ? <Footer /> : null;
};

export const shouldRenderEmployeeHeader = (location, socket, setSocket) => {
  let flag;
  const firstPath = location?.pathname.split('/')[1];
  flag = routesWithEmployeeHeader.includes(firstPath);
  // console.log(socket?.id);
  return flag ? <EmployeeHeader soket={socket} setSocket={setSocket} /> : null;
};
