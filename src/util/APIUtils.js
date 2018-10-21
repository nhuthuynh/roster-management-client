import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
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

export function loadEmployee() {
    return request({
        url: `${API_BASE_URL}/employee/load`,
        method: 'GET'
    });
}


export function loadRoster(fromDate, toDate) {
    return request({
        url: `${API_BASE_URL}/roster/load?from=${fromDate}&to=${toDate}`,
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
