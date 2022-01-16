import React from 'react';
import Navbar from '@/components/admin/navbar/Navbar';
import Footer from '@/components/admin/Footer';
import Sidebar from '@/components/admin/sidebar/Sidebar';
import classNames from 'classnames';

export function AdminLayout({ children, className }) {
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

export default AdminLayout;
