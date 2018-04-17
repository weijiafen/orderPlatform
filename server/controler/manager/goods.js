var async = require('asyncawait/async');
var await = require('asyncawait/await');
var good=require('../../modules/good.js');
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
		var whereObj={
			isDelete:0,
			userId:uid
		}
		if(uid){
			var res=await(good.findAndCountAll({
				'limit':parseInt(pageSize),
				'offset':parseInt(pageSize*(page-1)),
				'order':[['id']],
				where:whereObj,
			}))
			if(res.rows.length>=0){
				result.status=0;
				result.msg="查询成功";
				result.total=res.count;
				result.data=res.rows
			}
		}
	}
	else if(method=='post'){
		var uid=req.session.uid;
		var name=req.body.name
		var specifications=req.body.specifications
		var unit=req.body.unit
		var price=req.body.price
		if(uid){
			if(!name||name==""){
				result={
					status:-1,
					msg:"商品名称必须输入"
				}
			}
			else if(!parseFloat(price)){
				result={
					status:-1,
					msg:"价格参数不合法"
				}
			}
			else{
				var res=await(good.create({
					name:name,
					specifications:specifications,
					unit:unit,
					price:parseFloat(price),
					userId:uid
				}))
				result.status=0;
				result.msg="success"
				result.data={
					id:res.id,
					name:res.name
				}
			}
			
		}
	}
	else if(method=='put'){
		var uid=req.session.uid;
		var id=req.body.id;
		var name=req.body.name
		var specifications=req.body.specifications
		var unit=req.body.unit
		var price=req.body.price
		if(uid){
			if(!name||name==""){
				result={
					status:-1,
					msg:"商品名称必须输入"
				}
			}
			else if(!parseFloat(price)){
				result={
					status:-1,
					msg:"价格参数不合法"
				}
			}
			else{
				var res=await(good.update({
					name:name,
					specifications:specifications,
					unit:unit,
					price:parseFloat(price),
				},{
					where:{
						id:id,
						userId:uid
					}
				}))
				result.status=0;
				result.msg="success"
				result.data={
					id:res.id,
					name:res.name
				}
				
			}
			
		}
	}
	else if(method=='delete'){
		var uid=req.session.uid;
		var id=req.query.id;
		if(uid){
			var res=await(good.update({
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