import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { MDBInput } from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';


export default function PetRegister() {
  //동적으로 URL(페이지)를 변경할 때 사용
  const navigate = useNavigate();
  //careRequest
  const [careRequest, setCareRequest] = React.useState({
    careRequestTitle: "",
    careRequestContent: "",
    date:"",
    care_price: "",
    petName: "",
    petAge: "",
    petAnimalType: "",
    petAnimalKind: "",
    petSex: "",
    imgUrl: null,
  });

  //파일 미리볼 url을 저장해줄 state
  const [fileImage, setFileImage] = useState("");

  //careRequest 등록 정보가 변경될 시, 작동하는 함수
  function careRequestChange(e, target) {
    let copyCareRequest = JSON.parse(JSON.stringify(careRequest));

    if (target == 'imgUrl') {
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
  function petRequestInsert() {
    console.log("careRequest : ", careRequest);
    fetch("/careRequestInsert.json", {
      method: "POST",
      body: JSON.stringify(careRequest),
      headers: {
        "Content-Type": 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "careRequestInsert() /careRequestInsert.json result : ",
          data
        );
        alert("등록이 완료 되었습니다");

          //ImageURL 제거
          //URL.createObjectURL(fileImage);
          //setFileImage("");

        navigate("/");
      })
      .catch((error) => {
        console.log(
          "careRequestInsert() /careRequsetInsert.json error : ",
          error
        );
      });
  }

    
  

  return (
    <FormStyled>
      <div>
      <MDBInput label='제목' id='form1' type='text' size='lg'
      value={careRequest.careRequestTitle}
      onChange={(e) => careRequestChange(e, "careRequestTitle")} 
      />
      <br/>
      <MDBInput label='내용' id='form1' type='text' size='lg'
      value={careRequest.careRequestContent}
      onChange={(e) => careRequestChange(e, "careRequestContent")}
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
      value={careRequest.petName}
      onChange={(e) => careRequestChange(e, "petName")}
      />
<br/>
      <MDBInput label='나이' id='form1' type='text' size='lg'
      value={careRequest.petAge}
      onChange={(e) => careRequestChange(e, "petAge")}
      />
<br/>
      <InputGroup size="lg" className="mb-3">
        <InputGroup.Text id="basic-addon1">성별</InputGroup.Text>
        <Form.Select
        value={careRequest.petSex}
        onChange={(e) => careRequestChange(e, "petSex")}>
        <option value="">성별</option>
        <option value="남">남</option>
        <option value="여">여</option>
      </Form.Select>
      </InputGroup>

      <MDBInput label='동물종'  type='text' size='lg'
      value={careRequest.petAnimalType}
      onChange={(e) => careRequestChange(e, "petAnimalType")}
      />
<br/>
      <MDBInput label='품종' id='form1' type='text' size='lg'
      value={careRequest.petAnimalKind}
      onChange={(e) => careRequestChange(e, "petAnimalKind")}
      />
<br/>
      <InputGroup size="lg" className="mb-3">
        <InputGroup.Text id="basic-addon1">사진</InputGroup.Text>
        <Form.Control
          placeholder="file"
          type="file"
          accept="image/*"
          onChange={(e) => careRequestChange(e, "imgUrl")}
          /* value={careRequest.imgUrl} */
          name = "img"
        />
        {careRequest['imgUrl'] && (
                  <img
                    alt="sample"
                    src={careRequest['imgUrl']}
                    style={{ margin: "auto", width: "30%" }}
                  />
                )}
      </InputGroup>
      <br/>
      <Button className="pr-btn" size="lg" variant="outline-info" onClick={petRequestInsert}>등록</Button>{' '}
      </div>
      
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


