import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const defaultEmployeeNavigate = '/not-found';

export function CustomerLayout() {
  const { customer } = useSelector((state) => state.customer);
  return customer?._id ? <Outlet /> : <Navigate to="/login" />;
}

export function InventoryManagerLayout() {
  const { employee } = useSelector((state) => state.employee);
  if (employee?.jobTitle?.toLowerCase() === 'inventory manager') {
    return <Outlet />;
  }
  return <Navigate to={defaultEmployeeNavigate} />;
}

export function EngineerLayout() {
  const { employee } = useSelector((state) => state.employee);
  if (employee?.jobTitle?.toLowerCase() === 'engineer') {
    return <Outlet />;
  }
  return <Navigate to={defaultEmployeeNavigate} />;
}

export function PresenterLayout() {
  const { employee } = useSelector((state) => state.employee);
  if (employee?.jobTitle?.toLowerCase() === 'presenter') {
    return <Outlet />;
  }
  return <Navigate to={defaultEmployeeNavigate} />;
}

export function FactoryLayout() {
  const { employee } = useSelector((state) => state.employee);
  if (employee?.jobTitle?.toLowerCase() === 'factory') {
    return <Outlet />;
  }
  return <Navigate to={defaultEmployeeNavigate} />;
}

export function OperatorLayout() {
  const { employee } = useSelector((state) => state.employee);
  if (employee?.jobTitle?.toLowerCase() === 'operator') {
    return <Outlet />;
  }
  return <Navigate to={defaultEmployeeNavigate} />;
}
export function ActorLayout() {
  const { employee } = useSelector((state) => state.employee);
  if (employee?.jobTitle?.toLowerCase() === 'actor manager') {
    return <Outlet />;
  }
  return <Navigate to={defaultEmployeeNavigate} />;
}