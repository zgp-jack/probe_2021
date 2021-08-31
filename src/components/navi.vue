<template>
  <div class="navibox" :class="[{'retractnavibox':ifshow},{'retractnavibox2':!ifshow}]">
		<div class="navi-outerbox">
        <el-radio-group v-model="isCollapse" @change='ifshow = !ifshow' class="backBtn">
          <el-radio-button v-if='ifshow'  class="rightBtn" :label="false"></el-radio-button>
          <el-radio-button v-if='!ifshow' class="leftBtn" :label="true"></el-radio-button>
        </el-radio-group>
        <el-scrollbar class="menu-scroll">
        <div class="navMenuBox">
         <el-menu
            :default-active="$store.state.defaultActive"
            :default-openeds="$store.state.openlist"
            class="el-menu-vertical-demo"
            id="navMenuStyle"
            background-color="#001c1a"
            text-color="#fff"
            active-text-color="#fff"
            :unique-opened="true"
            :router="true"
            @open="handleOpen"
            @close="handleClose"
            :collapse="!isCollapse"
            :collapse-transition="false"
            @select="selectNavi"><!-- 点击导航 -->

          <el-menu-item id="navSubMenuStyle"
              v-for="(item1,index1) in hasChildrenMenuArr.nohas"
              :key="index1+item1.icon"
              :index="item1.url"
			  >
                <i :class="item1.icon"></i>
                <span slot="title">{{ item1.name }}</span>
          </el-menu-item>

            <el-submenu id="navSubMenuStyle" v-for="(item,index2) in hasChildrenMenuArr.has"
                :key="index2+item.icon"
                :index="item.icon">

            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>

            <el-menu-item v-for="(subitem,subindex) in item.children" :index="subitem.url" :key="subindex" class='subitemname'>{{ subitem.name }}</el-menu-item>

            </el-submenu>
      </el-menu>
      </div>
      </el-scrollbar>
	</div>
  </div>
</template>

<script>
  import store from '../store.js'
  export default {
    name: 'Navi',
	data (){
		return {
		  isCollapse: true,
		  ifshow:true
		}
	},
	computed:{
		hasChildrenMenuArr:function(){
			let navi = {has:[],nohas:[]};
			var menuArr = JSON.parse(sessionStorage.getItem('menuArr'))
			let len = menuArr.length
			for(var i=0;i<len;i++){
				if(menuArr[i].children<1){
					navi.nohas.push(menuArr[i])
				}else{
					navi.has.push(menuArr[i])
				}
			}
			console.log(navi)
			return navi
		}
	},
	methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
	selectNavi:function(index,pathindex){

    this.$store.commit('updateIncludeList', []);

    this.$store.state.menuClick = true;
		sessionStorage.setItem('defaultActive',index)//index 路由
		this.$store.dispatch('setDefaultActive', index)
		var openlistArr = [];
		openlistArr.push(pathindex[0]);
		sessionStorage.setItem('openlist',JSON.stringify(openlistArr))//openlistArr 是小图标
		this.$store.dispatch('setOpenList', openlistArr)
		// this.$store.dispatch('pushCurrentExistTabPageArr',index)
		this.$store.dispatch('setCurrentAddress',index)

		let pageTabArr = JSON.parse(sessionStorage.getItem('pageTabArr'))
		for(let i=0;i<pageTabArr.length;i++){
			if(index == pageTabArr[i].url){
        this.$store.dispatch('setEditableTabsValue',pageTabArr[i].name)
				break
			}
    }
	},
	},
	created: function(){
	}
  }
</script>
<style scoped>
  .navi-outerbox{position: relative;height: 100%;}
  .rightBtn{background: url(../assets/right.png) no-repeat center;width:16px; height: 72px!important;cursor: pointer;display: block;}
  .leftBtn{background: url(../assets/left.png) no-repeat center;width:16px; height: 72px!important;cursor: pointer;display: block;}
  .backBtn{width:16px; height: 72px;position: absolute;z-index:999;right: -8px;top:50%;bottom: 50%;margin: auto;}
  .el-menu{border-right:none;}
  /* .left-navi{width: 220px!important;height: 100%;} */
	.navibox{width: 220px;height: 100%;padding-top:23px;}
  .retractnavibox{width: 237px;}
  .retractnavibox2{width: 68px;}
	.head-img img{width: 100%;height: 100%;}
	.navi-outerbox ul.navi-outerbox ul li{width: 100%;}
  .navi-outerbox ul li span{font-weight:normal; font-size: 15px; margin-left: 15px;letter-spacing: 1px;}
  .el-submenu .el-menu-item{height: 42px;line-height: 42px;}
  .el-menu-item{font-size:13px; letter-spacing: 2px; height: 58px;line-height: 58px;display: flex;}
  .navMenuBox >>> .el-submenu__title{height: 58px !important;line-height: 58px !important;font-size: 12px;padding: 0;display:flex;}

	.el-menu-item.is-active{background: url(../assets/nav-actived.png) no-repeat; background-size: cover; display: flex; padding-left: 85px !important;}
	.el-menu-item.is-active i,.el-menu-item.is-active:hover i{
    color: #fff!important;
    display: block;
    font-size: 20px;
    background-image: linear-gradient(to right bottom, #f7fcff 10%, #a8e2ff);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
	.navi-outerbox ul li i{
    color: #fff;
    line-height: 58px;
    display: block;
    font-size: 18px;
    background-image: linear-gradient(to right bottom, #01e2d0 20%, #028783);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
	.subitemname{padding-left: 50px !important;}


  /* 导航滚动 */
  .navMenuBox{height:100%;width:100%;overflow: hidden;}
  .el-menu{border-right: none;width: 100%;height: 100%;overflow-x: hidden;overflow-y: auto;}

  .menu-scroll>>>.el-scrollbar__wrap {
     overflow-x: hidden;
  }

</style>
