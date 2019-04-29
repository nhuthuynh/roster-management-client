import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';

import { Layout, Menu } from 'antd'
import ProfileArea from './ProfileArea'
import { ROUTES } from '../constants'

const Header = Layout.Header;

class AppHeader extends Component {
    state = {
        isShowProfileMenu: false
    }

    render() {
        let menuItems = []
        if (this.props.currentUser) {
            
            menuItems = [
                <Menu.Item key="/"><Link to="/"><span>Home</span></Link></Menu.Item>,
                <Menu.Item key={ROUTES.employees}><Link to={ROUTES.employees}><span>Employees</span></Link></Menu.Item>,
                <Menu.Item key={ROUTES.roster}><Link to={ROUTES.roster}><span>Roster</span></Link></Menu.Item>,
                <Menu.Item key={ROUTES.availability}><Link to={ROUTES.availability}><span>Availability</span></Link></Menu.Item>
            ]
        }
        else
            menuItems = [
                <Menu.Item key="/"><Link to="/"><span>Home</span></Link></Menu.Item>,
            ]
        
        const { currentUser, onSignOut, isAuthenticated, showSignUpModal, showSignInModal } = this.props
        const name = currentUser && currentUser.firstName ?  `Welcome ${currentUser.firstName} ${currentUser.lastName}` : ""
        
        return (
            <Header className="app-header">
                <div className="container">
                    <div className="app-title" >
                        <Link to="/">Cafe Employees Management System - CEMS</Link>
                    </div>
                    <ProfileArea showSignUpModal={showSignUpModal} showSignInModal={showSignInModal} isAuthenticated={isAuthenticated} onSignOut={onSignOut} name={name} />
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}>
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}

export default withRouter(AppHeader);