import React from 'react'
import { DatePicker, Row, Col, Button, Input } from 'antd'
import { DATE_MOMENT_FORMART } from '../constants'

export default function LeaveSubmissionForm(props) {
        const { onSubmit, onDisabledFromDate, onDisabledToDate, onFromDateChange, onToDateChange,
                handleStartOpenChange, handleEndOpenChange,
                fromDate, toDate,
                openToDate, saveNoteRef,
                } = props
        
        return (
            <div className="leave-submission-form">
                <Row>
                    <Col span="3">
                        <span>From date</span>
                    </Col>
                    <Col span="3">
                        <DatePicker
                            format={DATE_MOMENT_FORMART}
                            defaultValue={fromDate}
                            disabledDate={onDisabledFromDate}
                            onChange={onFromDateChange}
                            onOpenChange={handleStartOpenChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span="3">
                    <span>To date</span>
                    </Col>
                    <Col span="3">
                        <DatePicker
                            format="DD-MM-YYYY"
                            defaultValue={toDate}
                            disabledDate={onDisabledToDate}
                            onChange={onToDateChange}
                            onOpenChange={handleEndOpenChange}
                            open={openToDate}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span="3">
                        <label>Leave note</label>
                    </Col>
                    <Col span="3">
                        <Input ref={saveNoteRef} />
                    </Col>
                </Row>
                <Row>
                    <Col span="6">
                        <Button key="submit" type="primary" onClick={onSubmit}>Submit</Button>
                    </Col>
                </Row>
            </div>
        )
}