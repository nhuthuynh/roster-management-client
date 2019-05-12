import React, { Component } from 'react'
import { submitLeaveRequest, loadLeaveRequestsInfoOfAnEmployee, denyLeaveRequest, approveLeaveRequest, loadEmployeesLeaveRequests } from '../util/APIUtils'
import LeaveSubmissionForm from './LeaveSubmissionForm'
import { LEAVE_STATUS, DATE_MOMENT_FORMART, EMPLOYEE_ROLES } from '../constants'
import moment from 'moment'
import EmployeesLeaveRequests from './EmployeesLeaveRequests'
import LeaveInfo from './LeaveInfo'
import { getShopOwnerId } from '../util/helper'
import './leave.css'
import { notification } from 'antd';

export default class EmployeesPage extends Component {
    state = {
        fromDate: moment(new Date(), DATE_MOMENT_FORMART),
        toDate: moment(new Date(), DATE_MOMENT_FORMART),
        openToDate: false,
        noteRef: null,
        leaveInfo: {},
        employeesLeaveRequests: []
    }

    componentDidMount() {
        const { currentUser } = this.props
        if (currentUser && currentUser.role !== EMPLOYEE_ROLES.admin) {
            this.loadLeaveRequestsInfo(currentUser.id)
        }

        if (currentUser && currentUser.role !== EMPLOYEE_ROLES.employee) {
            this.loadEmployeesLeaveRequests(getShopOwnerId(currentUser))
        }
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

    onDisabledFromDate = (fromDate) => {
        const { toDate } = this.state
        
        if (!fromDate || !toDate) {
            return false;
        }
        
        return fromDate.valueOf() > toDate.valueOf()
    }

    onDisabledToDate = (toDate) => {
        const { fromDate } = this.state
        if (!toDate || !fromDate) {
            return false
        }
        return toDate.valueOf() <= fromDate.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
          [field]: value,
        })
    }

    onFromDateChange = (value) => {
        this.onChange('fromDate', value)
    }

    onToDateChange = (value) => {
        this.onChange('toDate', value)
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState((prevState) => ({ 
                ...prevState,
                openToDate: true 
            }))
        }
    }
    
    handleEndOpenChange = (open) => {
        this.setState((prevState) => ({ 
            ...prevState,
            openToDate: open
        }))
    }

    onSubmitLeaveRequest = () => {

        const { currentUser } = this.props
        const { noteRef, fromDate, toDate } = this.state

        let leaveRequest = {
            employeeId: currentUser.id,
            fromDate: fromDate.format(DATE_MOMENT_FORMART),
            toDate: toDate.format(DATE_MOMENT_FORMART),
            leaveStatus: LEAVE_STATUS.pending,
            note: noteRef.input.value || ''
        }

        submitLeaveRequest(leaveRequest).then((response) => {
            if (response && response.success) {
                notification.success({
                    message: 'CEMS - Leave Management',
                    description: `${(response && response.message) || 'Leave request is submitted!'}`
                })
                this.loadLeaveRequestsInfo(currentUser.id)
            }
            
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Leave Management',
                description: `${error}`
            })
        })
    }

    saveNoteRef = (noteRef) => {
        this.setState((prevState) => ({
            ...prevState,
            noteRef: noteRef
        }))
    }

    loadEmployeesLeaveRequests = (shopOwnerId) => {
        loadEmployeesLeaveRequests(shopOwnerId).then((response) => {
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

    render () {
        const { onSubmitLeaveRequest, onDisabledFromDate, onDisabledToDate, onFromDateChange, onToDateChange, handleStartOpenChange, handleEndOpenChange, saveNoteRef, approveLeaveRequest, denyLeaveRequest } = this
        const { fromDate, toDate, openToDate, leaveInfo, employeesLeaveRequests } = this.state
        const { currentUser } = this.props
        const { role } = currentUser

        return (
            <div className="leave-container">
                <h1 className="page-title">leave management</h1>
                <div className="page-body">
                    {
                        role !== EMPLOYEE_ROLES.employee ? <EmployeesLeaveRequests data={employeesLeaveRequests} approveLeaveRequest={approveLeaveRequest} denyLeaveRequest={denyLeaveRequest} /> : null
                    }
                    {
                        role !== EMPLOYEE_ROLES.admin ? <LeaveInfo data={leaveInfo} /> : null
                    }
                    {
                        role !== EMPLOYEE_ROLES.admin ? 
                        <LeaveSubmissionForm 
                            fromDate={fromDate} 
                            openToDate={openToDate} 
                            onDisabledFromDate={onDisabledFromDate} 
                            onDisabledToDate={onDisabledToDate} 
                            toDate={toDate}
                            onSubmit={onSubmitLeaveRequest}
                            saveNoteRef={saveNoteRef}
                            onFromDateChange={onFromDateChange} 
                            onToDateChange={onToDateChange}
                            handleStartOpenChange={handleStartOpenChange} 
                            handleEndOpenChange={handleEndOpenChange} />
                        : null
                    }
                </div>
        </div>
        )
    }
}