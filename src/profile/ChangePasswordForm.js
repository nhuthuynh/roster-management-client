import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd'
import { FORM_ITEMS_LAYOUT, TAIL_FORM_ITEMS_LAYOUT } from '../constants'

class ChangePasswordForm extends PureComponent {
    render () {
        const { onSubmit, compareToFirstPassword, validateToNextPassword } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form className="changePassword-form" {...FORM_ITEMS_LAYOUT } onSubmit={onSubmit}>
                <Form.Item label="Current password"> 
                    {
                        getFieldDecorator('currentPassword', {
                            rules: [{ required: true, message: 'Please input current password!'}],
                        })(<Input type='password' />)
                    }
                </Form.Item>
                <Form.Item label="New password"> 
                    {
                        getFieldDecorator('newPassword', {
                            rules: [{ required: true, message: 'Please input new password!'},
                            { validator: validateToNextPassword }
                        ],
                        })(<Input type='password' />)
                    }
                </Form.Item>
                <Form.Item label="Confirm new password"> 
                    {
                        getFieldDecorator('confirmNewPassword', {
                            rules: 
                                [
                                    { required: true, message: 'Please confirm new password!' },
                                    { validator: compareToFirstPassword }
                                ],
                        })(<Input type='password' />)
                    }
                </Form.Item>
                <Form.Item {...TAIL_FORM_ITEMS_LAYOUT}>
                    <Button type="primary" htmlType="submit">Change</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(ChangePasswordForm)