import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';

import { Layout, Menu } from 'antd'
import ProfileArea from './ProfileArea'
import { ROUTES, EMPLOYEE_ROLES } from '../constants'

const Header = Layout.Header;

class AppHeader extends Component {
    state = {
        isShowProfileMenu: false
    }

    render() {
        const { currentUser, onSignOut, isAuthenticated, showSignUpModal, showSignInModal } = this.props
        const name = currentUser && currentUser.firstName ?  `Welcome ${currentUser.firstName} ${currentUser.lastName}` : ""
        let menuItems = []
        menuItems.push(<Menu.Item key="/"><Link to="/"><span>Home</span></Link></Menu.Item>)
        if (currentUser) {   
            if (currentUser.role !== EMPLOYEE_ROLES.employee)
                menuItems.push(<Menu.Item key={ROUTES.employees}><Link to={ROUTES.employees}><span>Employees</span></Link></Menu.Item>,)
            
            menuItems = menuItems.concat([
                <Menu.Item key={ROUTES.roster}><Link to={ROUTES.roster}><span>Roster</span></Link></Menu.Item>,
                <Menu.Item key={ROUTES.availability}><Link to={ROUTES.availability}><span>Availability</span></Link></Menu.Item>,
                <Menu.Item key={ROUTES.leave}><Link to={ROUTES.leave}><span>Leaves</span></Link></Menu.Item>
            ])
        }
    
        
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