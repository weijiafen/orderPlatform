import Vue from 'vue'
import Router from 'vue-router'
const Login = resolve => require(['../components/login.vue'], resolve)
const Index = resolve => require(['../components/index.vue'], resolve)
const Order = resolve => require(['../components/order.vue'], resolve)
const Goods = resolve => require(['../components/goods.vue'], resolve)
const Customer = resolve => require(['../components/customer.vue'], resolve)
const Report = resolve => require(['../components/report.vue'], resolve)
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
        	path:'/',
        	name:'index',
        	component:Index,
        	children:[
        		{
        			path:"order",
        			component:Order
        		},
        		{
        			path:"goods",
        			component:Goods
        		},
                {
                    path:"customer",
                    component:Customer
                },
                {
                    path:"report",
                    component:Report
                },
        	]
        }
    ]
})