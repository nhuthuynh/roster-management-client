import React from 'react'
import { Menu, Button } from 'antd'
import {
    Link
} from 'react-router-dom'

export default function ProfileArea(props) {
    const { name, isAuthenticated, showSignUpModal, showSignInModal, toggleProfileMenu, onSignOut, isShowProfileMenu } = props
    
    return <div className="profile-area">
        { 
            !isAuthenticated && <Button className="btn-link btn-link-signup" onClick={showSignUpModal}>Sign up</Button>
        }
        { 
            !isAuthenticated && <Button className="btn-link btn-link-signin" onClick={showSignInModal}>Sign in</Button>
        }
        {
            isAuthenticated && <Button className="btn-link btn-link-signout" onClick={toggleProfileMenu}><span>{ name }</span>
                    { 
                        isShowProfileMenu && <Menu className="profile-menu" mode="vertical">
                            <Menu.Item><Link to="/profile">Profile</Link></Menu.Item>
                            <Menu.Item><Link to="/changepassword">Change password</Link></Menu.Item>
                            <Menu.Item><a onClick={onSignOut}>Sign out</a></Menu.Item>
                        </Menu>
                    }
                </Button>
        }
    </div>
}