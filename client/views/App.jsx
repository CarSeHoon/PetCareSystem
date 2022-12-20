import React from 'react';

import "../resources/reset.css"
import "../resources/main.css"
import "../resources/responsive.css"
import AppRoute from "./AppRoute.jsx";
import Footer from "./layout/Footer.jsx";
import HeaderContainer from '../views/layout/HeaderContainer';
import Sidebar from './layout/SideBar';


function App() {

  return (
    <div className="App">
      <HeaderContainer />
      <Sidebar />
      <AppRoute />
      <Footer />
    </div>
  );
  
}

export default App;
