import api from '../lib/axios/api';
const Service = {
	login: (detail) => {
        return api
            .post('/user/login', {
                data: detail,
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
    logout:()=>{
        return api
            .post('/user/logout', {
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
}
export default Service