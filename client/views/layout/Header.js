import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { shadow, media } from '../src/lib/StyleUtil';
import { Link } from 'react-router-dom';

// 상단 고정, 그림자
const Positioner = styled.div`
    grid-area: header;
    flex-direction: column;
    top: 0px;
    width: 100%;
    ${shadow(1)}
`;

// 흰 배경, 내용 중간 정렬
const WhiteBackground = styled.div`
    background: white;
    display: flex;
    justify-content: center;
    height: auto;
`;

// 해더의 내용
const HeaderContents = styled.div`
    width: 1200px;
    height: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;

    padding-right: 1rem;
    padding-left: 1rem;
    ${media.wide`
        width: 992px;
    `}

    ${media.tablet`
        width: 100%;
    `}
`;

// 로고
const Logo = styled.div`
    font-size: 1.4rem;
    letter-spacing: 2px;
    color: ${oc.teal[7]};
    font-family: 'Rajdhani';
`;

// 중간 여백
const Spacer = styled.div`
    flex-grow: 1;
`;

// 하단 그래디언트 테두리
const GradientBorder = styled.div`
    height: 3px;
    background: linear-gradient(to right, ${oc.teal[6]}, ${oc.cyan[5]});
`;

//로그아웃
function logout() {
    fetch("/logout.json", {
    method: "POST",
    //body: JSON.stringify({user_id: user_id, password: password}),
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
    })
    .then((response) => response.json()).then((data) => {
        console.log("logout() /logout.json result : ", data);
        alert(data.message);
        if (data.isSuccess == true) {
            window.location.href = '/';
        } else {}
        // alert("등록이 완료 되었습니다");
        // navigate("/");
    })
    .catch((error) => {
        console.log("logout() /logout.json error : ", error);
    });
}

const Header = ({children}) => {
    return (
        <Positioner>
            <WhiteBackground>
                <HeaderContents>
                    <Logo>Pet Care System</Logo>
                    <Spacer/>
                    {children}
                </HeaderContents>
            </WhiteBackground>
            <GradientBorder/>
        </Positioner>
    );
};

export default Header;