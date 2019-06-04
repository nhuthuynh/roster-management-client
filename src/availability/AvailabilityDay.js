import React, { Component } from 'react'
import { Input, Checkbox, Tooltip } from 'antd'

export default class AvailabilityDay extends Component {

    render () {
        const { mode, onCheckBoxChange, index, onInputChange, onInputBlur, 
            startTimeTooltipValue, endTimeTooltipValue,
            startTime, endTime, available, day } = this.props
            
        return (
            <div className="time-control-container">
                <label className="time-control-item time-control-day">{ day }</label>
                <span className="time-control-item">from</span>
                {
                    mode === "view" ? 
                    <label className="time-control-item time-control-input startTime">{startTime}</label>
                    :
                    <Tooltip trigger={['focus']} title={startTimeTooltipValue} placement="topLeft" overlayClassName="numeric-input">
                        <Input className="time-control-item time-control-input startTime" defaultValue={startTime} onChange={(e) => onInputChange(e, index, "start")} onBlur={(e) => onInputBlur(e, index, "start")} />
                    </Tooltip>
                }
                <span className="time-control-item">to</span>
                {
                    mode === "view" ? 
                    <label className=" time-control-item time-control-input startTime">{endTime}</label>
                    :
                    <Tooltip trigger={['focus']} title={endTimeTooltipValue} placement="topLeft" overlayClassName="numeric-input">
                        <Input className="time-control-item time-control-input endTime" defaultValue={endTime} onChange={(e) => onInputChange(e, index, "end")} onBlur={(e) => onInputBlur(e, index, "end")} />
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