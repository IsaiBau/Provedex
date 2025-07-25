import React from 'react';
import Dashboard from '../Dashboard';

export const Layout = ({ children, title }) => {
  return (
    <>
      <Dashboard title={title}>
        {children}
      </Dashboard>
    </>
  );
};
