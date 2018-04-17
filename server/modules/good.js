
var Sequelize=require('sequelize')
var dbConfig=require('../connection/dbConfig.js')
var sequelize = new Sequelize(dbConfig.dbName, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  pool: dbConfig.pool,
});
var good = sequelize.define('good', {
  //商品id
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  userId:{
    //所属用户
    type:Sequelize.INTEGER
  },
  name: {
    //商品名
    type: Sequelize.STRING
  },
  specifications:{
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
  isDelete:{
    //商品是否被删除 1：删除 ， 0 ：未删除
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
module.exports=good
