import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PetList from "./pages/PetList.jsx";
import PetRegister from "./pages/PetRegister.jsx";
import styled from "styled-components";
import PetDetail from "./pages/PetDetail.jsx";
import PetUpdate from "./pages/PetUpdate.jsx";
import MyList from "./pages/MyList.jsx";
import CareList from "./pages/CareList.jsx";
import MatchingComplete from "./pages/MatchingComplete.jsx";
import Matching from "./pages/Matching.jsx";
import MatchingList from "./pages/MatchingList.jsx";
import Etc from "./pages/etc.jsx";

export default function Main() {
  return (
    <Padding>
        <Routes>
          <Route path="/" element={<PetList />}></Route>
          <Route path="/pages/petregister" element={<PetRegister />}></Route>
          <Route path="/pages/petdetail" element={<PetDetail />}></Route>
          <Route path="/pages/petupdate" element={<PetUpdate />}></Route>
          <Route path="/pages/mylist" element={<MyList />}></Route>
          <Route path="/pages/carelist" element={<CareList />}></Route>
          <Route path="/pages/matchingcomplete" element={<MatchingComplete />}></Route>
          <Route path="/pages/matching" element={<Matching />}></Route>
          <Route path="/pages/matchinglist" element={<MatchingList />}></Route>
          <Route path="/pages/etc" element={<Etc />}></Route>
        </Routes>
    </Padding>
  );
}

const Padding = styled.div`
  padding: 2rem;
  background-color: #EAF6F6;
`