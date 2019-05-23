import React, { Component } from 'react'
import { loadLeaveRequestsInfoOfAnEmployee, loadWorkingEmployees } from '../util/APIUtils'
import { notification } from 'antd'
import LeaveInfo from '../leave/LeaveInfo'
import EmployeeSelection from '../common/EmployeesSelection'
import { getShopOwnerId } from '../util/helper'

export default class EmployeesPage extends Component {
    state = {
        leaveInfo: {},
        employees: []
    }

    componentDidMount = () => {
        this.loadEmployees()
    }

    loadLeaveRequestsInfo = (id) => {
        if (!id) 
            this.setState((prevState) => ({
                ...prevState,
                leaveInfo: []
            }))

        loadLeaveRequestsInfoOfAnEmployee(id).then((response) => {
            this.setState((prevState) => ({
                ...prevState,
                leaveInfo: response
            }))
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Leave Management',
                description: `${(error && error.message) || 'Error'}`
            })
        })
    }

    loadEmployees = () => {
        const { currentUser } = this.props
        
        loadWorkingEmployees(getShopOwnerId(currentUser)).then((response) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    employees: [{ id: 0, firstName: '', lastName: '' }].concat(response)
                }
            })
        })
    }

    onChangeEmployee = (value) => {
        this.loadLeaveRequestsInfo(value)
    }

    render () {
        const { leaveInfo, employees } = this.state
        return (
            <div className="report-container">
                <h1 className="page-title">report</h1>
                <div className="page-body">
                    <EmployeeSelection data={employees} onDataChange={this.onChangeEmployee}/>
                    <LeaveInfo data={leaveInfo} />
                </div>
            </div>
        )
    }
}