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
    title: 'Status',
    dataIndex: 'status',
    render: (text) => (LEAVE_STATUS_VALUES[text])
  }]

export default function LeaveInfo(props) {
    const { data } = props
    const { leaveRequests } = data
    
    return (
            <div className="leave-info">
                {
                    leaveRequests && leaveRequests.length > 0 ? 
                    <Row>
                        <Col span="24">
                            <Table 
                                columns={columns}
                                dataSource={leaveRequests}
                                rowKey="id"/>
                        </Col>
                    </Row> : null
                }
                <Row>
                    <Col span="3"><span>leave balance</span></Col>
                    <Col span="3"><span>{ data.leaveBalance }</span></Col>
                </Row>
                <Row>
                    <Col span="3"><span>leave pending</span></Col>
                    <Col span="3"><span>{ data.pendingLeave }</span></Col>
                </Row>
            </div>
        )
}