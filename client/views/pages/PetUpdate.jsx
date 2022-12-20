import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { MDBInput } from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';

export default function PetUpdate() {
  //동적으로 URL(페이지)를 변경할 때 사용
  const navigate = useNavigate();

  const location = useLocation();

  //careRequest 수정 정보 초기화
  const [careRequest, setCareRequest] = useState({
    care_request_number: 0,
    care_request_title: '',
    care_request_content: '',
    pet_name: '',
    pet_age: 0,
    pet_animal_type: '',
    pet_animal_kind: '',
    pet_sex: '',
    care_request_insert_datetime: '',
    care_request_insert_user_id: '',
    matching_datetime: null,
    matching_status: null,
    care_provide_user_id: null,
    img_url: '',
    care_price: '',
    date: ''
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

  //careRequest 등록 정보가 변경될 시, 작동하는 함수
  function careRequestChange(e, target) {
    let copyCareRequest = JSON.parse(JSON.stringify(careRequest));

    if (target == 'img_url') {
      console.log(e.target.files[0], target);
      var fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0], '');
      fileReader.onload = function() {
        console.log('fileReader.result : ', fileReader.result);
        copyCareRequest[target] = fileReader.result;
        setCareRequest(copyCareRequest);
      }
    } else {
      console.log(e.target.value, target);
      copyCareRequest[target] = e.target.value;
      setCareRequest(copyCareRequest);
    }
    //careRequest = {};//X -> 오류
    //careRequest['변수명'] = '값';//O
    //setCareRequest(copyCareRequest);
  }

  //petRequest 등록 함수
  function careRequestUpdate() {
    console.log("careRequest : ", careRequest);
    fetch("/careRequestUpdate.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "careRequestUpdate() /careRequestUpdate.json result : ",
          data
        );
        alert("수정이 완료 되었습니다");
        navigate("/pages/petdetail", {state:{care_request_number: location.state.care_request_number}});
      })
      .catch((error) => {
        console.log(
          "careRequestUpdate() /careRequestUpdate.json error : ",
          error
        );
      });
  }

  return (
    <FormStyled>
      <MDBInput label='제목' id='form1' type='text' size='lg'
      value={careRequest.care_request_title}
      onChange={(e) => careRequestChange(e, "care_request_title")} 
      />
      <br/>
      <MDBInput label='내용' id='form1' type='text' size='lg'
      value={careRequest.care_request_content}
      onChange={(e) => careRequestChange(e, "care_request_content")}
      />
      <br/>
      <TextField
        id="datetime-local"
        label="시간"
        type="datetime-local"
        value={careRequest.date}
        onChange={(e) => careRequestChange(e, "date")}
        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <br/>
<br/>
      <MDBInput label='가격' id='form1' type='text' size='lg'
      value={careRequest.care_price}
      onChange={(e) => careRequestChange(e, "care_price")}
      />
      <br/>
      <MDBInput label='이름' id='form1' type='text' size='lg'
      value={careRequest.pet_name}
      onChange={(e) => careRequestChange(e, "pet_name")}
      />
<br/>
      <MDBInput label='나이' id='form1' type='text' size='lg'
      value={careRequest.pet_age}
      onChange={(e) => careRequestChange(e, "pet_age")}
      />
<br/>
      <InputGroup size="lg" className="mb-3">
        <InputGroup.Text id="basic-addon1">성별</InputGroup.Text>
        <Form.Select
        value={careRequest.pet_sex}
        onChange={(e) => careRequestChange(e, "pet_sex")}>
        <option value="">성별</option>
        <option value="남">남</option>
        <option value="여">여</option>
      </Form.Select>
      </InputGroup>

      <MDBInput label='동물종'  type='text' size='lg'
      value={careRequest.pet_animal_type}
      onChange={(e) => careRequestChange(e, "pet_animal_type")}
      />
<br/>
      <MDBInput label='품종' id='form1' type='text' size='lg'
      value={careRequest.pet_animal_kind}
      onChange={(e) => careRequestChange(e, "pet_animal_kind")}
      />
<br/>


      <Button className="pr-btn" size="lg" variant="outline-info" onClick={careRequestUpdate}>수정</Button>{' '}
      
    </FormStyled>
  );
}

const FormStyled = styled.div`
width: 30%;
padding: 1rem;
font-size : 1rem;
position: absolute;
left: 60%;
transform: translateX(-50%);
`;
