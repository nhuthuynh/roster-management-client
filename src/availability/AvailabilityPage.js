import React, { Component } from 'react'

import { loadAvailabilities, saveAvailabilities } from '../util/APIUtils'
import { notification, Button } from 'antd'
import AvailabilityDay from './AvailabilityDay'
import './availability.css'
import { REG_TIME_FORMAT } from '../constants'
import { formatNumberWithLeadingZero, isValidTime, copyArray } from '../util/helper'

export default class AvailabilityPage extends Component {
    state = {
        availabilityList: [],
        originalAvailabilityList: [],
        isLoading: true,
        mode: "view"
    }

    loadData = () => {
        const { currentUser } = this.props

        loadAvailabilities(currentUser.id).then((response) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    availabilityList: response,
                    originalAvailabilityList: copyArray(response),
                    isLoading: false
                }
            })    
        }).catch((error) => {
            notification.error({
                message: "CEMS",
                description: "Failed to load availabilities!"
            })
        })
    }

    saveAvailabilities = () => {
        const { availabilityList } = this.state
        const { currentUser } = this.props

        if (this.validateAvalabilities(availabilityList)) {
            saveAvailabilities({availabilityList, employeeId: currentUser.id }).then((response) => {
                this.setState((prevState) => {
                    return {
                        ...prevState,
                        originalAvailabilityList: copyArray(availabilityList),
                        mode: "view"
                    }
                })
                notification.success({
                    message: "CEMS",
                    description: "Update availabilities successfully!"
                })
            }).catch((error) => {
                notification.error({
                    message: "CEMS",
                    description: `${error}`
                })
            })
        } else {
            notification.error({
                message: "CEMS",
                description: "Please enter a number in format HH:mm"
            })
        }
    }

    validateAvalabilities = (availabilityList) => {
        for (let avaiIndex = 0, avaiLens = availabilityList.length; avaiIndex < avaiLens; avaiIndex++) {
            let startTime = formatNumberWithLeadingZero(availabilityList[avaiIndex].startHour, availabilityList[avaiIndex].startMinute)
            let endTime = formatNumberWithLeadingZero(availabilityList[avaiIndex].endHour, availabilityList[avaiIndex].endMinute)
            if (!isValidTime(startTime, REG_TIME_FORMAT) || !isValidTime(endTime, REG_TIME_FORMAT)) { 
                    return false
            }
        }

        return true
    }

    componentDidMount = () => {
        this.loadData()
    }

    switchView = (viewMode) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                mode: viewMode
            }
        })
    }

    cancelEditMode = () => {
        this.setState((prevState) => {
            const { originalAvailabilityList } = prevState
            return {
                ...prevState,
                mode: "view",
                availabilityList: copyArray(originalAvailabilityList)
            }
        })
    }

    switchEditMode = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                mode: "edit"
            }
        })
    }

    onInputChange = (e, index, prefixTime) => {
        const { value } = e.target
        
        if (isValidTime(value, REG_TIME_FORMAT)) {
            this.setState((prevState) => {
                let { availabilityList } = prevState
                let timeValues = value.split(":")
                availabilityList[index][prefixTime+"Hour"] = parseInt(timeValues[0], 10)
                availabilityList[index][prefixTime+"Minute"] = parseInt(timeValues[1], 10)
                return {
                    ...prevState,
                    availabilityList
                }
            })
        }
        
    }

    onInputBlur = (e, index, prefixTime) => {
        const { value } = e.target
        if (!isValidTime(value, REG_TIME_FORMAT)) { 
            const { availabilityList } = this.state
            notification.error({
                message: "CEMS",
                description: "Please enter a number in format HH:mm and is not greater than 23: 59"
            })
            
            e.target.value = formatNumberWithLeadingZero(availabilityList[index][`${prefixTime}Hour`], availabilityList[index][`${prefixTime}Minute`])
        }
    }

    renderAvailabilityDays = () => {
        return this.state.availabilityList &&  this.state.availabilityList.length === 0 ? 
        null 
        : 
        this.state.availabilityList
            .map(this.mapEachAvalabilityDay)
    }

    mapEachAvalabilityDay = (el, index) => {

        const { mode } = this.state
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
            onCheckBoxChange={this.changeAvailability} 
            onInputChange={this.onInputChange} 
            onInputBlur={this.onInputBlur}
             />
    }

    changeAvailability = (index) => {
        this.setState((prevState) => {
            let { availabilityList } = prevState
            let { available } = availabilityList[index]
            availabilityList[index].available = !available
            return {
                ...prevState,
                availabilityList
            }
        })
    }

    render () {
        const { cancelEditMode, switchEditMode, saveAvailabilities, renderAvailabilityDays } = this
        const { mode } = this.state
        
        return (
            <div className="availability-container">
                <h1 className="page-title">my availability</h1>
                <div className="page-body">
                    {renderAvailabilityDays()}
                    {
                        mode === "view" ? <Button className="btn-first" onClick={switchEditMode} type="primary">Edit</Button> : null
                    }
                    {
                        mode !== "view" ? <Button onClick={cancelEditMode}>Cancel</Button> : null
                    }
                    {
                        mode !== "view" ? <Button className="btn-first" onClick={saveAvailabilities} type="primary">Save</Button> : null
                    }
                </div>
                <div>
                    <p></p>
                    <p><u><b>Note</b></u>:</p>
                    <p>Any changes to your availability will not affect currently existing roster. It will only be effective the week after the last created roster.</p>
                    <p>For any temporary or urgent changes, please contact your supervisor.</p>
                    <p>Please enter a maximum of 23:59 for end time.</p>
                    <p>If the times are left as default (from 00:00 to 00:00), you will be considered available all day.</p>
                </div>
            </div>
        )
    }
}