import React, { Component } from 'react';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';
import AppHeader from '../common/AppHeader'
import RosterPage from '../roster/RosterPage'
import Home from '../home/home'
import EmployeesPage from '../employee/EmployeesPage'
import ProfilePage from '../profile/ProfilePage'
import AvailabilityPage from '../availability/AvailabilityPage'
import ChangePasswordPage from '../profile/ChangePasswordPage'
import ResetPasswordPage from '../employee/ResetPasswordPage'
import WrappedSignUpModal from '../employee/SignUpModal'
import WrappedSignInModal from '../employee/SignInModal'
import WrappedForgotPasswordModal from '../employee/ForgotPasswordModal'
import LeavePage from '../leave/LeavePage'
import NotFound from '../common/NotFound'
import { Layout, notification } from 'antd'
import LoadingIndicator from '../common/LoadingIndicator'
import PrivateRoute from '../common/PrivateRoute'

import { signUp, signIn, getCurrentUser, resetPassword } from '../util/APIUtils'

import { ACCESS_TOKEN, EMPLOYEE_ROLES, EMPLOYEE_TYPES, TITLE_SIGN_IN, TITLE_SIGN_UP, ROUTES } from '../constants'

const { Content } = Layout

notification.config({
    placement: 'topRight',
    top: 70,
    duration: 3,
}); 

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            isShowSignUpModal: false,
            isShowLoginModal: false,
            isShowForgotPasswordModal: false
        }
    }

    componentDidMount() {
        this.loadCurrentUser();
    }

    signOut = (redirectTo="/", notificationType="success", description="You're successfully logged out.") => {
        localStorage.removeItem(ACCESS_TOKEN)
    
        this.setState({
            currentUser: null,
            isAuthenticated: false
        })
    
        this.props.history.push(redirectTo);
        
        notification[notificationType]({
            message: 'CEMS',
            description: description,
        })
    }

    saveSignUpFormRef = (signUpFormRef) => {
        this.signUpFormRef = signUpFormRef
    }

    saveSignInFormRef = (signInFormRef) => {
        this.signInFormRef = signInFormRef
    }

    saveForgotPasswordFormRef = (forgotPasswordFormRef) => {
        this.forgotPasswordFormRef = forgotPasswordFormRef
    }

    handleSignUp = (e) => {
        e.preventDefault();
        const { signUpFormRef, cancelSignUp } = this
        signUpFormRef.props.form.validateFields((err, values) => {
            if (!err) {
              let signUpRequest = { 
                  ...values,
                  role: EMPLOYEE_ROLES.admin,
                  type: EMPLOYEE_TYPES.fulltime
                }
              signUp(signUpRequest).then((response) => {
                notification.success({
                  message: "CEMS",
                  description: "You are successfully registered! Now you can sign in!"
                })
                cancelSignUp()
              }).catch((error) => {
                notification.error({
                  message: 'CEMS',
                  description: 'Errors:' + error.message
                })
              })
            }
          });
    }

    loadCurrentUser = () => {
        getCurrentUser().then(response => {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    currentUser: response,
                    isAuthenticated: true,
                }
            })
        })
    }

    handleSignIn = (e) => {
        e.preventDefault()
        const { loadCurrentUser, signInFormRef, cancelSignIn, props } = this
        signInFormRef.props.form.validateFields((err, signInRequest) => {
        if (!err) {
          signIn(signInRequest).then((response) => {
              localStorage.setItem(ACCESS_TOKEN, response.accessToken)
                notification.success({
                    message: 'CEMS',
                    description: "You're successfully logged in.",
                })
                loadCurrentUser()
                cancelSignIn()
                props.history.push("/")
          }).catch((error) => {
            if(error.status === 401) {
                notification.error({
                    message: 'CEMS',
                    description: 'Your email or password is incorrect. Please try again!'
                })                   
            } else {
                notification.error({
                    message: 'CEMS',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                })
            }
        })
        }
      })
    }

    handleResetPassword = (e) => {
        e.preventDefault()
        const { form } = this.forgotPasswordFormRef.props
        form.validateFields((errors, values) => {
            if(!errors) {
                resetPassword(values).then((response) => {
                    if(response && response.success) {
                        notification.success({
                            message: 'CEMS',
                            description: response.message
                        })
                    }
                }).catch((error) => {
                    notification.error({
                        message: 'CEMS',
                        description: 'Reset password error: ' + error.message || ''
                    })
                })
            }
        })
    }

    cancelSignUp = () => {
        this.setState((prevState) => {
            this.signUpFormRef.props.form.resetFields()
            return {
                ...prevState,
                isShowSignUpModal: false
            }
        })
    }

    cancelSignIn = () => {
        this.setState((prevState) => {
            this.signInFormRef.props.form.resetFields()
            return {
                ...prevState,
                isShowSignInModal: false
            }
        })
    }

    cancelForgotPassword = () => {
        this.setState((prevState) => {
            this.forgotPasswordFormRef.props.form.resetFields()
            return {
                ...prevState,
                isShowForgotPasswordModal: false
            }
        })
    }

    showSignInModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowForgotPasswordModal: false,
                isShowSignUpModal: false,
                isShowSignInModal: true
            }
        })
    }

    showSignUpModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowSignInModal: false,
                isShowForgotPasswordModal: false,
                isShowSignUpModal: true
            }
        })
    }

    showForgotPasswordModal = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                isShowSignInModal: false,
                isShowSignUpModal: false,
                isShowForgotPasswordModal: true
            }
        })
    }

    resetSignIn = () => {
        this.signInFormRef.props.form.resetFields()
    }

    resetSignUp = () => {
        this.signUpFormRef.props.form.resetFields()
    }

    resetForgotPassword = () => {
        this.forgotPasswordFormRef.props.form.resetFields()
    }

    showUnauthorizedMessage = () => {
        notification.error({
            message: 'You do not have permission for this action, Please sign in with authorized account!'
        })
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
        }
        const { isAuthenticated, currentUser, isShowSignUpModal, isShowSignInModal, isShowForgotPasswordModal } = this.state
        const { saveSignUpFormRef, saveSignInFormRef, saveForgotPasswordFormRef,
            cancelSignUp, cancelSignIn, cancelForgotPassword,
            handleSignUp, handleSignIn, handleResetPassword,
            showSignUpModal, showSignInModal, showForgotPasswordModal,
            signOut, 
            resetSignUp, resetSignIn, resetForgotPassword,
            showUnauthorizedMessage } = this

        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={isAuthenticated} currentUser={currentUser} onSignOut={signOut} showSignUpModal={showSignUpModal} showSignInModal={showSignInModal} />
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/" render={(props) => <Home {...props} />} />
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.employees} component={EmployeesPage}/>
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.roster} component={RosterPage}/>
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.availability} component={AvailabilityPage}/>
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.profile} component={ProfilePage}/>
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.changePassword} component={ChangePasswordPage}/>
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.leave} component={LeavePage}/>
                            <Route component={ ResetPasswordPage } path={ ROUTES.resetPassword }/>
                            <Route component={ NotFound } />
                        </Switch>
                        <WrappedSignUpModal title={TITLE_SIGN_UP} wrappedComponentRef={saveSignUpFormRef} visible={isShowSignUpModal} onCancel={cancelSignUp} handleSubmit={handleSignUp} onReset={resetSignUp}/>
                        <WrappedSignInModal title={TITLE_SIGN_IN} wrappedComponentRef={saveSignInFormRef} visible={isShowSignInModal} onCancel={cancelSignIn} handleSubmit={handleSignIn} onReset={resetSignIn} showForgotPasswordModal={showForgotPasswordModal} />
                        <WrappedForgotPasswordModal title={TITLE_SIGN_IN} wrappedComponentRef={saveForgotPasswordFormRef} visible={isShowForgotPasswordModal} onCancel={cancelForgotPassword} handleSubmit={handleResetPassword} onReset={resetForgotPassword} />
                    </div>
                </Content>
            </Layout>
        )
    }
}
export default withRouter(App);