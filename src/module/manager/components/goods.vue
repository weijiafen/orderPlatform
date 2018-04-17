<template>
	<div>
		<p>功能尚未开发，敬请期待！</p>
	</div>
	
</template>
<script>
import goodsService from '../service/goodsService'
    export default {
        mixins: [],
        name: 'active',
        components: {},
        mounted(){
        	goodsService.getGoods().then(res=>{
        		
        	})
        },
        methods:{

        }
    }

</script>