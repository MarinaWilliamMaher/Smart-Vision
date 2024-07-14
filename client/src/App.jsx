import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ActorLayout,
  CustomerLayout,
  EngineerLayout,
  FactoryLayout,
  InventoryManagerLayout,
  OperatorLayout,
  PresenterLayout,
} from './utils/Layouts.jsx';
import axios from 'axios';

import {
  ContactUs,
  Profile,
  ProfileDetails,
  Home,
  AboutUs,
  Services,
  ChangePassword,
  Favourites,
  ProductDetails,
  DeleteAccountPage,
  Store,
  Bag,
  Checkout,
  History,
  ServicesDetails,
  AllReviews,
  // InventoryHome,
} from './pages/e-commers/index.js';
import {
  AddProduct,
  EditProduct,
  HomePresenter,
  PresenterProductsView,
  ProductDetailsPresenter,
} from './pages/Presenter/index.js';
import {
  InventoryHome,
  TransactionsPage,
  InventoryTransactions,
  AllInventoryOrders,
  AddPage
} from './pages/inventory/index.js';
import {
  EmployeLogin,
  Landing,
  Login,
  Register,
  Page404,
} from './pages/shared/index.js';

import {
  CustomOrderForm,
  ViewCutomizedOrders,
  ViewMeasuredCutomizedOrders,
  OrderDetailsEnginer,
} from './pages/engineer/index.js';
import {
  ViewProductOrders,
  ViewServiceOrder,
  ServiseDetailsOperator,
  ContactUsPage
} from './pages/operator/index.js';

import {
  AddEmployee,
  ChangeEmpPassword,
  EditEmployee,
  ViewEmployees,
} from './pages/actorManager/index.js';
import { OrderDetailsFactory } from './pages/factory/index.js';
import { FactorView } from './pages/factory/index.js';
import AddProductForm from './components/inventory/AddProductFrom';
import AddMatrialForm from './components/inventory/AddMatrialForm';
import UpdateProductForm from './components/inventory/UpdateProductForm';
import UpdateMatrialForm from './components/inventory/UpdateMatrialeForm';
import {
  shouldRenderEmployeeHeader,
  shouldRenderECommersHeader,
  shouldRenderECommersFooter,
} from './utils/ShouldRender.jsx';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import ProductOrderHistory from './pages/operator/viewOrderHistory.jsx';
import ProductOrderDetails from './pages/operator/ProductOrderDetails.jsx';
import i18n from '../Language/translate.jsx';
import ForgotPassword from './pages/shared/ForgetPassword.jsx';

