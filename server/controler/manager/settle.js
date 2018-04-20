var async = require('asyncawait/async');
var await = require('asyncawait/await');
var order=require('../../modules/order.js');
var customer=require('../../modules/customer.js');
var Sequelize=require('sequelize')
var dbConfig=require('../../connection/dbConfig.js')
var sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  pool: dbConfig.pool,
});
module.exports=(async (function(method,req,response){
	response.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});//设置respons
	var result={
		status:1000,
		msg:"未登录"
	}
	if(method=='get'){
		
	}
	else if(method=='post'){
		var uid=req.session.uid;
		if(uid){
			var orderIds=req.body.orderIds
			var targetIds=[]
			var customerId=0
			var money=0;
			for(let orderId of orderIds){
				var orderRes=await(order.findOne({
					where:{
						id:orderId,
						userId:uid
					}
				}))
				if(orderRes&&orderRes.dataValues.isSettle==0){
					money=parseInt(orderRes.dataValues.count*100+money*100)/100
					targetIds.push(orderRes.dataValues.id)
					customerId=orderRes.dataValues.customerId
				}
			}
			var orderUpdateRes=await(order.update({
				isSettle:1
			},{
				where:{
					id:targetIds
				}
			}))
			var customerRes=await(customer.findOne({
				where:{
					id:customerId
				}
			}))
			if(customerRes){
				var spareMoney=parseInt(customerRes.dataValues.spareMoney*100+money*100)/100
				var settleRes=await(customer.update({
					spareMoney:spareMoney,
					updateAt:new Date().valueOf()
				},{
					where:{
						id:customerId
					}
				}))
				result={
					status:0,
					msg:'success',
					data:{
						spareMoney:spareMoney
					}
				}
			}else{
				result={
					status:-1,
					msg:'结算异常'
				}
			}
		}
	}
	else if(method=='put'){
		
	}
	else if(method=='delete'){
		
	}
	response.end(JSON.stringify(result))
	
}))