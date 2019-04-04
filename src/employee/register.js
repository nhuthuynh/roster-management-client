import React, { Component } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { signUp } from '../util/APIUtils'
import './register.css'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
  sm: {
    span: 16,
    offset: 8,
  },
},
};

class RegisterForm extends Component {
  
  constructor() {
    super()
    this.state = {
    }
  }

  reset = () => {
    this.props.form.resetFields();
  }

  handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            let signUpRequest = Object.assign({},values)
            signUpRequest.type = "FULL_TIME"
            signUpRequest.role = "ROLE_ADMIN"
            signUp(signUpRequest).then((response) => {
              notification.success({
                message: "CEMS",
                description: "You are successfully registered!"
              })
              this.props.history.push("/login")
            }).catch((error) => {
              notification.error({
                message: 'CEMS',
                description: 'Errors:' + error.message
              })
            })
          }
        });
  }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }
    
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
    }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render () {
      const { getFieldDecorator } = this.props.form;
      const prefixSelector = getFieldDecorator('prefix', { initialValue: '+61' })(<span>+61</span>);

        return (
            <div className="register-container">
                <h1 className="title">Register</h1>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
                <Form.Item {...tailFormItemLayout}>
                <Button type="primary btn-prev" onClick={this.reset}>Reset</Button>
                <Button type="primary" htmlType="submit">Register</Button>
        </Form.Item>
      </Form>
            </div>
        )
    }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegisterForm);

export default WrappedRegistrationForm