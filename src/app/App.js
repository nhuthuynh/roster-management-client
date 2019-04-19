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
import WrappedSignUpModal from '../employee/SignUpModal'
import WrappedSignInModal from '../employee/SignInModal'
import NotFound from '../common/NotFound'
import { Layout, notification } from 'antd'
import LoadingIndicator from '../common/LoadingIndicator'
import PrivateRoute from '../common/PrivateRoute'

import { signUp, signIn, getCurrentUser } from '../util/APIUtils'

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
            isShowLoginModal: false
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
        this.signUpFormRef = signUpFormRef;
    }

    saveSignInFormRef = (signInFormRef) => {
        this.signInFormRef = signInFormRef;
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

    cancelSignUp = () => {
        this.setState((prevState, prevProps) => {
            this.signUpFormRef.props.form.resetFields()
            return {
                ...prevState,
                isShowSignUpModal: false
            }
        })
    }

    cancelSignIn = () => {
        this.setState((prevState, prevProps) => {
            this.signInFormRef.props.form.resetFields()
            return {
                ...prevState,
                isShowSignInModal: false
            }
        })
    }

    showSignInModal = () => {
        this.setState((prevState, prevProps) => {
            return {
                ...prevState,
                isShowSignInModal: true
            }
        })
    }

    showSignUpModal = () => {
        this.setState((prevState, prevProps) => {
            return {
                ...prevState,
                isShowSignUpModal: true
            }
        })
    }

    resetSignIn = () => {
        this.signInFormRef.props.form.resetFields()
    }

    resetSignUp = () => {
        this.signUpFormRef.props.form.resetFields()
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
        const { isAuthenticated, currentUser, isShowSignUpModal, isShowSignInModal } = this.state
        const { saveSignUpFormRef, saveSignInFormRef, cancelSignUp, cancelSignIn, handleSignUp, handleSignIn, showSignUpModal, showSignInModal, signOut, resetSignUp, resetSignIn, showUnauthorizedMessage } = this

        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={isAuthenticated} currentUser={currentUser} onSignOut={signOut} showSignUpModal={showSignUpModal} showSignInModal={showSignInModal} />
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/" render={(props) => <Home {...props} />} />
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.employees} component={EmployeesPage}/>
                            <PrivateRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onUnauthorized={showUnauthorizedMessage} path={ROUTES.roster} component={RosterPage}/>
                            <Route component={ NotFound } />
                        </Switch>
                        <WrappedSignUpModal title={TITLE_SIGN_UP} wrappedComponentRef={saveSignUpFormRef} visible={isShowSignUpModal} onCancel={cancelSignUp} handleSubmit={handleSignUp} onReset={resetSignUp} />
                        <WrappedSignInModal title={TITLE_SIGN_IN} wrappedComponentRef={saveSignInFormRef} visible={isShowSignInModal} onCancel={cancelSignIn} handleSubmit={handleSignIn} onReset={resetSignIn} />
                    </div>
                </Content>
            </Layout>
        )
    }
}
export default withRouter(App);