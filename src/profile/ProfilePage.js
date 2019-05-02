import React, { PureComponent } from 'react'
import ProfileForm from './ProfileForm'
import './profile.css'
import { loadProfile, updateProfile } from '../util/APIUtils'
import { notification } from 'antd';

export default class ProfilePage extends PureComponent {
    state = {
        fields: {}
    }

    componentDidMount = () => {
        this.loadProfileData()
    }

    loadProfileData = () => {
        const { currentUser } = this.props
        loadProfile(currentUser.id).then((response) => {
            if(response && response.id === currentUser.id) {
                this.setState((prevState) =>({
                    ...prevState,
                    fields: {
                        ...response
                    }
                }))
            }
        })
    }

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: {
                ...fields,
                ...changedFields
            }
        }))
    }

    saveProfileData = (e) => {
        e.preventDefault()
        const form = this.formRef.props.form
        const { currentUser } = this.props

        form.validateFields((errors, values) => {
            if(!errors) {
                const profileData = {
                    ...values,
                    id: currentUser.id
                }
                updateProfile(profileData).then((response) => {
                    if (response && response.success)
                        notification.success({
                            message: 'CEMS',
                            description: response.message
                        })
                }).catch((error) => {
                    notification.error({
                        message: 'CEMS',
                        description: `${error.message}`
                    })
                })
            }
        }) 
       
    }

    resetProfileData = () => {
        this.loadProfileData()
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render () {
        const { handleFormChange, saveProfileData, saveFormRef, resetProfileData } = this
        const { fields } = this.state
        return (
            <div className="profile-container">
                <h1 className="page-title">profile management</h1>
                <div className="page-body">
                    <ProfileForm wrappedComponentRef={saveFormRef} {...fields} onChange={handleFormChange} onSubmit={saveProfileData} onReset={resetProfileData}/>
                </div>
            </div>
        )
    }
}