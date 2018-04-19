var async = require('asyncawait/async');
var await = require('asyncawait/await');
var user=require('../../modules/user.js');
var Sequelize=require('sequelize')
module.exports=(async (function(method,req,response){
	var result={
		status:1000,
		msg:"未登录"
	}
	if(method=='get'){
		var uid=req.session.uid;
		if(uid){
			var userRes=await(user.findOne({
				where:{
					id:uid
				}
			}))
			if(userRes){
				result.status=0;
				result.msg="查询成功";
				result.data={
					userName:userRes.dataValues.userName
				}
			}
		}
	}
	
	response.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});//设置respons
	response.end(JSON.stringify(result))
}))