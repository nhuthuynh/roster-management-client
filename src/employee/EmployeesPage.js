import React, { Component } from 'react'
import { Table, Button, notification } from 'antd'
import { loadEmployees, signUp } from '../util/APIUtils'
import { generateRandomPassword } from '../util/helper'
import WrappedAddEmployeeModal from './AddEmployeeModal'

import './employee.css'

export default class EmployeesPage extends Component {
    state = {
        employeesList: [],
        columns: [{
            title: 'First Name',
            dataIndex: 'firstName'
        }, {
            title: 'Last Name',
            dataIndex: 'lastName'
        }, {
            title: 'Email',
            dataIndex: 'email'
        }, {
            title: 'Phone number',
            dataIndex: 'phoneNumber'
        }],
        isLoading: true,
        isShowModal: false,
    }

    componentDidMount() {
        this.loadEmployees()
    }

    loadEmployees = () => {
        const { currentUser } = this.props
        const shopOwnerId = currentUser.shopOwnerId ? currentUser.shopOwnerId : currentUser.id
        loadEmployees(shopOwnerId).then((response) => {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    employeesList: response,
                    shopOwnerId
                }
            })
        })
    }

    showAddEmployeeModal = () => {
        this.setState((prevState, props) => {
            return {
                ...prevState,
                isShowModal: true
            }
        })
    }

    hideAddEmployeeModal = () => {
        this.setState((prevState, props) => {
            this.resetForm()
            return {
                ...prevState,
                isShowModal: false
            }
        })
    }

    addEmployee = (e) => {
        e.preventDefault()
        const form = this.formRef.props.form
        
        form.validateFields((err, values) => {
          if (!err)  {
            const { loadEmployees, hideAddEmployeeModal } = this
            let employee = Object.assign({}, values)
            employee.password = generateRandomPassword()
            employee.shopOwnerId = this.state.shopOwnerId
            signUp(employee).then((response) => {
                notification.success({
                    message: "CEMS",
                    description: "You are successfully registered!"
                })
                hideAddEmployeeModal()
                form.resetFields()
                loadEmployees()
              }).catch((error) => {
                notification.error({
                    message: 'CEMS',
                    description: 'Errors:' + error.message
                })
              })
          }
        })
       
    }

    resetForm = () => {
        this.formRef.props.form.resetFields()
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render () {
        const { columns, employeesList, isShowModal } = this.state
        const { saveFormRef, addEmployee, resetForm, showAddEmployeeModal, hideAddEmployeeModal } = this
        return (
            <div className="employees-container">
                <Button type="primary" className="btn-add-employee-modal" onClick={showAddEmployeeModal}>Add new employee</Button>
                <Table columns={columns} dataSource={employeesList} />
                <WrappedAddEmployeeModal wrappedComponentRef={saveFormRef} onCancel={hideAddEmployeeModal} visible={isShowModal} handleSubmit={addEmployee} resetForm={resetForm} />
            </div>
        )
    }
}