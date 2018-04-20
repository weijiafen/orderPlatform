import api from '../lib/axios/api';
const Service = {
    getCustomer:(page = 1 , pageSize = 10)=>{
        return api.get('/manager/customer',{
            params:{
                page:page,
                pageSize:pageSize
            }
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
    deleteCustomer:(id)=>{
        return api.delete('/manager/customer',{
            params:{id:id}
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
    addCustomer:(data)=>{
        return api
            .post('/manager/customer', {
                data: data,
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
    setCustomer:(data)=>{
        return api
            .put('/manager/customer', {
                data: data,
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
    getChargeHistory:(customerId,page = 1 , pageSize = 10)=>{
        return api.get('/manager/chargeHistory',{
            params:{
                page:page,
                pageSize:pageSize,
                customerId:customerId
            }
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
}
export default Service