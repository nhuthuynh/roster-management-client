import React, { Component } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { FORM_ITEMS_LAYOUT } from '../constants'

class SignUpModal extends Component {
    render () {
        const { title, visible, handleSubmit, form, onCancel, onReset } = this.props
        const { getFieldDecorator } = form
        const prefixSelector = getFieldDecorator('prefix', { initialValue: '+61' })(<span>+61</span>)
        
        return (<Modal onOk={handleSubmit} onCancel={onCancel} title={title} visible={visible}
            footer={[
              <Button key="clear" onClick={onReset}>Clear</Button>,
              <Button key="cancel" onClick={onCancel}>Cancel</Button>,
              <Button key="submit" type="primary" onClick={handleSubmit}>Sign Up</Button>
            ]}
          >
                    <Form className="signUpForm" {...FORM_ITEMS_LAYOUT }>
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
                              rules: [{ type: 'email', message: 'The input is not valid E-mail!' }, 
                                      { required: true, message: 'Please input your E-mail!',}],
                                })( <Input />)
                          }
                        </Form.Item>
                      <Form.Item label="Password">
                          { getFieldDecorator('password', {
                            rules: [{
                              required: true, message: 'Please input your password!',
                            }, {
                              validator: this.validateToNextPassword,
                            }],
                          })(
                            <Input type="password" />
                          )}
                        </Form.Item>
                      <Form.Item label="Confirm Password">
                          { 
                            getFieldDecorator('confirm', {
                              rules: [{
                                required: true, message: 'Please confirm your password!',
                                }, {
                                validator: this.compareToFirstPassword,
                              }],
                            })(
                              <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </Form.Item>
                      <Form.Item label="Phone Number">
                          {
                            getFieldDecorator('phoneNumber', {
                            rules: [{ required: true, message: 'Please input your phone number!' }],
                          })(
                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                          )}
                        </Form.Item>
                    </Form>
                </Modal>)
    }
}

export default Form.create({ name: 'SignUpModal' })(SignUpModal)