import React from 'react'
import { Select, Row, Col } from 'antd'

const Option = Select.Option;

const renderOption = (item, index) => {
    return <Option key={index} value={item.id}>{`${item.firstName} ${item.lastName}`}</Option> 
}

const renderSelectItem = (data) => {
    return data && data.length > 0 ? data.map(renderOption) : []
}

export default function EmployeeSelection (props) {
    const { onDataChange, data, value } = props

    return (
        <Row>
            <Col span="6">Select:</Col>
            <Col span="6"><Select onChange={onDataChange} value={value} style={{ width: 160 }}>{renderSelectItem(data)}</Select></Col>
        </Row>
    )
}
