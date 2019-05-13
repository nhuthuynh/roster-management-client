import React, { Component } from 'react'
import { loadLeaveRequestsInfoOfAnEmployee } from '../util/APIUtils'
import { notification } from 'antd'
import LeaveInfo from '../leave/LeaveInfo'
import EmployeeSelection from '../common/EmployeesSelection'

export default class EmployeesPage extends Component {
    state = {
        leaveInfo: {}
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

    onChangeEmployee = (value) => {
        this.loadLeaveRequestsInfo(value)
    }

    render () {
        const { currentUser } = this.props
        const { leaveInfo } = this.state
        return (
            <div className="report-container">
                <h1 className="page-title">report</h1>
                <div className="page-body">
                    <EmployeeSelection onChangeEmployee={this.onChangeEmployee} currentUser={currentUser}/>
                    <LeaveInfo data={leaveInfo} />
                </div>
            </div>
        )
    }
}