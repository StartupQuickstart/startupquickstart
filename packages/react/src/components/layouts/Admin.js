import React from 'react';
import Navbar from '../layout/Navbar/Navbar';
import Footer from '../layout/Footer';
import Sidebar from '../layout/Sidebar/Sidebar';
import classNames from 'classnames';

export default function AdminLayout({ children, className }) {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main">
        <Navbar />
        <main className={classNames('content', className)}>
          <div className="container-fluid p-0">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
