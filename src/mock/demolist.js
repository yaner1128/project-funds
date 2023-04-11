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

let demo = {
  status: 200,
  message: "success",
  data: {
    total: 100,
    'records|10': [{
      id: '@guid',
      'agencyCode|1-5': 'x',
      'agencyName|1-5': 'xxx',
      'count': /\d{1,4}/,
      'application': /\d{1,4}/,
      'pendingApproval': /\d{1,4}/,
      'reviewed': /\d{1,4}/,
      'rejected': /\d{1,4}/,
      'amount': /(^[1-9](\d{2,4}|[1-9]\d)(\.\d{1,5})?$)|(^100$)/,
      'status|1': [0,1,-1]
    }]
  }
}

export default {
  "get|/project/data": demo
};
