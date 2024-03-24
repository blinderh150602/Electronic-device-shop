import axios from '../axios'
//hàm gọi api trong Product
export const apiGetProducts = (params) => axios({
    url:'/product/',
    method:'get',
    params
})