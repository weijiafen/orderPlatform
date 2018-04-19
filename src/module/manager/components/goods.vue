<template>
	<div class="goods">
        <h2 class="title">商品列表</h2>
        <el-button type="primary" class="add_good" @click="addGood">新增商品</el-button>
		<el-table
            :data="goodList"
            border
            v-loading="loadingTable"
            class="goodList"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="单位"
              width="80">
            </el-table-column>
            <el-table-column
              prop="label"
              label="商品规格">
                <template scope="scope">
                    <el-table
                        :data="scope.row.labels"
                        border
                        style="width: 100%">
                        <el-table-column
                          prop="name"
                          label="规格"
                          width="">
                        </el-table-column>
                        <el-table-column
                          prop="price"
                          label="价格（元）"
                          width="">
                        </el-table-column>
                        <el-table-column
                          prop=""
                          label="操作"
                          width="160px">
                            <template scope="scope2">
                                <el-button type="warning" size="mini" @click="editLabel(scope.row,scope2.row)">编辑规格</el-button>
                                <el-button type="danger" size="mini" @click="deleteLabel(scope2.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column
              prop=""
              label="操作">
              <template scope="scope">
                <el-button type="primary" size="small" @click="editGood(scope.row)">编辑商品</el-button>
                <el-button type="success" size="small" @click="addLabel(scope.row)">新增规格</el-button>
                <el-button type="danger" size="small" @click="deleteGood(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          class="pagination"
          @current-change="changePage"
          :total="total">
        </el-pagination>
        <el-dialog title="商品信息" :visible.sync="dialogFormVisible">
            <div v-loading="loadingForm">
              <el-form :model="form" :rules="rules" ref="goodForm"> 
                <el-form-item label="商品名称" label-width="120px" prop="name">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位" label-width="120px">
                    <el-input v-model="form.unit" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitGood">确 定</el-button>
              </div>
            </div>
        </el-dialog>
        <el-dialog :title="labelTitle" :visible.sync="dialogLabelVisible">
            <div v-loading="loadingLabel">
              <el-form :model="lableObj" :rules="rules2" ref="labelForm"> 
                <el-form-item label="规格" label-width="120px" prop="name">
                  <el-input v-model="lableObj.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格" label-width="120px" prop="price">
                    <el-input v-model.number="lableObj.price"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogLabelVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitLabel">确 定</el-button>
              </div>
            </div>
        </el-dialog>
	</div>
</template>
<script>
import goodsService from '../service/goodsService'
    export default {
        mixins: [],
        name: 'active',
        data(){
            return {
                goodList:[],
                total:0,
                pageNum:1,
                dialogFormVisible:false,
                dialogLabelVisible:false,
                loadingForm:false,
                loadingTable:false,
                loadingLabel:false,
                labelTitle:'',
                form:{
                    id:null,
                    name:'',
                    unit:''
                },
                lableObj:{
                    id:null,
                    name:'',
                    price:'',
                    goodId:''
                },
                rules:{
                    name:[{required: true, message: '请输入商品名称', trigger: 'blur'}]
                },
                rules2:{
                    name:[{required: true, message: '请输入规格名称', trigger: 'blur'}],
                    price:[{required: true, message: '请输入价格'},
                        {type:'number',message:'价格必须是数值',trigger:'blur'}]
                }
            }
        },
        components: {},
        mounted(){
            this.drawList();
        	
        },
        methods:{
            drawList(){
                this.loadingTable=true
                goodsService.getGoods(this.pageNum).then(res=>{
                    if(res.status==0){
                        for(let good of res.data){
                            good.labels.sort(function(a,b){
                                return a.id-b.id
                            })
                        }
                        this.goodList=res.data
                        this.total=res.total;
                        this.loadingTable=false
                    }
                    
                })
            },
            addGood(){
                this.form.id=null
                this.form.name=''
                this.form.unit=''
                this.dialogFormVisible=true
            },
            editGood(good){
                this.form.id=good.id
                this.form.name=good.name
                this.form.unit=good.unit
                this.dialogFormVisible=true
            },
            deleteGood(id){
                this.loadingTable=true
                goodsService.deleteGoods(id).then(res=>{
                    if(res.status==0){
                        this.$message.success('删除成功');
                        this.drawList();
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loadingTable=false
                })
            },
            commitGood(){
                this.$refs.goodForm.validate((valid) => {
                  if (valid) {
                    this.loadingForm=true
                    if(this.form.id){
                        goodsService.setGoods(this.form).then(res=>{
                            if(res.status==0){
                                this.$message.success('保存成功');
                                this.drawList();
                            }else{
                                this.$message.error(res.msg);
                            }
                            this.dialogFormVisible=false;
                            this.loadingForm=false;
                        })
                    }else{
                        goodsService.addGoods(this.form).then(res=>{
                            if(res.status==0){
                                this.$message.success('保存成功');
                                this.drawList();
                            }else{
                                this.$message.error(res.msg);
                            }
                            this.dialogFormVisible=false;
                            this.loadingForm=false;
                        })
                    }
                  } else {
                    //validate error
                    return false;
                  }
                });
            },
            deleteLabel(id){
                this.loadingTable=true
                goodsService.deleteLabel(id).then(res=>{
                    if(res.status==0){
                        this.$message.success('删除成功');
                        this.drawList();
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loadingTable=false
                })
            },
            addLabel(good){
                this.labelTitle=good.name
                this.lableObj.id=null
                this.lableObj.name=''
                this.lableObj.price=''
                this.lableObj.goodId=good.id
                this.dialogLabelVisible=true
            },
            editLabel(good,label){
                this.labelTitle=good.name
                this.lableObj.id=label.id
                this.lableObj.name=label.name
                this.lableObj.price=label.price
                this.lableObj.goodId=good.id
                this.dialogLabelVisible=true
            },
            commitLabel(){
                this.$refs.labelForm.validate((valid) => {
                  if (valid) {
                    this.loadingLabel=true
                    if(this.lableObj.id){
                        goodsService.setLabel(this.lableObj).then(res=>{
                            if(res.status==0){
                                this.$message.success('保存成功');
                                this.drawList();
                            }else{
                                this.$message.error(res.msg);
                            }
                            this.dialogLabelVisible=false;
                            this.loadingLabel=false;
                        })
                    }else{
                        goodsService.addLabel(this.lableObj).then(res=>{
                            if(res.status==0){
                                this.$message.success('保存成功');
                                this.drawList();
                            }else{
                                this.$message.error(res.msg);
                            }
                            this.dialogLabelVisible=false;
                            this.loadingLabel=false;
                        })
                    }
                  } else {
                    //validate error
                    return false;
                  }
                });
            },
            changePage(page){
                this.pageNum=page;
                this.drawList()
            }
        }
    }

</script>
<style lang="scss">
    .goods{
        .title{
            margin-top:4px;
            margin-bottom:10px;
        }
        .add_good{
            margin-bottom:4px;
        }
        .goodList{
            & > .el-table__body-wrapper .el-table__row >td:nth-child(4) > .cell{
                padding-left:0;
                padding-right:0;
            }
        }
        .dialog-footer{
            text-align:center;
        }
        
        .pagination{
            margin:10px;
            text-align:center;
        }
    }
</style>