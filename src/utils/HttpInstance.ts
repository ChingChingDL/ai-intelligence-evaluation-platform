import axios from 'axios';

export const isDev = process.env.NODE_ENV === 'development';
const httpInstance = axios.create({
	baseURL: isDev? 'http://localhost:8080/' : 'http://120.25.190.38:8080',
	timeout: 100000000,
	withCredentials: true,
});

httpInstance.interceptors.response.use(response => {
	const {data} = response;
	// 表示未登录
	if (data.code === 40100) {
		// 跳转到登录页面

		if (
			!response.request.responseURL.includes('user/get/login') &&
			window.location.pathname.includes('user/login')
		) {
			// 当前不在登录页或者该次响应对应的请求的目标地址不是登录页
			window.location.href = `/user/login?redirect=${window.location.href}`;
		}
	}

	return Promise.resolve(response);
});
export default httpInstance;