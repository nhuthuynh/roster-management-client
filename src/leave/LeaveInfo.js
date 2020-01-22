import React from 'react'
import { Row, Col, Table } from 'antd'
import { LEAVE_STATUS_VALUES } from '../constants'

const columns = [{
    title: 'Leave start date',
    dataIndex: 'fromDate',
  }, {
    title: 'Leave end date',
    dataIndex: 'toDate',
  }, {
    title: 'Number of dates',
    dataIndex: 'numberOfOffDates'
  }, {
    title: 'Status',
    dataIndex: 'status',
    render: (text) => (LEAVE_STATUS_VALUES[text])
  }]

export default function LeaveInfo(props) {
    const { data } = props
    const { leaveRequests } = data
    
    return (
            <div className="leave-info">
                <div className="leave-info-box">
                    <h3 className="sub-title">Leave summary</h3>
                    <Row type="flex" justify="start" align="middle" gutter={8}>
                        <Col span="16"><span>Leave Balance: </span></Col>
                        <Col span="8"><span>{ data.leaveBalance }</span></Col>
                    </Row>
                    <Row type="flex" justify="start" align="middle" gutter={8}>
                        <Col span="16"><span>Pending Leave(s): </span></Col>
                        <Col span="8"><span>{ data.pendingLeave }</span></Col>
                    </Row>
                </div>
                {
                    leaveRequests && leaveRequests.length > 0 ? 
                    <Row type="flex" justify="start" align="middle" gutter={8}>
                        <Col span="24">
                            <Table 
                                columns={columns}
                                dataSource={leaveRequests}
                                rowKey="id"/>
                        </Col>
                    </Row> : null
                }
            </div>
        )
}