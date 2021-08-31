import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import './style/Home.css'
import './style/icon/iconfont.css'
import moment from 'moment'
import htmlToPdf from './js/htmlToPdf.js'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import CommonFun from './js/commonFun.js'
import uploader from 'vue-simple-uploader'
import axios from 'axios'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(htmlToPdf)
Vue.use(VueQuillEditor)
Vue.use(uploader)

//路由切换时，取消所有正在发送的请求
Vue.axiosPromiseArr = [];
router.beforeEach((to, from, next) => {
    Vue.axiosPromiseArr.forEach((ele, index) => {
        ele.cancel()
        delete Vue.axiosPromiseArr[index]
    })
	next();
})

Vue.filter('dateTimeFormat', function (dateStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dateStr).format(pattern)
})
Vue.filter('dateFormat', function (dateStr, pattern = 'YYYY-MM-DD') {
  return moment(dateStr).format(pattern)
})
Vue.filter('dateTdFormat', function (dateStr, pattern = 'HH:mm') {
  return moment(dateStr).format(pattern)
})
//自定义指令
Vue.directive('drag', function(el, binding) {
	let oDiv = el;  // 获取当前元素
	oDiv.onmousedown = (e) => {
		let box = binding.value;
		// 算出鼠标相对元素的位置
		let disX = e.clientX - oDiv.offsetLeft;
		let disY = e.clientY - oDiv.offsetTop;
		let dixW = (box.width || 1920) - oDiv.offsetWidth;
		let dixY = (box.height || 980) - oDiv.offsetHeight;
		document.onmousemove = (e) => {
			// 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
			let left = e.clientX - disX;
			let top = e.clientY - disY;

			left = left < 0 ? 0 : left > dixW ? dixW : left;
			top = top < 0 ? 0 : top > dixY ? dixY : top;
			
			oDiv.style.left = left + 'px';
			oDiv.style.top = top + 'px';
			
		};

		document.onmouseup = (e) => {
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}
})
Vue.prototype.CommonFun = CommonFun
axios.get('/static/config.json').then((res)=>{
	Vue.prototype.VUE_APP_BASE_URL = res.data.VUE_APP_BASE_URL;
	Vue.prototype.VUE_APP_FILE_URL = res.data.VUE_APP_FILE_URL;
	Vue.prototype.VUE_APP_WS_URL = res.data.VUE_APP_WS_URL;
	
	new Vue({
	  router,
	  store,
	  render: h => h(App)
	}).$mount('#app')
})

