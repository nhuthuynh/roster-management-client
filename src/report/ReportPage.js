import React, { Component } from 'react'
import { loadEmployees, loadLeaveRequestsInfoOfAnEmployee } from '../util/APIUtils'
import { Select, Row, Col, notification } from 'antd'
import { getShopOwnerId } from '../util/helper'
import LeaveInfo from '../leave/LeaveInfo'
const Option = Select.Option;

export default class EmployeesPage extends Component {
    state = {
        employees: [],
        leaveInfo: {}
    }

    componentDidMount() {
        this.loadEmployees()
    }

    renderEmployeesOption = (item, index) => {
        console.log(item)
        return <Option key={index} value={item.id}>{`${item.firstName} ${item.lastName}`}</Option> 
    }

    renderSelectItem = (employees) => {
        return employees && employees.length > 0 ? employees.map(this.renderEmployeesOption) : []
    }

    loadEmployees = () => {
        const { currentUser } = this.props
        
        loadEmployees(getShopOwnerId(currentUser)).then((response) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    employees: [{ id: 0, firstName: '', lastName: '' }].concat(response)
                }
            })
        })
    }

    loadLeaveRequestsInfo = (id) => {
        if (!id) 
            this.setState((prevState) => ({
                ...prevState,
                leaveInfo: []
            }))

        loadLeaveRequestsInfoOfAnEmployee(id).then((response) => {
            console.log(response)
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

    onChangeEmployee = (value) => {
        this.loadLeaveRequestsInfo(value)
    }

    render () {
        const { employees, leaveInfo } = this.state
        return (
            <div className="report-container">
                <h1 className="page-title">report</h1>
                <div className="page-body">
                    <Row>
                        <Col span="6">Select:</Col>
                        <Col span="6"><Select onChange={this.onChangeEmployee} style={{ width: 160 }}>{this.renderSelectItem(employees)}</Select></Col>
                    </Row>
                    <LeaveInfo data={leaveInfo} />
                </div>
            </div>
        )
    }
}