//export const API_BASE_URL = 'https://cafe-employee-management.herokuapp.com/api'
export const API_BASE_URL = 'http://localhost:8080/api'
export const ACCESS_TOKEN = 'accessToken'

export const EMPLOYEE_TYPES = {
  fulltime: "FULL_TIME",
  parttime: "PART_TIME",
  student: "PART_TIME_STUDENT"
}

export const EMPLOYEE_ROLES = {
  admin: "ROLE_ADMIN",
  manager: "ROLE_MANAGER",
  employee: "ROLE_EMPLOYEE"
}

export const FORM_ITEMS_LAYOUT = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      }
}

export const  TAIL_FORM_ITEMS_LAYOUT = {
    wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
      sm: {
          span: 16,
          offset: 8,
        },
      }
}

export const TITLE_SIGN_IN = "sign in"
export const TITLE_SIGN_UP = "sign up"

export const ROUTES = {
  employees: "/employees",
  roster: "/roster",
  availability: "/availability",
  leave: "/leave"
}

export const REG_TIME_FORMAT = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/