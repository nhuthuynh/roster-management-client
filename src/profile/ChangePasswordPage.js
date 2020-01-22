import React, { PureComponent } from 'react'
import ChangePasswordForm from './ChangePasswordForm'
import './profile.css'
import { notification } from 'antd'

import { changePassword } from '../util/APIUtils'

export default class ChangePasswordPage extends PureComponent {
    
    changePassword = (e) => {
        e.preventDefault()
        const form = this.formRef.props.form

        form.validateFields((errors, values) => {
            if(!errors) {
                const { currentPassword, newPassword } = values
                changePassword({ currentPassword, newPassword }).then((response) => {
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
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('Two passwords that you enter is inconsistent!')
        } else {
            callback()
        }
      }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.formRef.props.form
        if (value) {
            form.validateFields(['confirmNewPassword'], { force: true })
        }
        callback()
    }
    

    render () {
        const { changePassword, saveFormRef, compareToFirstPassword, validateToNextPassword } = this
        return (
            <div className="changePassword-container">
                <h1 className="page-title">change password</h1>
                <div className="page-body">
                    <ChangePasswordForm wrappedComponentRef={saveFormRef} onSubmit={changePassword} validateToNextPassword={validateToNextPassword} compareToFirstPassword={compareToFirstPassword} />
                </div>
            </div>
        )
    }
}