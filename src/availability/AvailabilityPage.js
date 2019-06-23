import React, { Component } from 'react'

import { loadAvailabilities, saveAvailabilities, loadRosterByTodayAndShopOwnerId } from '../util/APIUtils'
import { notification, Row, Col } from 'antd'
import { formatNumberWithLeadingZero, getShopOwnerId, copyArray, isValidTime } from '../util/helper'
import { DATE_MOMENT_FORMART, REG_TIME_FORMAT } from '../constants'
import AvailabilityGroup from './AvailabilityGroup'
import AvailabilityNotification from './AvailabilityNotification'

import moment from 'moment'

import './availability.css'

moment.utc()

export default class AvailabilityPage extends Component {
    state = {
        availabilityList: [],
        originalAvailabilityList: [],
        latestRoster: {},
        isLoading: true,
        mode: "view"
    }

    loadData = () => {
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)
        this.setLoading(true)
        Promise.all([loadAvailabilities(currentUser.id), loadRosterByTodayAndShopOwnerId(shopOwnerId)]).then(([availabilities, latestRoster]) => {
            this.setState(prevState => ({
                    ...prevState,
                    availabilityList: availabilities,
                    originalAvailabilityList: copyArray(availabilities),
                    latestRoster: latestRoster,
                    isLoading: false
                }))    
        }).catch((error) => {
            notification.error({
                message: "CEMS - Availabilities",
                description: `Error: ${error && error.message}`
            })
            this.setLoading(false)
        })
    }

    setLoading = (value) => {
        this.setState(prevState => ({
            ...prevState,
            isLoading: value   
        }))
    }

    getEffectiveDate = (latestRoster, effectiveDate) => {
        if (latestRoster && latestRoster.toDate && moment(latestRoster.toDate, DATE_MOMENT_FORMART).isSameOrAfter(moment(effectiveDate, DATE_MOMENT_FORMART))) {
            return latestRoster.toDate
        } else {
            return moment(effectiveDate, DATE_MOMENT_FORMART).isSameOrAfter(moment().utc()) ? effectiveDate : moment(new Date(), DATE_MOMENT_FORMART)
        }
    }

    saveAvailabilities = () => {
        this.setLoading(true)
        let { availabilityList, latestRoster } = this.state
        const { currentUser } = this.props
        availabilityList = availabilityList.map((el) => ({ ...el, effectiveDate: this.getEffectiveDate(latestRoster, el.effectiveDate)}))
        if (this.validateAvalabilities(availabilityList)) {
            saveAvailabilities({availabilityList, employeeId: currentUser.id, shopOwnerId: getShopOwnerId(currentUser) }).then((response) => {
                this.setState((prevState) => ({
                    ...prevState,
                    originalAvailabilityList: copyArray(availabilityList),
                    mode: "view",
                    isLoading: false
                }))
                notification.success({
                    message: "CEMS - Availability",
                    description: "Update availabilities successfully!"
                })
            }).catch((error) => {
                notification.error({
                    message: "CEMS - Availability",
                    description: `Error: ${error && error.message}`
                })
                this.setLoading(false)
            })
        } else {
            notification.error({
                message: "CEMS",
                description: "Please enter a number in format HH:mm"
            })
            this.setLoading(false)   
        }
    }

    validateAvalabilities = (avais) => {
        for (let avaiIndex = 0, avaiLens = avais.length; avaiIndex < avaiLens; avaiIndex++) {
            let startTime = formatNumberWithLeadingZero(avais[avaiIndex].startHour, avais[avaiIndex].startMinute)
            let endTime = formatNumberWithLeadingZero(avais[avaiIndex].endHour, avais[avaiIndex].endMinute)
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
                const { availabilityList } = prevState
                const [hour, minute] = value.split(":")
                availabilityList[index][prefixTime+"Hour"] = parseInt(hour, 10)
                availabilityList[index][prefixTime+"Minute"] = parseInt(minute, 10)
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

    onChangeAvailability = (index) => {
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
        const { cancelEditMode, switchEditMode, saveAvailabilities, onInputBlur, onInputChange, onChangeAvailability } = this
        const { mode, latestRoster, availabilityList, isLoading } = this.state
        
        return (
            <div className="availability-container">
                <h1 className="page-title">my availability</h1>
                <div className="page-body">
                    <Row>
                        <Col span={12}>
                            <AvailabilityGroup mode={mode} data={availabilityList} 
                                onCancelEditMode={cancelEditMode} 
                                onSwitchEditMode={switchEditMode}
                                onSave={saveAvailabilities}
                                onInputBlur={onInputBlur}
                                onInputChange={onInputChange}
                                onChangeAvailability={onChangeAvailability}
                                loading={isLoading}
                            />
                        </Col>
                        <Col span={12}>
                            <p><u><b>Note</b></u>:</p>
                            <AvailabilityNotification data={latestRoster} />
                            <p>Any changes to your availability will not affect currently existing roster. It will only be effective the week after the last created roster.</p>
                            <p>For any temporary or urgent changes, please contact your supervisor.</p>
                            <p>Please enter a maximum of 23:59 for end time.</p>
                            <p>If the times are left as default (from 00:00 to 00:00), you will be considered available all day.</p>      
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}