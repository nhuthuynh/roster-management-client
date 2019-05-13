import React, { Component } from 'react'
import { loadWorkingEmployees } from '../util/APIUtils'
import { Select, Row, Col } from 'antd'
import { getShopOwnerId } from '../util/helper'

const Option = Select.Option;

export default class EmployeeSelection extends Component {

    state = {
        employees: []
    }

    componentDidMount () {
        this.loadEmployees()
    }

    loadEmployees = () => {
        const { currentUser } = this.props
        
        loadWorkingEmployees(getShopOwnerId(currentUser)).then((response) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    employees: [{ id: 0, firstName: '', lastName: '' }].concat(response)
                }
            })
        })
    }

    renderEmployeesOption = (item, index) => {
        return <Option key={index} value={item.id}>{`${item.firstName} ${item.lastName}`}</Option> 
    }

    renderSelectItem = (employees) => {
        return employees && employees.length > 0 ? employees.map(this.renderEmployeesOption) : []
    }

    render () {
        const { renderSelectItem } = this
        const { onChangeEmployee } = this.props
        const { employees } = this.state

        return (
            <Row>
                <Col span="6">Select:</Col>
                <Col span="6"><Select onChange={onChangeEmployee} style={{ width: 160 }}>{renderSelectItem(employees)}</Select></Col>
            </Row>
        )
    }
}