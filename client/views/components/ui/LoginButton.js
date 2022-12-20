import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { Link } from 'react-router-dom';
import { shadow } from '../../src/lib/StyleUtil';

const BorderedButton = styled(Link)`
    font-weight: 500;
    color: ${oc.cyan[6]};
    border: 1px solid ${oc.cyan[6]};
    padding: 0.5rem;
    padding-bottom: 0.4rem;
    cursor: pointer;
    border-radius: 2px;
    text-decoration: none;
    transition: .2s all;

    &:hover {
        background: ${oc.cyan[6]};
        color: white;
        ${shadow(1)}
    }

    &:active {
        /* 마우스 클릭시 아래로 미세하게 움직임 */
        transform: translateY(3px);
    }


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

const LoginButton = () => (
    <BorderedButton onClick={logout}>
        로그아웃
    </BorderedButton>
);

export default LoginButton;