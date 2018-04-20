
var Sequelize=require('sequelize')
var dbConfig=require('../connection/dbConfig.js')
var sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  pool: dbConfig.pool,
});
var chargeHistory = sequelize.define('chargeHistory', {
  //还款记录id
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  money: {
    //还款金额
    type: Sequelize.INTEGER,
    'unique': true   
  },
  //客户id
  customerId: {
    type: Sequelize.INTEGER
  },
  //用户id
  userId:{
    type: Sequelize.INTEGER
  },
  createAt:{
    type:Sequelize.BIGINT
  },
  updateAt:{
    type:Sequelize.BIGINT
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false
});
module.exports=chargeHistory
