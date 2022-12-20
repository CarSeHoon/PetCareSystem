import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { MDBBadge, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';




const Matching = () => {

    const navigate = useNavigate();

    const location = useLocation();
    console.log('location.state', location.state);

    //careRequest 상세 정보 변수 선언(초기화)
    const [careRequest, setCareRequest] = useState({
        care_request_number: 0,
        care_request_title: '',
        care_request_content: '',
        pet_name: '',
        pet_age: '',
        pet_animal_type: '',
        pet_animal_kind: '',
        pet_sex: '',
        care_request_insert_datetime: '',
        care_request_insert_user_id: '',
        matching_datetime: '',
        matching_status: '',
        care_provide_user_id: '',
        match_request_content: ''
    });

    const careRequestSelectOne = () => {
        console.log('careRequestSelectOne 실행 !!!');
        let httpRequestUrl = `/careRequestSelectOne.json?care_request_number=${location.state['care_request_number']}`;
        console.log('httpRequestUrl : ', httpRequestUrl);

        fetch(httpRequestUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json()).then((data) => {
            console.log("careRequestSelectOne", data);
            setCareRequest(data[0]);
          })
          .catch((error) => {
            console.log("getData() /getData error : ", error);
          });
      };

      React.useEffect(() => {
        careRequestSelectOne();
      }, []);

      function careRequestChange(e, target) {
        console.log(e.target.value, target);
        //careRequest.careRequestTitle = e.target.value;
        //careRequest['careRequestTitle'] = e.target.value;
        careRequest[target] = e.target.value;
        let copyCareRequest = JSON.parse(JSON.stringify(careRequest));
    
        //careRequest = {};//X -> 오류
        //careRequest['변수명'] = '값';//O
        setCareRequest(copyCareRequest);
      }

      //목록으로 이동하는 함수 정의
      const goPetListPage = () => {
        navigate('/');
      }
      var img_src = "../"+careRequest.img_url;
      /////////////////////////////////////수정
  function matchingRequest() {
    fetch("/matchingRequest.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("matchingRequest() /matchingRequest.json result : ",data);
        console.log(careRequest.care_request_insert_user_id);
        alert("매칭이 완료 되었습니다");
        navigate("/");
      })
      .catch((error) => {
        console.log(
          "matchingRequest() /matchingRequest.json error : ",
          error
        );
      });
  }

  function matchingRequest2() {
    fetch("/matchingRequest2.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if( data.isSuccess == true){
          alert("2개 이상 매칭할 수 없습니다.");
          navigate("/");
        } else {
          matchingRequest();
        }
        
      })
      .catch((error) => {
        console.log(
          "matchingRequest() /matchingRequest.json error : ",
          error
        );
      });
  }



    return (
        <>
            <div id="petdetailgrid">
            <MDBListGroup style={{ minWidth: '22rem' }} light id='list'>

              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>제목</p>
                    <p className='text-muted mb-0'>{careRequest.care_request_title}</p>
                  </div>
                </div>  
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>내용</p>
                    <p className='text-muted mb-0'>{careRequest.care_request_content}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>날짜</p>
                    <p className='text-muted mb-0'>{careRequest.date}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>가격</p>
                    <p className='text-muted mb-0'>{careRequest.care_price}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>이름</p>
                    <p className='text-muted mb-0'>{careRequest.pet_name}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>나이</p>
                    <p className='text-muted mb-0'>{careRequest.pet_age}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>성별</p>
                    <p className='text-muted mb-0'>{careRequest.pet_sex}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>동물종</p>
                    <p className='text-muted mb-0'>{careRequest.pet_animal_type}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>품종</p>
                    <p className='text-muted mb-0'>{careRequest.pet_animal_kind}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>등록일</p>
                    <p className='text-muted mb-0'>{careRequest.care_request_insert_datetime}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>등록자</p>
                    <p className='text-muted mb-0'>{careRequest.care_request_insert_user_id}</p>
                  </div>
                </div>
              </MDBListGroupItem>
              </MDBListGroup>
              
              
              <div style={{ maxWidth: '22rem' }} id='imgs'>
                
              <img src={img_src}/>
              <br/>
              <br></br>
              <TextField
          id="outlined-multiline-flexible"
          label="요청사항"
          multiline
          maxRows={6}
          value={careRequest.match_request_content}
                    onChange={(e) => careRequestChange(e, "match_request_content")}
        />
              </div>
              
            
            <div id="ss"></div>
            </div>
            <ButtonGroup size="lg" className="mb-2">
              <Button id="Btn" variant="outline-info" onClick={goPetListPage}>목록</Button>
              <Button id="Btn3" variant="outline-info" onClick={matchingRequest2}>매칭</Button>
              {

              }
            </ButtonGroup>

            
        </>
    );
}

export default Matching;