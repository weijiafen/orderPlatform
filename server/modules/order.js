
var Sequelize=require('sequelize')
var dbConfig=require('../connection/dbConfig.js')
var sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  pool: dbConfig.pool,
});
var Order = sequelize.define('order', {
  //订单id
  id:{
    type:Sequelize.BIGINT,
    primaryKey:true,
    autoIncrement: true
  },
  //顾客id
  customerId:{
    type:Sequelize.STRING,
  },
  //订单所属商店ID
  userId:{
    type:Sequelize.INTEGER,
  },
  //订单所属商品ID
  goodId:{
    type:Sequelize.INTEGER,
  },
  //订单所属规格ID
  labelId:{
    type:Sequelize.INTEGER,
  },
  name: {
    //商品名
    type: Sequelize.STRING
  },
  label:{
    //商品规格
    type: Sequelize.STRING
  },
  unit:{
    //商品单位
    type: Sequelize.STRING
  },
  price:{
    //商品价格
    type:Sequelize.INTEGER,
  },
  number:{
    //商品数量
    type:Sequelize.INTEGER,
  },
  count: {
    //总额
    type: Sequelize.STRING 
  },
  //是否支付,0未支付，1已支付
  isSettle:{
    type:Sequelize.INTEGER,
  },
  //订单状态，1备货中，2已出货，3取消
  status:{
    type:Sequelize.INTEGER,
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
module.exports=Order
