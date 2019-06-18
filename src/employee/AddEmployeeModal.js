import React, { Component } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { FORM_ITEMS_LAYOUT } from '../constants'

const { Option } = Select;

class AddEmployeeModal extends Component {
    render () {
        const { title, visible, handleSubmit, form, onCancel, loading } = this.props
        const { getFieldDecorator } = form

        return (<Modal onOk={handleSubmit} onCancel={onCancel} title={title} visible={visible} confirmLoading={loading}>
            <Form {...FORM_ITEMS_LAYOUT}>
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
                                rules: [{ required: true, message: 'Please input your last name!'}],
                            })(<Input />)
                            }
                            </Form.Item>
                            <Form.Item label="E-mail">
                            {
                            getFieldDecorator('email', {
                                rules: [
                                        { type: 'email', message: 'The input is not valid e-mail!' }, 
                                        { required: true, message: 'Please input your e-mail!',}
                                    ],
                                })( <Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Phone number">
                            {
                                getFieldDecorator('phoneNumber', {
                                rules: [ 
                                            { required: true, message: 'Please input your phone number!',}
                                        ],
                                    })( <Input />)
                            }
                        </Form.Item>
                        <Form.Item label="Employee type">
                            {
                                getFieldDecorator('type', {
                                    rules: [
                                        { required: true, message: 'Please select employee type!' }
                                    ],})(
                                        <Select placeholder="Please select a type">
                                            <Option value="FULL_TIME">Full time</Option>
                                            <Option value="PART_TIME">Part time</Option>
                                            <Option value="PART_TIME_STUDENT">Part time - Student</Option>
                                        </Select>
                                    )
                            }
                        </Form.Item>
                        <Form.Item label="Employee role">
                            {
                                getFieldDecorator('role', {
                                    rules: [
                                        { required: true, message: 'Please select employee role!' }
                                    ]})(
                                        <Select placeholder="Please select a type">
                                            <Option value="ROLE_MANAGER">Manager</Option>
                                            <Option value="ROLE_EMPLOYEE">Employee</Option>
                                        </Select>
                                    )
                                
                            }
                        </Form.Item>
                </Form>
        </Modal>)
    }
}

export default Form.create({ name: 'addEmployeeModal' })(AddEmployeeModal)