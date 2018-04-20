import api from '../lib/axios/api';
const Service = {
    getOrder:(data)=>{
        return api.get('/manager/order',{
            params:data
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
    postOrder:(data)=>{
        return api
            .post('/manager/order', {
                data: data,
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
    
    putOrder:(data)=>{
        return api
            .put('/manager/order', {
                data: data,
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
    deleteOrder:(id)=>{
        return api.delete('/manager/order',{
            params:{id:id}
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
    postSettle:(data)=>{
        return api
            .post('/manager/settle', {
                data: data,
            })
            .then((res) => {
                return res;
            }, (error) => {
                console.log('error ', error);
                throw error;
            });
    },
    getGoodReport:(data)=>{
        return api.get('/manager/goodReport',{
            params:data
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
    getSaleReport:(data)=>{
        return api.get('/manager/saleReport',{
            params:data
        }).then((res)=>{
            return res
        },(error)=>{
            throw error
        })
    },
}
export default Service