import React, { Component } from 'react'
import { DatePicker, Row, Col, Button, Input , notification} from 'antd'
import { DATE_MOMENT_FORMART, LEAVE_STATUS } from '../constants'
import { submitLeaveRequest } from '../util/APIUtils'
import moment from 'moment'

export default class LeaveSubmissionForm extends Component {

    state = {
        fromDate: moment(new Date(), DATE_MOMENT_FORMART),
        toDate: moment(new Date(), DATE_MOMENT_FORMART),
        openToDate: false,
        noteRef: null
    }

    onDisabledFromDate = (fromDate) => {
        const { toDate } = this.state
        
        if (!fromDate || !toDate) {
            return false;
        }
        
        return moment(new Date(), DATE_MOMENT_FORMART).valueOf() > fromDate.valueOf()
    }

    onDisabledToDate = (toDate) => {
        const { fromDate } = this.state
        if (!toDate || !fromDate) {
            return false
        }
        return toDate.valueOf() < fromDate.valueOf();
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

        const { currentUser, onLeaveRequestSubmitSuccess } = this.props
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
                onLeaveRequestSubmitSuccess && onLeaveRequestSubmitSuccess(currentUser.id)
            }
            
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Leave Management',
                description: `${(error && error.message) || 'Cannot submit leave request!'}`
            })
        })
    }

    saveNoteRef = (noteRef) => {
        this.setState((prevState) => ({
            ...prevState,
            noteRef: noteRef
        }))
    }

    render () {
        const { fromDate, toDate, openToDate } = this.state
        const { 
            saveNoteRef,
            onSubmitLeaveRequest, 
            onDisabledFromDate, onFromDateChange, handleStartOpenChange,
            onDisabledToDate, onToDateChange, handleEndOpenChange 
            } = this
        return (
            <div className="leave-submission-form">
                <Row type="flex" justify="space-around" align="middle" gutter={8}>
                    <Col span="2">
                        <span>From date: </span>
                    </Col>
                    <Col span="4">
                        <DatePicker
                            format={DATE_MOMENT_FORMART}
                            defaultValue={fromDate}
                            disabledDate={onDisabledFromDate}
                            onChange={onFromDateChange}
                            onOpenChange={handleStartOpenChange}
                        />
                    </Col>
                    <Col span="2">
                    <span>To date: </span>
                    </Col>
                    <Col span="4">
                        <DatePicker
                            format={DATE_MOMENT_FORMART}
                            defaultValue={toDate}
                            disabledDate={onDisabledToDate}
                            onChange={onToDateChange}
                            onOpenChange={handleEndOpenChange}
                            open={openToDate}
                        />
                    </Col>
                    <Col span="3">
                        <span>Leave note: </span>
                    </Col>
                    <Col span="3">
                        <Input ref={saveNoteRef} />
                    </Col>
                    <Col span="3">
                    <Button key="submit" type="primary" onClick={onSubmitLeaveRequest}>Submit</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}