import React, { Component } from 'react';
import Header from './Header';
import LoginButton from '../components/ui/LoginButton';

class HeaderContainer extends Component {
    render() {
        return (
            <Header>
                <LoginButton/>
            </Header>
        );
    }
}

export default HeaderContainer;