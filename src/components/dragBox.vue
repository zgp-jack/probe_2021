<template>
    <div class="drag-box" v-drag="{width: box.width, height: box.height}" id="drag" v-if="isShowDrag">
        <div class="item-box">
            <div class="item-box-item" v-for="item,index in list" :key="index">
                <span>{{item.typeName}}</span>
                <!-- <span><b style="color: #43D782">{{item.recovery || 0 }}</b> 已恢复</span> -->
                <span @click="clickEvent(item)"><b style="color: #FF5454">{{item.error || 0}}</b> 未恢复</span>  
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: [Object, Array],
            default: () => {
                return [
                    {typeName: '网络故障', recovery: 0, error: 0},
                    {typeName: '设备故障', recovery: 0, error: 0},
                ]
            }
        },
        box: {
            type: Object,
            default: () => {
                return {
                    width: 600,
                    height: 200
                }
            }
        }
    },
	data(){
		return {
			isShowDrag: true,
		}
	},
    mounted() {

    },
    methods: {
        clickEvent(item) {
            this.$emit('clickEvent', item);
        }
    }
}
</script>
<style lang="scss" scoped>
.drag-box {
	position:absolute;
	top: 38px;
	left: 52px;
 	width: 180px;
    height: 56px;
    border-radius: 2px;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    border: 1px solid #29B3AD;
    cursor: pointer;
    line-height: 20px;
    padding: 5px 10px;
    .item-box{
        position: relative;
        z-index: 999;
        background-color: transparent;
        color: #fff;
        .item-box-item{
            display: flex;
            user-select: none;
            >span{
                display: inline-block;
                flex-grow: 1;
            }
        }
    }
}
.drag-box::after{
    content: '';
    position: absolute;
    z-index: 998;
    top: 0;
    left: 0;
    width: 178px;
    height: 54px;
    background-color: #000;
    opacity: .5;
    border-radius: 2px;
}
</style>