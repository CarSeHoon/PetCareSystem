import React from "react";
import Card from "../components/ui/Card.jsx";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

export default function MyList() {

  //동적으로 URL(페이지)를 변경할 때 사용
  const navigate = useNavigate();

  const [petListData, setPetListData] = React.useState([]);

  const myRequestSelectList = () => {
    fetch("/myRequestSelectList.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPetListData(data);
      })
      .catch((error) => {
        console.log("getData() /getData error : ", error);
      });
  };

  React.useEffect(() => {
    myRequestSelectList();
  }, []);

 //상세 조회 페이지 이동
 const goPetDetailPage = (item) => {
  console.log('goPetDetailPage item : ', item);
  let urlParam = {
    state: {
      care_request_number: item.care_request_number
    }
  }
  //navigate('/pages/petdetail', {state:{care_request_number: item.care_request_number}})
  navigate('/pages/petdetail', urlParam);
}

const goMatchingComplete = () => {
  navigate('/pages/matchinglist')
}



  return (
    <>
    <div>
      <Card data={petListData} onClick={goPetDetailPage}/>
    </div>
    <ButtonGroup size="lg" className="mb-2">
              <Button id="Btn" variant="outline-info" onClick={goMatchingComplete}>요청 리스트</Button>
            </ButtonGroup>
    
    </>
  );
}
