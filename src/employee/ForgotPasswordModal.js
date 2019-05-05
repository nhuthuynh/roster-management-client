import React, { Component } from 'react'
import { Modal, Form, Input, Button, Icon } from 'antd'

class ForgotPasswordModal extends Component {
    render () { 
        const { title, visible, handleSubmit, form, onCancel } = this.props
        const { getFieldDecorator } = form

        return (
        <Modal onCancel={onCancel} title={title} visible={visible}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>Reset password</Button>
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
            </Form>
        </Modal>)
    }
}

export default Form.create({ name: 'ForgotPasswordForm' })(ForgotPasswordModal)