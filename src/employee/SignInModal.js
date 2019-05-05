import React, { Component } from 'react'
import { Modal, Form, Input, Button, Icon } from 'antd'

class SignInModal extends Component {
    render () { 
        const { title, visible, handleSubmit, form, onCancel, onReset, showForgotPasswordModal } = this.props
        const { getFieldDecorator } = form

        return (
        <Modal onOk={handleSubmit} onCancel={onCancel} title={title} visible={visible}
            footer={[
                <Button key="clear" onClick={onReset}>Clear</Button>,
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>Sign In</Button>
            ]}
        >
            <Form className="signIn-form">
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
                <div>
                    <a onClick={showForgotPasswordModal} href='#'>Forgot password?</a>
                </div>
            </Form>
        </Modal>)
    }
}

export default Form.create({ name: 'SignInModal' })(SignInModal)