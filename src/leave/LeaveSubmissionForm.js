import React, { PureComponent } from 'react'
import { DatePicker, Row, Col } from 'antd'
import disabledDate from '../util/helper'

const RangePicker = DatePicker.RangePicker

export default function LeaveSubmissionForm(props) {
        const { onSubmit, onChange} = props
        return (
            <div className="leave-submission-form">
                <Row>
                    <Col span="6">
                        <RangePicker
                            disabledDate={disabledDate}
                            format="dd-MM-YYYY"
                            onChange={onChange}
                        />
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