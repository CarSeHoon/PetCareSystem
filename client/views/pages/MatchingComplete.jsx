import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { MDBBadge, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';



const MatchingComplete = () => {

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
        user_id: '',
        name: '',
        email: '',
        nick_name: '',
        ph: '',
        match_request_content: '',
        care_price: '',
        date: ''
    });

    const userRequestSelectOne = () => {
        console.log('userRequestSelectOne 실행 !!!');
        let httpRequestUrl = `/userRequestSelectOne.json?care_request_number=${location.state['care_request_number']}`;
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
        userRequestSelectOne();
      }, []);

      //목록으로 이동하는 함수 정의
      const goPetListPage = () => {
        navigate('/');
      }

      //수정페이지로 이동하는 함수 정의
      const goPetUpdatePage = () => {
        navigate('/pages/petUpdate', {state: {care_request_number: location.state['care_request_number']}})
      }

      const goMatchingPage = () => {
        navigate('/pages/Matching', {state: {care_request_number: location.state['care_request_number']}})
      }

      //careRequestDelete 정보 삭제 함수 정의
      const careRequestDelete = () => {
        //예: true, 아니요: false
        let confirm = window.confirm('삭제하시겠습니까?');
        if(confirm == true) {
            let httpRequestUrl = `/careRequestDelete.json?care_request_number=${location.state['care_request_number']}`;
            console.log('httpRequestUrl : ', httpRequestUrl);
            fetch(httpRequestUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
              },
            }).then(function (result) {
                console.log('careRequestDelete() /careRequestDelete.json result : ', result);
                alert('삭제가 완료되었습니다.')
                goPetListPage();
            }).catch(function (error) {
                console.log('careRequestDelete() /careRequestDelete.json error : ', error);
            });
        } else {
            return;
        }
      }

      /////////////////////////////////////수정

  /////////////////////

  function acceptMatching() {
    fetch("/acceptMatching.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("acceptMatching() /acceptMatching.json result : ",data);
        console.log(careRequest.care_request_insert_user_id);
        alert("수락되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        console.log(
          "acceptMatching() /acceptMatching.json error : ",
          error
        );
      });
  }


  function matchingCancel() {
    fetch("/matchingCancel.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("matchingCancel() /matchingCancel.json result : ",data);
        console.log(careRequest.care_request_insert_user_id);
        alert("매칭이 취소 되었습니다");
        navigate("/");
      })
      .catch((error) => {
        console.log(
          "matchingCancel() /matchingCancel.json error : ",
          error
        );
      });
  }



  const btn = document.getElementById('Btn');
  const btn1 = document.getElementById('Btn1');
  const btn2 = document.getElementById('Btn2');
  const btn3 = document.getElementById('Btn3');
  const btn4 = document.getElementById('Btn4');
  const btn5 = document.getElementById('Btn5');
  function session_request() {
    fetch("/sessionRequest.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("sessionRequest() /sessionRequest.json result : ", data);
                if (data.isSuccess == true) {
                  btn1.style.display = 'none'
                  btn2.style.display = 'none'
                  
              } else {btn3.style.display = 'none'}
      })
      .catch((error) => {
        console.log(
          "sessionRequest() /sessionRequest.json error : ",
          error
        );
      });
  }


  function session_request2() {
    fetch("/sessionRequest2.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("sessionRequest2() /sessionRequest2.json result : ", data);
                if (data.isSuccess == true) {
                  btn1.style.display = 'none'
                  btn2.style.display = 'none'
              } else {
                btn4.style.display = 'none'
                btn5.style.display = 'none'
              }
      })
      .catch((error) => {
        console.log(
          "sessionRequest2() /sessionRequest2.json error : ",
          error
        );
      });
  }

  function session_request3() {
    fetch("/sessionRequest3.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("sessionRequest3() /sessionRequest3.json result : ", data);
                if (data.isSuccess == true) {
                  btn1.style.display = 'none'
                  btn2.style.display = 'none'
                  btn3.style.display = 'none'
                  btn4.style.display = 'none'
                  btn5.style.display = 'none'
              } else {
                
              }
      })
      .catch((error) => {
        console.log(
          "sessionRequest3() /sessionRequest3.json error : ",
          error
        );
      });
  }


  session_request();
  session_request2();
  session_request3();

  
  var img_src = "../"+careRequest.img_url;

    return (
      <>
        <div id="container">
            <MDBListGroup style={{ minWidth: '22rem' }} light id='detailgroup'>
              <div id="detail1">
              <MDBListGroupItem className='d-flex justify-content-between align-items-center'>
                <div className='d-flex align-items-center'>
                  <div className='ms-3'>
                    <p className='fw-bold mb-1'>제목</p>
                    <p className='text-muted mb-0' id="details">{careRequest.care_request_title}</p>
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
              </div>
              </MDBListGroup>

              <div style={{ maxWidth: '22rem' }} id='details'>
              <img src={img_src}/>
            <MDBListGroup style={{ minWidth: '22rem' }} light className='mb-3'>
        <MDBListGroupItem>
          <h5 className='fw-bold'>매칭된 자 : {careRequest.care_provide_user_id}</h5>
          <p className='text-muted mb-2 fw-bold'>ph : {careRequest.ph}</p>
          <p className='text-muted mb-0'>{careRequest.match_request_content}
          </p>
        </MDBListGroupItem>
      </MDBListGroup>
      </div>
        </div>
        <ButtonGroup size="lg" className="mb-2">
              <Button id="Btn" variant="outline-info" onClick={goPetListPage}>목록</Button>
              <Button id="Btn1" variant="outline-info" onClick={goPetUpdatePage}>수정</Button>
              <Button id="Btn2" variant="outline-info" onClick={careRequestDelete}>삭제</Button>
              <Button id="Btn3" variant="outline-info" onClick={goMatchingPage}>매칭</Button>
              <Button id="Btn4" variant="outline-info" onClick={acceptMatching}>수락</Button>
              <Button id="Btn5" variant="outline-info" onClick={matchingCancel}>취소</Button>
              {

              }
            </ButtonGroup>
            <div id="aa"></div>
        </>
    );
}

export default MatchingComplete;