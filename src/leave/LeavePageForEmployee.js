import React, { Component } from 'react'
import { loadLeaveRequestsInfoOfAnEmployee } from '../util/APIUtils'
import LeaveInfo from './LeaveInfo'
import LeaveSubmissionForm from './LeaveSubmissionForm'
import LeavePageForManagement from './LeavePageForManagement'
import { notification } from 'antd'
import { EMPLOYEE_ROLES } from '../constants';

export default class LeavePageForEmployee extends Component {
    state = { 
        leaveInfo: {}
    }

    componentDidMount() {
        const { currentUser } = this.props
        this.loadLeaveRequestsInfo(currentUser.id)
    }

    loadLeaveRequestsInfo = (id) => {
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

    render () {
        const { currentUser } = this.props
        const { loadLeaveRequestsInfo } = this
        const { leaveInfo } = this.state

        return (
            <div className="page-body">
                <LeaveSubmissionForm currentUser={currentUser} onLeaveRequestSubmitSuccess={ loadLeaveRequestsInfo } />    
                <LeaveInfo data={leaveInfo} />
                {
                    currentUser.role === EMPLOYEE_ROLES.manager ? <LeavePageForManagement currentUser={currentUser} /> : null
                }
            </div>
        )
    }
    
}