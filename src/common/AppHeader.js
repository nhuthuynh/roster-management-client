import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import { Layout, Menu, Icon } from 'antd';
const Header = Layout.Header;

class AppHeader extends Component {
    render() {
        let menuItems = []
        if (this.props.currentUser) {
            const { onLogout } = this.props; 
            menuItems = [
                <Menu.Item key="/"><Link to="/"><Icon type="home" className="nav-icon" /></Link></Menu.Item>,
                <Menu.Item key="/employees"><Link to="/employees"><span>Employees</span></Link></Menu.Item>,
                <Menu.Item key="/roster"><Link to="/roster/"><span>Roster</span></Link></Menu.Item>,
                <Menu.Item key="/logout"><Link to="" onClick={onLogout}><span>Logout</span></Link></Menu.Item>
            ]
        }
        else
            menuItems = [
                <Menu.Item key="/"><Link to="/"><Icon type="home" className="nav-icon" /></Link></Menu.Item>,
                <Menu.Item key="/login"><Link to="/login/"><span>Login</span></Link></Menu.Item>,
                <Menu.Item key="/register"><Link to="/register/"><span>Signup</span></Link></Menu.Item>
            ]

        return (
            <Header className="app-header">
                <div className="container">
                    <div className="app-title" >
                        <Link to="/">Cafe Employees Management System</Link>
                    </div>
                    <Menu
                        className="app-menu"
                        mode="horizontal"
                        selectedKeys={[this.props.location.pathname]}
                        style={{ lineHeight: '64px' }} >
                        {menuItems}
                    </Menu>
                </div>
            </Header>
        );
    }
}

export default withRouter(AppHeader);