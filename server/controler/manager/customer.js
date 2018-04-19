var async = require('asyncawait/async');
var await = require('asyncawait/await');
var customer=require('../../modules/customer.js');
var Sequelize=require('sequelize')
module.exports=(async (function(method,req,response){
	var result={
		status:1000,
		msg:"未登录"
	}
	if(method=='get'){
		var uid=req.session.uid;
		var pageSize=req.query.pageSize||10
		var page=req.query.page||1
		if(uid){
			var res=await(customer.findAndCountAll({
				'limit':parseInt(pageSize),
				'offset':parseInt(pageSize*(page-1)),
				'order':[['id']],
				where:{
					isDelete:0,
					userId:uid
				}
			}))
			result.status=0;
			result.msg="success"
			result.total=res.count;
			result.data=res.rows
		}
	}
	else if(method=='post'){
		var uid=req.session.uid;
		var name=req.body.name
		var balance=req.body.balance
		if(uid){
			if(!name||name==""){
				result={
					status:-1,
					msg:"客户名称必须输入"
				}
			}
			else{
				var res=await(customer.create({
					name:name,
					userId:uid,
					balance:parseFloat(balance)
				}))
				result.status=0;
				result.msg="success"
				result.data={
				}
				
			}
			
		}
	}
	else if(method=='put'){
		var uid=req.session.uid;
		var id=req.body.id;
		var name=req.body.name
		var balance=req.body.balance
		if(uid){
			if(!name||name==""){
				result={
					status:-1,
					msg:"客户名称必须输入"
				}
			}
			else if(!parseFloat(balance)){
				result={
					status:-1,
					msg:"充值金额不合法"
				}
			}
			else{
				var res=await(customer.findOne({
					where:{
						id:id,
						userId:uid
					}
				}))
				if(res){
					balance=parseInt(res.dataValues.balance*100+balance*100)/100
					var updateRes=await(customer.update({
						name:name,
						balance:balance
					},{
						where:{
							id:id,
							userId:uid
						}
					}))
					result.status=0;
					result.msg="success"
					result.data={
					}
				}
				
			}
			
		}
	}
	else if(method=='delete'){
		var uid=req.session.uid;
		var id=req.query.id;
		if(uid){
			var res=await(customer.update({
				isDelete:1
			},{
				where:{
					id:id,
					userId:uid
				}
			}))
			if(res!=0){
				result.status=0;
				result.msg="success"
				result.data={
				}
			}else{
				result.status=-1;
				result.msg="删除失败"
			}
			
		}
	}
	response.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});//设置respons
	response.end(JSON.stringify(result))
}))