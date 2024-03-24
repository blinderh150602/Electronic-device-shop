import axios from '../axios';
//hàm gọi api trong Category
export const apiGetCategories = () => axios({
  url: '/productcategory/',
  method: 'get'
});
