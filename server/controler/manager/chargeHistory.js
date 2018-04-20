var async = require('asyncawait/async');
var await = require('asyncawait/await');
var chargeHistory=require('../../modules/chargeHistory.js');
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
		var customerId=req.query.customerId||0
		var whereObj={
			userId:uid,
			customerId:customerId
		}
		if(uid){
			var res=await(chargeHistory.findAndCountAll({
				'limit':parseInt(pageSize),
				'offset':parseInt(pageSize*(page-1)),
				'order':[['id','DESC']],
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
		
	}
	else if(method=='put'){
		
	}
	else if(method=='delete'){
		
	}
	response.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});//设置respons
	response.end(JSON.stringify(result))
}))