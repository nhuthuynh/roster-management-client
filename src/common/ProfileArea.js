import React from 'react'
import { Menu, Button, Dropdown, Icon } from 'antd'
import {
    Link
} from 'react-router-dom'

export default function ProfileArea(props) {
    const { name, isAuthenticated, showSignUpModal, showSignInModal, onSignOut } = props
    const menu = (<Menu className="profile-menu" mode="vertical">
        <Menu.Item><Link to="/profile">Profile</Link></Menu.Item>
        <Menu.Item><Link to="/changePassword">Change password</Link></Menu.Item>
        <Menu.Item><a onClick={onSignOut}>Sign out</a></Menu.Item>
    </Menu>)
    return <div className="profile-area">
        { 
            !isAuthenticated && <Button className="btn-link btn-link-signup" onClick={showSignUpModal}>Sign up</Button>
        }
        { 
            !isAuthenticated && <Button className="btn-link btn-link-signin" onClick={showSignInModal}>Sign in</Button>
        }
        {
            isAuthenticated && <Dropdown overlay={menu}>
                                    <a className="btn-link-signout ant-dropdown-link" href="#">{name}<Icon type="down" /></a>
                                </Dropdown>
        }
    </div>
}