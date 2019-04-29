import React, { Component } from 'react'

import { loadAvailabilities, saveAvailabilities } from '../util/APIUtils'
import { notification, Button } from 'antd'
import TimeControl from './TimeControl'
import './availability.css'

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
            this.setState((prevState, prevProps) => {
                return {
                    ...prevState,
                    availabilityList: response,
                    originalAvailabilityList: response,
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

        saveAvailabilities({availabilityList, employeeId: currentUser.id }).then((response) => {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    originalAvailabilityList: availabilityList,
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
                availabilityList: originalAvailabilityList
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
        const { value } = e.target;
        const reg = /^(?:\d|[01]\d|2[0-3]):[0-5]\d$/;
        if ((!Number.isNaN(value) && reg.test(value))) {
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

    }

    renderAvailabilityItems = () => {
        return this.state.availabilityList &&  this.state.availabilityList.length === 0 ? 
        null 
        : 
        this.state.availabilityList
            .map((el, index) => 
            <TimeControl key={index} {...el} index={index} mode={this.state.mode} 
                onCheckBoxChange={this.changeAvailability} 
                onInputChange={this.onInputChange} 
                onInputBlur={this.onInputBlur} />)
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
        const { cancelEditMode, switchEditMode, saveAvailabilities, renderAvailabilityItems } = this
        const { mode } = this.state
        
        return (
            <div className="availability-container">
                <h1 className="page-title">my availability</h1>
                <div className="page-body">
                    {renderAvailabilityItems()}
                    {
                        mode === "view" ? <Button className="btn-first" onClick={switchEditMode} type="primary">Edit</Button> : null
                    }
                    {
                        mode !== "view" ? <Button className="btn-first" onClick={saveAvailabilities} type="primary">Save</Button> : null
                    }
                    {
                        mode !== "view" ? <Button onClick={cancelEditMode}>Cancel</Button> : null
                    }
                </div>
            </div>
        )
    }
}