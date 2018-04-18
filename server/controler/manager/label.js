var async = require('asyncawait/async');
var await = require('asyncawait/await');
var good=require('../../modules/good.js');
var label=require('../../modules/label.js');
var Sequelize=require('sequelize')
module.exports=(async (function(method,req,response){
	var result={
		status:1000,
		msg:"未登录"
	}
	if(method=='post'){
		var uid=req.session.uid;
		// var id=req.body.id;
		var name=req.body.name
		var goodId=req.body.goodId
		var price=req.body.price
		if(uid){
			if(!goodId){
				result={
					status:-1,
					msg:"商品id为空"
				}
			}
			else if(!name||name==""){
				result={
					status:-1,
					msg:"标签名称必须输入"
				}
			}
			else if(!parseFloat(price)){
				result={
					status:-1,
					msg:"价格参数不合法"
				}
			}
			else{
				var res=await(label.create({
					name:name,
					goodId:goodId,
					price:parseFloat(price),
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
		// var goodId=req.body.goodId
		var price=req.body.price
		if(uid){
			if(!id){
				result={
					status:-1,
					msg:"规格id为空"
				}
			}
			else if(!name||name==""){
				result={
					status:-1,
					msg:"标签名称必须输入"
				}
			}
			else if(!parseFloat(price)){
				result={
					status:-1,
					msg:"价格参数不合法"
				}
			}
			else{
				var res=await(label.update({
					name:name,
					price:parseFloat(price),
				},{
					where:{
						id:id
					}
				}))
				result.status=0;
				result.msg="success"
				result.data={
				}
				
			}
			
		}
	}
	else if(method=='delete'){
		var uid=req.session.uid;
		var id=req.query.id;
		if(uid){
			var res=await(label.destroy({
				where:{
					id:id
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