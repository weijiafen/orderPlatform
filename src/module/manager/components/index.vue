<template>
	<div>
        <el-menu :default-active="$route.path" theme="dark" mode="horizontal" menu-trigger="click" :router="true" class="noPrint">
            <el-menu-item index="/order">订单</el-menu-item>
            <el-menu-item index="/goods">商品</el-menu-item>
            <el-menu-item index="/customer">客户</el-menu-item>
            <el-menu-item index="/report">报表</el-menu-item>
            <el-button @click="logout" class="logout" type="danger" size="small">退出</el-button>
        </el-menu>
        <div class="mainContainer">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
	</div>
	
</template>
<script>
import server from '../service/accountService'
export default {
    mixins:[],
    components:{},
    data(){
        return {
            navbarIndex:""
        }
    },
    mounted(){
        this.setNavbarIndex()
    },
    updated(){
        this.setNavbarIndex()
    },
    methods:{
        setNavbarIndex(){
           
        },
        logout(){
            server.logout().then((res)=>{
                if(res.status==0){
                    this.$message({
                        type: 'success',
                        message: '账号已退出!'
                    });
                    this.$router.push("/login")
                }
            })
        }
    }
}
</script>
<style type="scss">
    .logout{
        float: right;
        margin-top: 18px;
        margin-right: 6px;
    }
</style>