<template>
<!-- 搜索 开始 -->
	<div class="searchbox">
		<div class="topruleform-width240"><el-input class="input-search" :placeholder="placeholderValue" v-model="searchValue" /> </div>
		<div class="popup-but-submit" @click="searchFun()"><i class="el-icon-search"></i></div>
	</div>
<!--搜索 结束  -->
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      searchValue: ''
    }
  },
  props: ['placeholderValue'],
  methods: {
    searchFun: function () {
      this.$emit('searchFun', this.searchValue)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.searchbox{display: flex;height: 30px;}
.searchbox .inputdiv{margin-right: 3px;height: 100%;width: 240px;border: 1px solid #05504b;}
.searchbox .inputdiv .input-search{
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  line-height: 30px;
  padding-left: 8px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 2px;
  background-color: RGBA(2, 12, 12, 1);
  color: #fff;
  box-shadow: inset 0px 0px 8px 0px #025494, 0px 0px 4px 0px #025494;
}
.popup-but-submit{
  margin-left: 16px;
}
.search-but{border-radius:2px;padding:0px 10px;margin-right:3px;background-color: #ffbc5d;color: #fff;font-size:14px;font-weight:bolder;cursor: pointer;text-align: center;line-height: 30px;}
</style>
