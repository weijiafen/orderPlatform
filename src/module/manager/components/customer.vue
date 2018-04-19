<template>
	<div class="customer">
		<h2 class="title">客户列表</h2>
        <el-button type="primary" class="add_customer" @click="addCustomer">新增商品</el-button>
		<el-table
            :data="customerList"
            border
            v-loading="loadingTable"
            class="customerList"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="name"
              label="客户姓名"
              width="">
            </el-table-column>
            <el-table-column
              prop="balance"
              label="余额"
              width="">
            </el-table-column>
            <el-table-column
              prop=""
              label="操作"
              width="">
            	<template scope="scope">
            		<el-button type="info" size="small" @click="editCustomer(scope.row)">充值</el-button>
            		<el-button type="danger" size="small" @click="deleteCustomer(scope.row.id)">删除</el-button>
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
        <el-dialog title="客户信息" :visible.sync="dialogFormVisible">
            <div v-loading="loadingForm">
              <el-form :model="form" :rules="rules" ref="customerForm"> 
                <el-form-item label="客户姓名" label-width="120px" prop="name">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="余额" label-width="120px" prop="balance">
                    <el-input v-model.number="form.balance"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="commitForm">确 定</el-button>
              </div>
            </div>
        </el-dialog>
	</div>
	
</template>
<script>
import customerService from '../service/customerService'
    export default {
        mixins: [],
        name: 'active',
        components: {},
        data(){
        	return {
        		customerList:[],
        		total:0,
        		pageNum:1,
        		loadingTable:false,
        		dialogFormVisible:false,
        		loadingForm:false,
        		form:{
        			id:null,
        			name:'',
        			balance:0
        		},
        		rules:{
                    name:[{required: true, message: '请输入客户姓名', trigger: 'blur'}],
                    balance:[{required: true, message: '请输入充值金额'},
                        {type:'number',message:'充值金额必须是数值',trigger:'blur'}]
                }
        	}
        },
        mounted(){
            this.drawList();
        	
        },
        methods:{
            drawList(){
            	this.loadingTable=true
            	customerService.getCustomer(this.pageNum).then(res=>{
            		if(res.status==0){
            			this.customerList=res.data
            			this.total=res.total;
            			this.loadingTable=false
            		}
            		
            	})
            },
            addCustomer(){
            	this.form.id=null
            	this.form.name=''
            	this.form.balance=0
            	this.dialogFormVisible=true
            },
            commitForm(){
            	this.$refs.customerForm.validate((valid) => {
                  if (valid) {
                    this.loadingForm=true
                    if(this.form.id){
                        customerService.setCustomer(this.form).then(res=>{
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
                        customerService.addCustomer(this.form).then(res=>{
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
            changePage(page){
                this.pageNum=page;
                this.drawList()
            },
            editCustomer(customer){
            	this.form.id=customer.id
            	this.form.name=customer.name
            	this.form.balance=0
            	this.dialogFormVisible=true;
            },
            deleteCustomer(id){
            	this.loadingTable=true;
            	customerService.deleteCustomer(id).then(res=>{
                    if(res.status==0){
                        this.$message.success('删除成功');
                        this.drawList();
                    }else{
                        this.$message.error(res.msg);
                    }
                    this.loadingTable=false
                })
            }
        }
    }

</script>
<style lang="scss">
    .customer{
        .title{
            margin-top:4px;
            margin-bottom:10px;
        }
        .add_customer{
            margin-bottom:4px;
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