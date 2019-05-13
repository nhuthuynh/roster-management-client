import React, { Component } from 'react'
import { EMPLOYEE_ROLES } from '../constants'
import './leave.css'
import LeavePageForEmployee from './LeavePageForEmployee'
import LeavePageForManagement from './LeavePageForManagement';

export default class EmployeesPage extends Component {
    render () {
        const { currentUser } = this.props
        return (
            <div className="leave-container">
                <h1 className="page-title">leave management</h1>
                {
                    currentUser.role === EMPLOYEE_ROLES.admin ? <LeavePageForManagement currentUser={currentUser} /> : <LeavePageForEmployee currentUser={currentUser} />
                }
        </div>
        )
    }
}