<template>
	<div class="order">
		<h2 class="title noPrint">订单列表</h2>
		<el-form :inline="true" class="noPrint">
			<el-form-item label="客户姓名">
			    <el-select v-model="fileterCustomer" placeholder="请选择客户" @change="drawList">
			      <el-option v-for="customer in customerList" :label="customer.name" :value="customer.id"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="订单状态">
			    <el-select v-model="fileterStatus" placeholder="请选择订单状态" @change="drawList">
			      <el-option label="全部" value=""></el-option>
			      <el-option label="备货中" value="1"></el-option>
			      <el-option label="已出货" value="2"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="订单时间">
				<el-date-picker
			      v-model="daterange"
			      @change="drawList"
			      type="daterange"
			      placeholder="选择日期区间"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期">
			    </el-date-picker>
			</el-form-item>
			<el-button type="primary" class="add_customer" @click="addOrder">新增订单</el-button>
            <el-button type="success" class="add_customer" @click="printOrder">打印订单</el-button>
		</el-form>
        <!-- <el-table
            :data="orderList"
            border
            v-loading="loadingTable"
            class="orderList">
            <el-table-column
              prop="createAt"
              label="日期"
              width="100">
              <template scope="scope">
                  {{parseDate(scope.row.createAt)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="品名"
              width="80">
            </el-table-column>
            <el-table-column
              prop="label"
              label="规格"
              width="">
            </el-table-column>
            <el-table-column
              prop="unit"
              label="单位"
              width="50">
            </el-table-column>
            <el-table-column
              prop="number"
              label="数量"
              width="70">
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价"
              width="60">
            </el-table-column>
            <el-table-column
              prop="count"
              label="金额"
              width="90">
            </el-table-column>
            <el-table-column
              prop="isPay"
              label="是否支付"
              width="80">
              <template scope="scope">
                  <p v-if="scope.row.isPay==1">已付款</p>
                  <p v-else>未付款</p>
              </template>
            </el-table-column>
        </el-table> -->
        <div class="printPaper">
            <h2>{{userName}}（客户对账单）</h2>
            <el-button class="payBtn noPrint" type="success" size="small" @click="settleSubmit">确认结算</el-button>
            <p class="customerName">客户：{{findCustomer(fileterCustomer).name}}</p>
            <table class="orderList" v-loading="loadingTable">
                <thead>
                    <th class="noPrint">
                        <el-checkbox v-model="ischeckAll" @change="toggleCheckAll"></el-checkbox>
                    </th>
                    <th>日期</th>
                    <th>品名</th>
                    <th>规格</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>金额</th>
                    <th>是否结算</th>
                    <th class="noPrint">是否出货</th>
                    <th class="noPrint">操作</th>
                </thead>
                <tbody>
                    <tr v-for="order in orderList">
                        <td class="noPrint">
                            <el-checkbox :disabled="!!order.isSettle" v-model="order.isChecked" @change="toggleCheckItem"></el-checkbox>
                        </td>
                        <td>{{parseDate(order.createAt)}}</td>
                        <td>{{order.name}}</td>
                        <td>{{order.label}}</td>
                        <td>{{order.unit}}</td>
                        <td>{{order.number}}</td>
                        <td>{{order.price}}</td>
                        <td>{{order.count}}</td>
                        <td>
                            <p v-if="order.isSettle">已结算</p>
                            <p v-else>未结算</p>
                        </td>
                        <td class="noPrint">
                            <p v-if="order.status==1">备货中</p>
                            <p v-else-if="order.status==2">已出货</p>
                        </td>
                        <td class="noPrint">
                            <el-button v-if="!order.isSettle" type="primary" size="mini" @click="editOrder(order)">修改</el-button>
                            <el-button v-if="!order.isSettle" type="danger" size="mini" @click="deleteOrder(order.id)">删除</el-button>
                        </td>
                    </tr>
                    <tr>
                        <td class="noPrint"></td>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="noPrint"></td>
                        <td class="noPrint"></td>
                    </tr>
                    <tr>
                        <td class="noPrint"></td>
                        <td>余款</td>
                        <td>{{spareMoney}}元</td>
                        <td></td>
                        <td>本月货款：{{allCount}}</td>
                        <td></td>
                        <td></td>
                        <td>应付货款：</td>
                        <td>{{(spareMoney*100+allCount*100)/100}}</td>
                        <td class="noPrint"></td>
                        <td class="noPrint"></td>
                    </tr>
                </tbody>
            </table>
        </div>
		<el-dialog title="订单信息" :visible.sync="dialogFormVisible">
            <div v-loading="loadingForm">
              <el-form v-model="order"  ref="customerForm"> 
                <el-form-item label="客户姓名" label-width="120px">
                	<el-select v-model="order.customerId" placeholder="请选择客户">
				      <el-option v-for="customer in customerList" :label="customer.name" :value="customer.id"></el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="商品名称" label-width="120px">
                	<el-select v-model="order.goodId" placeholder="请选择商品" @change="changeGood">
				      <el-option v-for="good in goodList" :label="good.name" :value="good.id"></el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="商品规格" label-width="120px">
                	<el-select v-model="order.labelId" placeholder="请选择规格" @change="changeLabel">
				      <el-option v-for="label in labelList" :label="label.name" :value="label.id"></el-option>
				    </el-select>
                </el-form-item>
                <el-form-item label="订单状态" label-width="120px">
                <el-select v-model="order.status" placeholder="请选择订单状态">
                      <el-option label="备货中" value="1"></el-option>
                      <el-option label="已出货" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量" label-width="120px" >
                    <el-input v-model.number="order.number"></el-input>
                </el-form-item>
                <el-form-item label="单价" label-width="120px" >
                    ￥{{order.price}}
                </el-form-item>
                <el-form-item label="总价" label-width="120px" >
                    ￥<span class="money">{{(order.price*100*order.number)/100}}</span>
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
import orderService from '../service/orderService'
import goodsService from '../service/goodsService'
import accountService from '../service/accountService'
import moment from 'moment'
    export default {
        mixins: [],
        name: 'active',
        components: {},
        data(){
        	return {
                userName:'',
        		loadingTable:false,
        		dialogFormVisible:false,
        		loadingForm:false,
        		customerList:[],
        		goodList:[],
        		labelList:[],
                orderList:[],
        		fileterCustomer:'',
        		fileterStatus:'',
        		daterange:[null,null],
        		order:{
        			id:null,
        			customerId:'',
        			goodId:'',
        			labelId:'',
        			number:0,
        			price:'',
                    status:"1"
        		},
                ischeckAll:false,
                allCount:0,
                spareMoney:0
        	}
        },
        mounted(){
            // this.drawList();
        	goodsService.getGoods(1,9999).then(res=>{
        		if(res.status==0){
        			for(let good of res.data){
                        good.labels.sort(function(a,b){
                            return a.id-b.id
                        })
                    }
        			this.goodList=res.data
        		}
        	})
        	customerService.getCustomer(1,9999).then(res=>{
        		if(res.status==0){
        			this.customerList=res.data
        		}
        	})
            accountService.getInfo().then(res=>{
                this.userName=res.data.userName
            })
        },
        methods:{
            drawList(){
            	this.loadingTable=true;
                var filterStartDate=this.daterange[0]?this.daterange[0].valueOf():null
                var filterEndDate=this.daterange[1]?this.daterange[1].valueOf():null
            	orderService.getOrder({
            		status:this.fileterStatus,
            		customerId:this.fileterCustomer,
            		filterStartDate:filterStartDate,
            		filterEndDate:filterEndDate,
            	}).then(res=>{
                    if(res.status==0){
                        for(let order of res.data){
                            order.isChecked=false;
                        }
                        this.orderList=res.data
                        this.loadingTable=false;
                    }
                    this.computedMoney()
            	})
            },
            addOrder(){
            	this.order.id=null;
            	this.order.customerId=''
            	this.order.goodId=''
            	this.order.labelId=''
            	this.order.price=''
            	this.order.number=0
            	this.dialogFormVisible=true
            },
            editOrder(order){
                this.labelList=this.findLabelList(order.goodId);
                this.order.id=order.id;
                this.order.customerId=order.customerId
                this.order.goodId=order.goodId
                this.order.labelId=order.labelId
                this.order.price=order.price
                this.order.number=order.number
                this.order.status=order.status+""
                this.dialogFormVisible=true
            },
            commitForm(){
            	this.loadingForm=true;
            	if(this.order.id){
                    orderService.putOrder(this.order).then(res=>{
                        if(res.status==0){
                            this.$message.success('保存成功');
                        }else{
                            this.$message.error(res.msg);
                        }
                        this.loadingForm=false;
                        this.dialogFormVisible=false
                        this.drawList()
                    })
            	}else{
            		orderService.postOrder(this.order).then(res=>{
	            		if(res.status==0){
	            			this.$message.success('保存成功');
	            		}else{
	            			this.$message.error(res.msg);
	            		}
                        this.loadingForm=false;
                        this.dialogFormVisible=false
                        this.drawList()
	            	})
            	}
            	
            },
            changeGood(goodId){
            	this.order.labelId=''
            	this.labelList=this.findLabelList(goodId);
            },
            changeLabel(labelId){
                if(labelId){
                    this.order.price=this.findLabelPrice(labelId)
                }
            	
            },
            findLabelList(goodId){
            	for(let good of this.goodList){
            		if(good.id==goodId){
            			return good.labels;
            		}
            	}
            },
            findLabelPrice(labelId){
            	for(let label of this.labelList){
            		if(label.id==labelId){
            			return label.price;
            		}
            	}
            },
            parseDate(timesteamp){
                return moment(timesteamp).format('YYYY/MM/DD')
            },
            printOrder(){
                window.print();
            },
            findCustomer(customerId){
                for(let customer of this.customerList){
                    if(customer.id==customerId){
                        return customer;
                    }
                }
                return ''
            },
            toggleCheckAll(){
                var value=this.ischeckAll
                if(value){
                    for(let order of this.orderList){
                        if(!order.isSettle){
                            order.isChecked=true
                        }
                    }
                }else{
                    for(let order of this.orderList){
                        if(!order.isSettle){
                            order.isChecked=false
                        }
                    }
                }
            },
            toggleCheckItem(){
                let checkAll=true
                for(let order of this.orderList){
                    if(!order.isSettle&&!order.isChecked){
                        checkAll=false
                    }
                }
                this.ischeckAll=checkAll
            },
            deleteOrder(id){
                orderService.deleteOrder(id).then(res=>{
                    if(res.status==0){
                        this.$message.success('删除成功');
                        this.drawList();
                    }
                })
            },
            computedMoney(){
                var allCount=0;
                for(let order of this.orderList){
                    if(!order.isSettle){
                        var count=order.count
                        allCount=(parseFloat(count)*100+allCount*100)/100
                    }
                    
                }
                this.allCount=allCount
                this.spareMoney=this.findCustomer(this.fileterCustomer).spareMoney
            },
            settleSubmit(){
                var orderIds=[]
                for(let order of this.orderList){
                    if(!order.isSettle&&order.isChecked){
                        orderIds.push(order.id)
                    }
                }
                orderService.postSettle({
                    orderIds:orderIds
                }).then(res=>{
                    if(res.status==0){
                        this.$message.success('结算成功');
                        this.findCustomer(this.fileterCustomer).spareMoney=res.data.spareMoney
                        this.drawList();
                    }
                })
            }
        }
    }

</script>
<style lang="scss">
    .order{
        .title{
            margin-top:4px;
            margin-bottom:10px;
        }
        .add_order{
            margin-bottom:4px;
        }
        .printPaper{
            width:100%;
            padding:0 5mm;
            h2{
                text-align: center;
                margin: 10mm auto 6mm;
                font-size: 6mm;
                font-weight: 500;
            }
            .orderList{
                width:100%;
                border:1px solid #aaa;
                border-collapse: collapse;
                th,td{
                    border:1px solid #aaa;
                    padding:6px 6px;
                    text-align:center;
                    font-size:14px;
                }
                
            }
            .customerName{
                margin-bottom:4mm;
            }
            .payBtn{
                float:right;
            }
        }
        
        .money{
        	color:#ff4949;
        }
        .dialog-footer{
            text-align:center;
        }
    }
    @page {
        size: A4;
        margin: 0;
    }
    @media print {
        .noPrint{
            display: none;
        }
        .printPaper{
            width:210mm;
            padding:0 5mm;
            .orderList{
                width:200mm;
            }
        }
    }
</style>