import React from 'react'
import {
    Form, Icon, Input, Button
  } from 'antd';
import { ACCESS_TOKEN } from '../constants'
import { login } from '../util/APIUtils'
import { notification } from 'antd'

import './login.css'

let LoginForm = props => {
    const { onLogin } = props;

    const handleSubmit = (event) => {
      event.preventDefault();
      props.form.validateFields((err, values) => {
        if (!err) {
          const loginRequest = Object.assign({}, values);
          login(loginRequest).then((response) => {
              localStorage.setItem(ACCESS_TOKEN, response.accessToken)
              onLogin()
          }).catch((error) => {
            if(error.status === 401) {
                notification.error({
                    message: 'CEMS',
                    description: 'Your email or password is incorrect. Please try again!'
                })                   
            } else {
                notification.error({
                    message: 'CEMS',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                })
            }
        })
        }
      })
    }
    const { getFieldDecorator } = props.form;

    return (
        <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot" href="#">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="#">register now!</a>
        </Form.Item>
      </Form>
    )
}

const WrappedLoginForm = Form.create({ name: 'login' })(LoginForm);

export default WrappedLoginForm