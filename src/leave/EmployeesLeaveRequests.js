import React, { PureComponent } from 'react'
import { Table } from 'antd'

export default class EmployeesLeaveRequestLists extends PureComponent {
    state = {
        columns: [{
            title: 'First Name',
            dataIndex: 'employeeFirstName',
            sorter: (a, b) => a.employeeFirstName.length - b.employeeFirstName.length,
            sortDirections: ['descend'],
        }, {
            title: 'Last Name',
            dataIndex: 'employeeLastName',
            sorter: (a, b) => a.employeeLastName.length - b.employeeLastName.length,
            sortDirections: ['descend'],
        }, {
            title: 'From date',
            dataIndex: 'fromDate',
        }, {
            title: 'To date',
            dataIndex: 'toDate',
        }, {
            title: 'Note',
            dataIndex: 'note',
        }, {
            title: 'Action',
            dataIndex: 'id',
            render: (text, record, index) => 
            (<div>
                <a href="#" onClick={() => this.props.approveLeaveRequest(record.id)}>Approve</a>
                <a href="#" onClick={() => this.props.denyLeaveRequest(record.id)}>Deny</a>
            </div>)
        }]
    }

    render () {
        const { columns } = this.state
        const { data } = this.props
        return (
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
            >
            </Table>
        )
    }
}
