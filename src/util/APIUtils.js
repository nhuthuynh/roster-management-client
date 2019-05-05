import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*"
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function loadEmployees(shopOwnerId) {
    return request({
        url: `${API_BASE_URL}/employee/load?shopOwnerId=${shopOwnerId}`,
        method: 'GET'
    });
}


export function loadRoster(fromDate, toDate, shopOwnerId) {
    return request({
        url: `${API_BASE_URL}/roster/load?from=${fromDate}&to=${toDate}&shopOwnerId=${shopOwnerId}`,
        method: 'GET'
    });
}

export function createRoster(rosterDetails) {
    return request({
        url: API_BASE_URL + "/roster/create",
        method: 'POST',
        body: JSON.stringify(rosterDetails)
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/employee/me",
        method: 'GET'
    });
}

export function signIn(signInRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(signInRequest)
    });
}

export function signUp(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function resignEmployees(resignRequest) {
    return request({
        url: API_BASE_URL + "/employee/resign",
        method: 'POST',
        body: JSON.stringify(resignRequest)
    })
}

export function loadAvailabilities(employeeId) {
    return request({
        url: `${API_BASE_URL}/availability/load?employeeId=${employeeId}`,
        method: 'GET'
    })
}

export function saveAvailabilities(availabilityRequest) {
    return request({
        url: `${API_BASE_URL}/availability/save`,
        method: 'POST',
        body: JSON.stringify(availabilityRequest)
    })
}

export function getEmployeeProfile(employeeId) {
    return request({
        url: `${API_BASE_URL}/profile/load?employeeId=${employeeId}`,
        method: 'GET'
    });
}

export function saveEmployeeProfile(profileRequest) {
    return request({
        url: `${API_BASE_URL}/profile/save`,
        method: 'POST',
        body: JSON.stringify(profileRequest)
    })
}

export function changePassword(changePasswordRequest) {
    return request({
        url: `${API_BASE_URL}/employee/changePassword`,
        method: 'POST',
        body: JSON.stringify(changePasswordRequest)
    })
}

export function loadProfile(employeeId) {
    return request({
        url: `${API_BASE_URL}/employee/loadProfile?employeeId=${employeeId}`,
        method: 'GET',
    })
}

export function updateProfile(profileRequest) {
    return request({
        url: `${API_BASE_URL}/employee/updateProfile`,
        method: 'POST',
        body: JSON.stringify(profileRequest)
    })
}

export function resetPassword(email) {
    return request({
        url: `${API_BASE_URL}/employee/resetPassword`,
        method: 'POST',
        body: JSON.stringify(email)
    })
}

export function savePasswordWithResetToken(passwordRequest) {
    return request({
        url: `${API_BASE_URL}/employee/savePasswordWithResetToken`,
        method: 'POST',
        body: JSON.stringify(passwordRequest)
    })
}

export function changePasswordWithToken(passwordRequest) {
    return request({
        url: `${API_BASE_URL}/employee/changePasswordWithToken`,
        method: 'POST',
        body: JSON.stringify(passwordRequest)
    })
}