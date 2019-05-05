import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { TAIL_FORM_ITEMS_LAYOUT, FORM_ITEMS_LAYOUT } from '../constants'

class ResetPasswordForm extends Component {
    render () { 
        const { onSubmit, form, validateToNextPassword, compareToFirstPassword} = this.props
        const { getFieldDecorator } = form
        return (
        <Form className="reset-password-form" {...FORM_ITEMS_LAYOUT }>
                <Form.Item>
                    { 
                        getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your password!' },
                            { validator: validateToNextPassword }
                            ],
                        })(
                            <Input type="password" />
                        )   
                    }
                </Form.Item>
                <Form.Item>
                    { 
                        getFieldDecorator('confirmPassword', {
                            rules: [{ required: true, message: 'Please input your confirm password!' },
                            { validator: compareToFirstPassword }
                            ],
                        })(
                            <Input type="password" />
                        )   
                    }
                </Form.Item>
                <Form.Item {...TAIL_FORM_ITEMS_LAYOUT}>
                    <Button key="submit" type="primary" onClick={onSubmit}>Reset</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({ name: 'ResetPasswordForm' })(ResetPasswordForm)