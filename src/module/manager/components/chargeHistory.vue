<template>
	<div class="chargeHistory">
		<h2 class="title">
			<a href="#/customer">客户列表</a>
		/还款记录</h2>
		<el-table
            :data="hostoryList"
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
              prop="money"
              label="还款金额"
              width="">
            </el-table-column>
            <el-table-column
              prop="createAt"
              label="还款时间"
              width="">
              	<template scope="scope">
              		{{parseDate(scope.row.createAt)}}
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
	</div>
	
</template>
<script>
import customerService from '../service/customerService'
import moment from 'moment'
    export default {
        mixins: [],
        name: 'active',
        components: {},
        data(){
        	return {
        		loadingTable:false,
        		hostoryList:[],
        		pageNum:1,
        		total:0,
        		customerId:this.$route.params.customerId
        	}
        },
        mounted(){
        	this.drawList()
        },
        methods:{
            drawList(){
            	this.loadingTable=true
            	customerService.getChargeHistory(this.customerId,this.pageNum).then(res=>{
            		if(res.status==0){
            			this.hostoryList=res.data
            			this.total=res.total
            			this.loadingTable=false
            		}
            	})
            },
            parseDate(timesteamp){
                return moment(timesteamp).format('YYYY-MM-DD HH:MM:SS')
            },
            changePage(page){
                this.pageNum=page;
                this.drawList()
            },
        }
    }

</script>
<style lang="scss">
    .chargeHistory{
        .title{
            margin-top:4px;
            margin-bottom:10px;
        }
        .pagination{
            margin:10px;
            text-align:center;
        }
    }
</style>