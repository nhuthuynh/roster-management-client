import React from 'react'

export default function LeavePageForManagement(props) {
    const { employeesLeaveRequests, approveLeaveRequest, denyLeaveRequest } = props
        
    return (
        <div className="page-body">
            <EmployeesLeaveRequests data={employeesLeaveRequests} approveLeaveRequest={approveLeaveRequest} denyLeaveRequest={denyLeaveRequest} />
        </div>
        
    )
}