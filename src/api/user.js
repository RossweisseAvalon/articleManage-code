import request from '@/utils/request'
// 注册
export const userRegisterService = ({ username, password, repassword }) => request.post('/api/reg', { username, password, repassword })
// 登录
export const userLoginService = ({ username, password }) => request.post('/api/login', { username, password })
// 获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')
// 更新用户信息
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)
// 更新头像
export const userUpdateAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })
// 更新密码
export const userUpdatePasswordService = (data) => request.patch('/my/updatepwd', data)