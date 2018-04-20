var async = require('asyncawait/async');
var await = require('asyncawait/await');
var good=require('../../modules/good.js');
var order=require('../../modules/order.js');
var label=require('../../modules/label.js');
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
		var uid=req.session.uid
		// var orderBy=req.query.orderBy
		var status=req.query.status
		var customerId=req.query.customerId
		var filterStartDate=req.query.filterStartDate
		var filterEndDate=req.query.filterEndDate
		if(uid){
			var whereObj={
				userId:uid
			}
			if(customerId){
				whereObj.customerId=customerId
			}
			if(status){
				whereObj.status=status
			}
			if(filterStartDate&&filterEndDate){
				//构造开始时间
				var temp=new Date(parseInt(filterStartDate))
		        var year=temp.getFullYear()
		        var month=temp.getMonth()
		        var day=temp.getDate()
		        filterStartDate=new Date(year,month,day,0).valueOf()
		        //构造结束时间
		        temp=new Date(parseInt(filterEndDate))
		        year=temp.getFullYear()
		        month=temp.getMonth()
		        day=temp.getDate()
		        filterEndDate=new Date(year,month,day,23,59,59,999).valueOf()
		        whereObj.createAt={
					$gte:filterStartDate,
					$lte:filterEndDate
				}	
			}
			var orderRes=await(order.findAll({
                'order':[['createAt']],
				where:whereObj,
			}))
			if(orderRes){
				result.status=0;
				result.msg="success"
				result.data=orderRes
			}else{
				result.status=-1;
				result.msg="查询订单失败"
			}
		}
	}
	else if(method=='post'){
		var uid=req.session.uid;
		if(uid){
			var customerId=req.body.customerId
			var goodId=req.body.goodId
			var labelId=req.body.labelId
			var number=req.body.number
			var status=req.body.status
			var price=req.body.price
			var labelRes=await(label.findOne({
				where:{
					id:labelId,
					goodId:goodId
				}
			}))
			var goodRes=await(good.findOne({
				where:{
					id:goodId,
					userId:uid
				}
			}))
			if(labelRes){
				// var price=labelRes.dataValues.price
				var count=parseInt(price*100*number)/100
				var orderRes=await(order.create({
					customerId:customerId,
					userId:uid,
					goodId:goodId,
					labelId:labelId,
					name:goodRes.dataValues.name,
					label:labelRes.dataValues.name,
					unit:goodRes.dataValues.unit,
					price:price,
					number:number,
					count:count,
					isSettle:0,
					status:parseInt(status),
					createAt:new Date().valueOf()
				}))
				result={
					status:0,
					msg:'success'
				}
			}
		}
	}
	else if(method=='put'){
		var uid=req.session.uid;
		var customerId=req.body.customerId
		var goodId=req.body.goodId
		var labelId=req.body.labelId
		var number=req.body.number
		var status=req.body.status
		var price=req.body.price
		var id=req.body.id
		if(uid){
			var labelRes=await(label.findOne({
				where:{
					id:labelId,
					goodId:goodId
				}
			}))
			var goodRes=await(good.findOne({
				where:{
					id:goodId,
					userId:uid
				}
			}))
			if(labelRes){
				// var price=labelRes.dataValues.price
				var count=parseInt(price*100*number)/100
				var orderRes=await(order.update({
					customerId:customerId,
					userId:uid,
					goodId:goodId,
					labelId:labelId,
					name:goodRes.dataValues.name,
					label:labelRes.dataValues.name,
					unit:goodRes.dataValues.unit,
					price:price,
					number:number,
					count:count,
					isSettle:0,
					status:parseInt(status),
					updateAt:new Date().valueOf()
				},{
					where:{
						id:id
					}
				}))
				result={
					status:0,
					msg:'success'
				}
			}
		}
	}
	else if(method=='delete'){
		var uid=req.session.uid;
		var id=req.query.id
		var orderRes=await(order.destroy({
			where:{
				userId:uid,
				id:id
			}
		}))
		result={
			status:0,
			msg:'success'
		}
	}
	response.end(JSON.stringify(result))
	
}))