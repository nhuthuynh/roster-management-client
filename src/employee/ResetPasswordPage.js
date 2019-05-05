import React, { PureComponent } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import { notification } from 'antd'
import { getEmployeeIdAndTokenFromUrl } from '../util/helper'

import { changePasswordWithToken } from '../util/APIUtils'

export default class ResetPasswordPage extends PureComponent {
    
    changePassword = (e) => {
        e.preventDefault()
        const form = this.formRef.props.form
        const { employeeId, token } = getEmployeeIdAndTokenFromUrl(this.props.location.search)
        
        form.validateFields((errors, values) => {
            if(!errors) {
                const { password } = values
                changePasswordWithToken({ password, token, employeeId }, token ).then((response) => {
                    if (response && response.success) {
                        notification.success({
                            message: 'CEMS',
                            description: response.message || 'Password is updated!'
                        })
                        form.resetFields()
                    }
                }).catch((error) => {
                    notification.error({
                        message: 'CEMS',
                        description: `${error.message}`
                    })
                })
            }
        }) 
       
    }
    
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.formRef.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!')
        } else {
            callback()
        }
      }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.formRef.props.form
        if (value) {
            form.validateFields(['confirmPassword'], { force: true })
        }
        callback()
    }
    

    render () {
        const { changePassword, saveFormRef, compareToFirstPassword, validateToNextPassword } = this
        return (
            <div className="changePassword-container">
                <h1 className="page-title">reset password</h1>
                <div className="page-body">
                    <ResetPasswordForm wrappedComponentRef={saveFormRef} onSubmit={changePassword} validateToNextPassword={validateToNextPassword} compareToFirstPassword={compareToFirstPassword} />
                </div>
            </div>
        )
    }
}