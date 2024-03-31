import axios from '../axios';
//hàm gọi api trong Category
export const apiRegister = (data) => axios({
  url: '/user/register',
  method: 'post',
  data: data,
  //Khi sử dụng hàm withCredentials với biến là true thì khi sài axios để có thể save data trong cookie tới server
  withCredentials: true
})
export const apiLogin = (data) => axios({
  url: '/user/login',
  method: 'post',
  data: data
});
export const apiForgotPassword = (data) => axios({
  url: '/user/forgotpassword',
  method: 'post',
  data: data
});
export const apiResetPassword = (data) => axios({
  url: '/user/resetpassword',
  method: 'put',
  data: data
});
