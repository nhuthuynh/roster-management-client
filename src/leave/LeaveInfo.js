import React, { PureComponent } from 'react'
import {  } from 'antd'

export default class LeaveInfo extends PureComponent {
    
    render () {
        return (
            <div className="leave-info">
                <p>
                    <span>Your leave balance: </span> <span></span>
                    <span>Your pending leave: </span>
                </p>
            </div>
        )
    }
}