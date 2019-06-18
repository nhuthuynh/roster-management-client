import React, { Component } from 'react'
import AvailabilityDay from './AvailabilityDay'
import { Button } from 'antd'
import { formatNumberWithLeadingZero } from '../util/helper'

export default class AvailabilityGroup extends Component {

    mapEachAvalabilityDay = (el, index) => {

        const { mode, onInputChange, onInputBlur, onChangeAvailability } = this.props
        const { available, day, startHour, startMinute, endHour, endMinute } = el
        let startTime = "", endTime= ""
        if (!available && mode === "view") {
            startTime = "N/A"
            endTime = "N/A"
        } else {
            startTime = formatNumberWithLeadingZero(startHour, startMinute)
            endTime = formatNumberWithLeadingZero(endHour, endMinute)
        }

        return <AvailabilityDay key={index} startTime={startTime} endTime={endTime} day={day} index={index} 
            startTimeTooltipValue={"Enter start time in HH:mm format"}
            endTimeTooltipValue={"Enter end time in HH:mm format"}
            mode={mode}
            available={available}
            onCheckBoxChange={onChangeAvailability} 
            onInputChange={onInputChange} 
            onInputBlur={onInputBlur}
             />
    }

    renderAvailableDays = (availabilities) => {
        if (!availabilities) return null
        
        return availabilities.map(this.mapEachAvalabilityDay) 
        
    }

    render () {
        const { mode, data, onCancelEditMode, onSave, onSwitchEditMode, loading } = this.props
        const { renderAvailableDays } = this
        return (
            <div className="availability-group">
            {
                renderAvailableDays(data)
            }
            {
                mode === "view" ? <Button className="btn-first" onClick={onSwitchEditMode} type="primary">Edit</Button> : null
            }
            {
                mode !== "view" ? <Button onClick={onCancelEditMode}>Cancel</Button> : null
            }
            {
                mode !== "view" ? <Button className="btn-first" onClick={onSave} type="primary" loading={loading}>Save</Button> : null
            }
            </div>
        )
    }
}