let demo = {
  status: 200,
  message: "success",
  data: {
    projectData: {
      projectTotal: 15,
      reviewed: 13,
      toBeReviewed: 1,
      failed: 1
    },
    amountData: {
      amountTotal: 2600.73,
      toBePaid: 1800.60,
      toBePaid: 200.13,
      surplus: 600.00
    }
  },
}

let demo2 = {
  status: 200,
  message: "success",
  data: {
    expiresIn: 86399,
    refreshToken:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLC",
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdA",
    tokenHead: "Bearer ",
  },
};

let demo3 = {
  status: 200,
  message: "success",
  data: {
    username: "超级管理员",
    jwtUser: {
      client_id: null,
      id: "1",
      isDeleted: false,
      name: "超级管理员",
      password: "e10adc3949ba59abbe56e057f20f883e",
      status: 1,
      tenant_code: null,
      user_name: "超级管理员",
      user_unit: '洪江市国土资源局',
      roles: ['"PAYPURCONTRACTUSEPLAN_SELECT"'],
      roleInfo: [
        {
          maxLevel: 1,
          roles: [{ name: "超级管理员", code: "ROLE_ADMIN" }],
        },
      ],
    },
  },
};

let demo4 = {
  status: 200,
  message: "success",
  data: {
    code: 403,
    message: "Access Denied",
    successed: false,
  },
};

let demo5 = {
  status: 200,
  message: "success",
  data: {
    total: 100,
    'rows|10': [{
      id: '@guid',
      'projectName|1-5': 'xx',
      'project|1-5': 'xxxx',
      'total|500-100000.2': 1,
      'unpaid|500-100000.2': 1,
      'paid|1-100': 1,
      'mofApp': /(^(\d|[1-9]\d)(\.\d{1,5})?$)|(^100$)/,
      'amount': /(^(\d|[1-9]\d)(\.\d{1,5})?$)|(^100$)/
    }]
  }
}

export default {
  // "get|/project/data": demo,
  // "get|/auth/info": demo3,
  // "post|/project/list": demo5,
};
