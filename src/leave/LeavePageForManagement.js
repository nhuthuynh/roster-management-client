import React, { Component } from 'react'
import { denyLeaveRequest, approveLeaveRequest, loadEmployeesLeaveRequestsForManager, loadEmployeesLeaveRequests } from '../util/APIUtils'
import { EMPLOYEE_ROLES } from '../constants'
import { getShopOwnerId } from '../util/helper'
import { notification } from 'antd'
import EmployeesLeaveRequests from './EmployeesLeaveRequests'

export default class LeavePageForManagement extends Component {

    state = {
        employeesLeaveRequests: []
    }

    componentDidMount() {
        const { currentUser } = this.props

        if ( currentUser.role === EMPLOYEE_ROLES.admin ) {
            this.loadEmployeesLeaveRequests(loadEmployeesLeaveRequests, getShopOwnerId(currentUser))
        } else {
            this.loadEmployeesLeaveRequests(loadEmployeesLeaveRequestsForManager, getShopOwnerId(currentUser))
        }
    }

    loadEmployeesLeaveRequests = (api, shopOwnerId) => {
        api && api(shopOwnerId).then((response) => {
            this.setState((prevState) => ({
                ...prevState,
                employeesLeaveRequests: response
            }))
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Leave Management',
                description: `${(error && error.message) || 'Error'}`
            })
        })
    }

    approveLeaveRequest = (leaveRequestId) => {
        const { currentUser } = this.props
        approveLeaveRequest({ managerId: currentUser.id, leaveRequestId, note: '' }).then((response) => {
            if(response && response.success) {
                notification.success({
                    message: 'CEMS - Leave Management',
                    description: `Leave request is approved!`    
                })
                this.loadEmployeesLeaveRequests(getShopOwnerId(currentUser))
            }
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Leave Management',
                description: `${(error && error.message) || 'Error'}`
            })
        })
    }

    denyLeaveRequest = (leaveRequestId) => {
        const { currentUser } = this.props
        denyLeaveRequest({ managerId: currentUser.id, leaveRequestId, note: '' }).then((response) => {
            if(response && response.success) {
                notification.success({
                    message: 'CEMS - Leave Management',
                    description: `Leave request is denied!`    
                })
                this.loadEmployeesLeaveRequests(getShopOwnerId(currentUser))
            }
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Leave Management',
                description: `${(error && error.message) || 'Error'}`
            })
        })
    }

    render() {
        const { approveLeaveRequest, denyLeaveRequest } = this.props
        const { employeesLeaveRequests } = this.state
        return (
            <EmployeesLeaveRequests data={employeesLeaveRequests} approveLeaveRequest={approveLeaveRequest} denyLeaveRequest={denyLeaveRequest} />
        )
    }
}