function App() {
  const location = useLocation();
  const { customer } = useSelector((state) => state.customer);
  const { employee } = useSelector((state) => state.employee);

  axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_URL;
  axios.defaults.headers = {
    'Content-Type': 'application/json',
    Authorization: customer?.token ? `Bearer ${customer?.token}` : '',
  };
  //add by adel
  const [socket, setSocket] = useState(null);
  const initialLanguage = {
    language: JSON.parse(window?.localStorage.getItem('language')) ?? 'en',
  };
  useEffect(() => {
    i18n.changeLanguage(initialLanguage.language);
  }, []);
  useEffect(() => {
    if (customer?.email || employee?.email) {
      setSocket(io(import.meta.env.VITE_APP_SERVER_URL));
    }
  }, []);
  useEffect(() => {
    async function getConnection() {
      if (customer?.email) {
        await socket?.emit('newUser', { user: customer });
      }
    }
    getConnection();
  }, [socket, customer]);
  useEffect(() => {
    async function getConnection() {
      if (employee?.email) {
        await socket?.emit('newUser', { user: employee });
      }
    }
    getConnection();
  }, [socket, employee]);

  return (
    <>
      {shouldRenderECommersHeader(location) ||
        shouldRenderEmployeeHeader(location, socket, setSocket)}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login/employee" element={<EmployeLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:serviceName"
          element={<ServicesDetails socket={socket} setSocket={setSocket} />}
        />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/product/:productId/reviews" element={<AllReviews />} />
        <Route path="/bag" element={<Bag />} />
        {/* Private Customer Routes (Logged in) */}
        <Route element={<CustomerLayout />}>
          <Route
            path="/profile"
            element={<Profile socket={socket} setSocket={setSocket} />}
          />
          <Route path="/profile/details" element={<ProfileDetails />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route
            path="/profile/delete-account"
            element={<DeleteAccountPage />}
          />
          <Route path="/favourites" element={<Favourites />} />
          <Route
            path="/checkout"
            element={<Checkout socket={socket} setSocket={setSocket} />}
          />
          <Route path="/history" element={<History />} />
        </Route>
        {/* Private Inventory Manager Routes */}
        <Route element={<InventoryManagerLayout />}>
          <Route path="/inventory/home" element={<InventoryHome />} />
          <Route path="/inventory/add/product" element={<AddProductForm />} />
          <Route path="/inventory/add/matrial" element={<AddMatrialForm />} />
          <Route path="/inventory/orders" element={<AllInventoryOrders />} />
          <Route path="/inventory/Add" element={<AddPage />} />
          <Route
            path="/inventory/update/product/:productId"
            element={<UpdateProductForm />}
          />
          <Route
            path="/inventory/update/matrial/:matrialId"
            element={<UpdateMatrialForm />}
          />
          <Route path="/inventory/transaction" element={<TransactionsPage />} />
          <Route
            path="/inventory/history"
            element={<InventoryTransactions />}
          />
        </Route>
        {/* Private Presenter Routes */}
        <Route element={<PresenterLayout />}>
          <Route
            path="/presenter/product/:productId"
            element={<ProductDetailsPresenter />}
          />
          <Route path="/presenter/home" element={<HomePresenter />} />
          <Route path="/presenter/view" element={<PresenterProductsView />} />
          <Route
            path="/presenter/update/product/:productId"
            element={<EditProduct />}
          />
          <Route
            path="presenter/add-to-store/product/:productId"
            element={<AddProduct />}
          />
        </Route>
        {/* Private Enginer Routes */}
        <Route element={<EngineerLayout />}>
          <Route
            path="/engineer/send-order/:requestId"
            element={<CustomOrderForm socket={socket} setSocket={setSocket} />}
          />
          <Route
            path="/engineer/measuring"
            element={
              <ViewMeasuredCutomizedOrders
                socket={socket}
                setSocket={setSocket}
              />
            }
          />
          <Route
            path="/engineer/orders"
            element={
              <ViewCutomizedOrders socket={socket} setSocket={setSocket} />
            }
          />
          <Route
            path="/engineer/order-details/:orderId"
            element={<OrderDetailsEnginer />}
          />
        </Route>
        {/* Private Factory Routes */}
        <Route element={<FactoryLayout />}>
          <Route
            path="/factory/order-details/:orderId"
            element={<OrderDetailsFactory />}
          />
          <Route path="/factory/view" element={<FactorView />} />
        </Route>
        {/* Private Operator Routes */}
        <Route element={<OperatorLayout />}>
          <Route
            path="/operator/orders/product"
            element={
              <ViewProductOrders socket={socket} setSocket={setSocket} />
            }
          />
          <Route
            path="/operator/orders/history"
            element={<ProductOrderHistory />}
          />
          <Route
            path="/operator/orders/service"
            element={<ViewServiceOrder socket={socket} setSocket={setSocket} />}
          />
          <Route
            path="/operator/servise-details/:serviceId"
            element={
              <ServiseDetailsOperator socket={socket} setSocket={setSocket} />
            }
          />
          <Route
            path="/operator/order-details/:orderId"
            element={<ProductOrderDetails />}
          />
         <Route
            path="/operator/contactUs"
            element={<ContactUsPage />}
          />
        </Route>
        {/* Private actor manager Routes */}
        <Route element={<ActorLayout />}>
          <Route path="/actor/add-employee" element={<AddEmployee />} />
          <Route path="/actor/employees" element={<ViewEmployees />} />
          <Route
            path="/actor/edit-employee/:employeeId"
            element={<EditEmployee />}
          />
          <Route
            path="/actor/change-password/:employeeId"
            element={<ChangeEmpPassword />}
          />
        </Route>
        {/*The path not found.*/}
        <Route path="*" element={<Page404 />} />
        <Route path="/not-found" element={<Page404 />} />
      </Routes>
      {shouldRenderECommersFooter(location)}
    </>
  );
}

export default App;
