import React, { PureComponent } from 'react'
import { Form, Input, Button } from 'antd'
import { FORM_ITEMS_LAYOUT, TAIL_FORM_ITEMS_LAYOUT } from '../constants'

const { TextArea } = Input;

class ProfileForm extends PureComponent {
    render () {
        const { onSubmit, onReset } = this.props
        const { getFieldDecorator } = this.props.form
        const prefixSelector = getFieldDecorator('prefix', { initialValue: '+61' })(<span>+61</span>)
        return (
            <Form className="profile-form" {...FORM_ITEMS_LAYOUT } onSubmit={onSubmit}>
                <Form.Item label="First name"> 
                    {
                        getFieldDecorator('firstName', {
                            rules: [{required: true, message: 'Please input your first name!'}],
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label="Last name"> 
                    {
                        getFieldDecorator('lastName', {
                            rules: [{required: true, message: 'Please input your last name!'}],
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label="Email"> 
                    {
                        getFieldDecorator('email', {
                            rules: 
                                [
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Email input is invalid!' }
                                ],
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label="Phone Number"> 
                    {
                        getFieldDecorator('phoneNumber', {
                            rules: 
                                [
                                    { required: true, message: 'Please input your phone number!' }
                                ],
                        })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)
                    }
                </Form.Item>
                <Form.Item label="Address"> 
                    {
                        getFieldDecorator('address', {
                            rules: 
                                [
                                    { required: true, message: 'Please enter your address!' }
                                ],
                        })(<TextArea />)
                    }
                </Form.Item>
                <Form.Item {...TAIL_FORM_ITEMS_LAYOUT}>
                    <Button onClick={onReset}>Reset</Button>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        )
    }
}

const WrappedProfileForm = Form.create({
    name: 'profile_form',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        return {
            firstName: Form.createFormField({
                ...props.firstName,
                value: typeof props.firstName === 'object' && props.firstName !== null ? props.firstName.value : props.firstName
            }),
            lastName: Form.createFormField({
                ...props.lastName,
                value: typeof props.lastName === 'object' && props.lastName !== null ? props.lastName.value : props.lastName
            }),
            email: Form.createFormField({
                ...props.email,
                value: typeof props.email === 'object' && props.email !== null ? props.email.value : props.email
            }),
            phoneNumber: Form.createFormField({
                ...props.phoneNumber,
                value: typeof props.phoneNumber === 'object' && props.phoneNumber !== null ? props.phoneNumber.value : props.phoneNumber
            }),
            address: Form.createFormField({
                ...props.address,
                value: typeof props.address === 'object' && props.address !== null ? props.address.value : props.address
            })
        }
    }
})(ProfileForm)

export default WrappedProfileForm