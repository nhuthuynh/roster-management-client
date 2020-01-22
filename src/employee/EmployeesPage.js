import React, { Component } from 'react'
import { Table, Button, notification } from 'antd'
import { loadEmployees, signUp, resignEmployees } from '../util/APIUtils'
import { generateRandomPassword } from '../util/helper'
import WrappedAddEmployeeModal from './AddEmployeeModal'

import './employee.css'

const columns = [{
    title: 'First Name',
    dataIndex: 'firstName',
    sorter: (a, b) => a.firstName.length - b.firstName.length,
    sortDirections: ['descend'],
}, {
    title: 'Last Name',
    dataIndex: 'lastName',
    sorter: (a, b) => a.lastName.length - b.lastName.length,
    sortDirections: ['descend'],
}, {
    title: 'Email',
    dataIndex: 'email',
}, {
    title: 'Phone number',
    dataIndex: 'phoneNumber'
}, {
    title: '',
    dataIndex: 'resigned',
    render: value => <span>{ value ? 'Resigned' : '' }</span>,
    filters: [ {
        text: 'Resigned',
        value: 'true'
    }, {
        text: 'Employed',
        value: 'false'
    }],
    onFilter: (value, record) => {
        return record.resigned.toString() === value 
    }
}]

export default class EmployeesPage extends Component {
    state = {
        employeesList: [],
        isLoading: true,
        isShowModal: false,
        selectedRowKeys: []
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

    resignEmployees = () => {
        const { selectedRowKeys } = this.state

        if (selectedRowKeys.length === 0) {
            notification.info({
                message: 'CEMS',
                description: "Please select at least an employee to resign!"
            })
        } else {
            
            resignEmployees({employeesIdList: selectedRowKeys}).then((response) => {
                if (response.success) {
                    notification.success({
                        message: 'CEMS',
                        description: 'Update successfully!'
                    })
                    this.loadEmployees()
                }
            }).catch((error) => {
                notification.error({
                    message: 'CEMS',
                    description: 'Errors:' + error.message
                })
              })
        }
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
                    description: "New employee is added!"
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

    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys]

        if(selectedRowKeys.indexOf(record.id) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.id))
        } else {
            selectedRowKeys.push(record.id)
        }

        this.setState((prevState, prevProps) => {
            return {
                ...prevState,
                selectedRowKeys
            }
        })
    }

    onSelectedRowKeysChange = (selectedRowKeys) => {

        this.setState((prevState, prevProps) => {
            return {
                ...prevState,
                selectedRowKeys
            }
        })
    }

    render () {
        const { employeesList, isShowModal, selectedRowKeys } = this.state
        const { saveFormRef, addEmployee, onSelectedRowKeysChange, showAddEmployeeModal, hideAddEmployeeModal, resignEmployees } = this
        const rowSelection = {
            selectedRowKeys,
            onChange: onSelectedRowKeysChange,
          }
        return (
            <div className="employees-container">
                <Button type="primary" className="btn-add-employee-modal" onClick={showAddEmployeeModal}>Add new employee</Button>
                <Button type="primary" className="btn-resign" onClick={resignEmployees}>Resign employee</Button>
                <Table rowSelection={rowSelection} rowKey="id" columns={columns} dataSource={employeesList} 
                        onRow={(record) => ({
                        onClick: () => {
                            this.selectRow(record);
                            },
                        })
                    }
                />
                <WrappedAddEmployeeModal wrappedComponentRef={saveFormRef} onCancel={hideAddEmployeeModal} visible={isShowModal} handleSubmit={addEmployee} />
            </div>
        )
    }
}