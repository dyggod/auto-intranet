const METHOD = {
  GET: 'get',
  POST: 'post',
};

// 封装axios请求
async function request(url, method, params, config) {
  switch (method.toLowerCase()) {
    case METHOD.GET:
      return axios.get(url, { params, ...config });
    case METHOD.POST:
      return axios.post(url, params, config);
    default:
      return axios.get(url, { params, ...config });
  }
}
