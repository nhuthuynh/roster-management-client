import React, { Component, PureComponent } from 'react'
import { Input, Checkbox, Tooltip } from 'antd'
import { formatNumberLessThanTen } from '../util/helper'

export default class TimeControl extends PureComponent {

    render () {
        const { mode, onCheckBoxChange, index, onInputChange, onInputBlur, 
                startHour, startMinute, endHour, endMinute, available, day } = this.props
        
        let startTime = "", endTime = "",
            startTimeTooltipTitle = "Enter start time in HH:mm format",
            endTimeTooltipTitle = "Enter end time in HH:mm format"

        if (!available && mode === "view") {
            startTime = "N/A"
            endTime = "N/A"
        } else {
            startTime = `${formatNumberLessThanTen(startHour)}:${formatNumberLessThanTen(startMinute)}`
            endTime = `${formatNumberLessThanTen(endHour)}:${formatNumberLessThanTen(endMinute)}`
        }

        return (
            <div className="time-control-container">
                <label className="time-control-item time-control-day">{ day }</label>
                <span className="time-control-item">from</span>
                {
                    mode === "view" ? 
                    <label className="ant-input time-control-item time-control-input startTime">{startTime}</label>
                    :
                    <Tooltip trigger={['focus']} title={startTimeTooltipTitle} placement="topLeft" overlayClassName="numeric-input">
                        <Input className="time-control-item time-control-input startTime" defaultValue={startTime} onChange={(e) => onInputChange(e, index, "start")} onBlur={(e) => onInputBlur(e, index, "start")} />
                    </Tooltip>
                }
                <span className="time-control-item">to</span>
                {
                    mode === "view" ? 
                    <label className="ant-input time-control-item time-control-input startTime">{endTime}</label>
                    :
                    <Tooltip trigger={['focus']} title={endTimeTooltipTitle} placement="topLeft" overlayClassName="numeric-input">
                        <Input className="time-control-item time-control-input endTime" defaultValue={endTime}  onChange={(e) => onInputChange(e, index, "end")} onBlur={(e) => onInputBlur(e, index, "end")} />
                    </Tooltip>
                }
                {
                    mode === "edit" ?
                    <Checkbox value={!available} checked={!available} onChange={() => { onCheckBoxChange(index) }}>is not available</Checkbox>
                    :
                    null
                }
                
            </div>)
    }
}