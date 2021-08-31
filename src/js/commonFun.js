import moment from 'moment';
export default {
	InputErrorPrompt: function(val, msg, type, that) {
		if (type === 'null') {
			if (val === '') {
				that.$message.error(msg)
				return true
			}
		}
	},
	FormatTime: function(date) {
		return date.split(' ')[0]
	},
	dateFormat: function(date, fmt = 'YYYY-MM-DD') {
		if (this.ifNall(date)) {
			return null
		} else {
			return moment(date).format(fmt)
		}
	},
	responseError: function(data, that) {
		that.$message.error(data.message)
	},
	responseSuccess: function(msg, that) {
		that.$message.success(msg)
	},
	responseWarning: function(msg, that) {
		that.$message.warning(msg, that);
	},
	ifNall: function(data) {
		if (data == null || data === '' || data === undefined || data.length === 0 || JSON.stringify(data) === '{}') {
			return true
		} else {
			return false
		}
	},
	inputVerifica: function(value, type, msg, that) {
		if (type === 'tel') {
			if (!(/^1[3456789]\d{9}$/.test(value))) {
				that.$message.error(msg)
				return false
			}
		}
		if (type === 'str') {
			if (!value) {
				that.$message.error(msg)
				return false
			}
		}
		if (type === 'float') {
			if (value && !(/\d+(\.\d{0,2})?/.test(value))) {
				that.$message.error(msg)
				return false
			}
		}
		if (type === 'num') {
			if (value && !(/[1-9]\d*/.test(value))) {
				that.$message.error(msg)
				return false
			}
		}
		if (type === 'array') {
			if (!(value && value.length > 0)) {
				that.$message.error(msg)
				return false
			}
		}
		return true
	},
	transformNum: function(num) {
		if (num && /^[1-9]\d*(\.\d{0,2})?$/.test(num)) {
			return parseFloat(num)
		}
		return 0
	},
	currentCompanyIdsArr: [], //选择保管单位 领用单位时候的选中叶子节点ids
	// 递归获得所有的子节点id
	getAllChildrenIds: function(data) {
		// if data null
		this.currentCompanyIdsArr.push(data.id)
		if (this.ifNall(data.children)) {
			return
		}

		for (let i = 0; i < data.children.length; i++) {
			this.getAllChildrenIds(data.children[i])
		}
	},
	// 获得树的所有叶子节点 树是数组
	getAllLeaf: function(tree) {
		let result = []
		let $this = this

		function getLeaf(tree) {
			tree.forEach(item => {
				if ($this.ifNall(item.children)) {
					result.push(item.id)
				} else {
					getLeaf(item.children)
				}
			})
		}

		if (!$this.ifNall(tree)) {
			getLeaf(tree)
		}

		return result
	},
	isLeafTip: '只能在底层单位新增',
	openFullScreen: function(that) {
		const loading = that.$loading({
			lock: true,
			spinner: 'el-icon-loading',
			background: 'transparent',
			customClass: 'elloadingspinner'
		});
		return loading;
	},
	closeFullScreen: function(loading) {
		loading.close();
	},
	getCurrentButtonJurisdiction: function(url) {
		let $this = this
		let butArr = []
		let len = 0
		//console.log(sessionStorage.getItem('buttonsJurisdiction'))
		if (!$this.ifNall(JSON.parse(sessionStorage.getItem('buttonsJurisdiction')))) {
			len = JSON.parse(sessionStorage.getItem('buttonsJurisdiction')).length
			for (let i = 0; i < len; i++) {
				let item = JSON.parse(sessionStorage.getItem('buttonsJurisdiction'))[i]
				if (item.router == url) {
					butArr = JSON.parse(JSON.stringify(item.buttonCodes))
				}
			}
		}
		console.log("butArr::")
		console.log(butArr)
		return butArr;
	},
	getNowTime() {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var nowDate = year + "-" + month;
		return nowDate
	},
	//通过字典标准值获取字典子级数据
	getDataDictionaryChildrenListData: function(value) {
		let $this = this
		let dataDictionaryList = JSON.parse(sessionStorage.getItem('dataDictionaryList'))
		if (!$this.ifNall(dataDictionaryList)) {
			let len = dataDictionaryList[0].children.length
			for (let i = 0; i < len; i++) {
				let item = dataDictionaryList[0].children[i]
				if (item.value == value) {
					return dataDictionaryList[0].children[i].children
				}
			}
		}
		return []
	},
	input_num: function(obj) {
		// 清除"数字"和"."以外的字符
		obj.value = obj.value.replace(/[^\d.]/g, "");
		// 验证第一个字符是数字
		obj.value = obj.value.replace(/^\./g, "");
		// 只保留第一个, 清除多余的
		obj.value = obj.value.replace(/\.{2,}/g, ".");
		obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		// 只能输入两个小数
		obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

		//如果有小数点，不能为类似 1.10的金额  
		if (obj.value.indexOf(".") > 0 && obj.value.indexOf("0") > 2) {
			obj.value = parseFloat(obj.value);
		}
		//如果有小数点，不能为类似 0.00的金额 
		if (obj.value.indexOf(".") > 0 && obj.value.lastIndexOf("0") > 2) {
			obj.value = parseFloat(obj.value);
		}
		//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
		if (obj.value.indexOf(".") <= 0 && obj.value != "") {
			obj.value = parseFloat(obj.value);
		}
	},
	//通过字典标准值获取字典子级数据
	getDataDictionaryChildrenListData : function (value){
		let $this = this
		let dataDictionaryList = JSON.parse(sessionStorage.getItem('dataDictionaryList'))
		if(!$this.ifNall(dataDictionaryList)){
			let len = dataDictionaryList[0].children.length
			for(let i=0 ; i<len ; i++){
				let item = dataDictionaryList[0].children[i]
				if(item.value == value){
					return dataDictionaryList[0].children[i].children
				}
			}
		}
		return []
	},
	/* 转化数组中的每一项（字符串）-> 数字类型 */
	transformationToInt(data){
		let tempArr = []
		for(let i=0;i<data.length;i++){
			tempArr.push(parseInt(data[i]))
		}
		return tempArr
	},
	/*  表格上展示的方法 十位时间戳转化成年月日时分秒 */
	formatterTime(row, column){
		let time = 0
		if(column.label == '开始时间' || column.label == '发生时间'){
			time = row.beginTime
		}
		if(column.label == '结束时间' || column.label == '恢复时间'){
			time = row.endTime
		}
		if(column == '告警时间'){
			time = row.time;
		}
		if(time == 0 || !time){
			return ''
		}
		let date = new Date(parseInt(time) * 1000);
		let y = date.getFullYear();
		let m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		let d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		let h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		let minute = date.getMinutes();
		let second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute; second = second < 10 ? ('0' + second) : second;
		return (y + '-' + m + '-' + d + ' '+ h + ':' + minute + ':' + second)
	},
	formatterTimeConversion(row, column){
        let time = 0
        if(column.label == '开始日期' || column.label == '开始时间'){
            time = row.beginTime
        }
        if(column.label == '结束日期'  || column.label == '结束时间' ){
            time = row.endTime
        }
        if(time == 0 || !time){
            return ''
        }
        let date = new Date(parseInt(time) * 1000);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute; second = second < 10 ? ('0' + second) : second;
        return (y + '-' + m + '-' + d + ' '+ h + ':' + minute + ':' + second)
    },
		
	formatterContinuedTime(row,column){
		let res = row.duration
		if(!res){
			return '00:00:00'
		}else{
			let h = (parseInt( res/3600 )<=9)?('0'+parseInt( res/3600 )):parseInt( res/3600 )
			let m = (parseInt( (res-(h*3600)) / 60 )<=9)?('0'+parseInt( (res-(h*3600)) / 60 )):parseInt( (res-(h*3600)) / 60 ) 
			let s = (res - (h*3600) - (m*60)<=9)?('0'+(res - (h*3600) - (m*60))):(res - (h*3600) - (m*60))
			return h+':'+m+':'+s
		}
	},
	formatterContinuedTimeByKey(row, column){
		let res = row[column.property]
		if(!res){
			return '00:00:00'
		}else{
			let h = (parseInt( res/3600 )<=9)?('0'+parseInt( res/3600 )):parseInt( res/3600 )
			let m = (parseInt( (res-(h*3600)) / 60 )<=9)?('0'+parseInt( (res-(h*3600)) / 60 )):parseInt( (res-(h*3600)) / 60 ) 
			let s = (res - (h*3600) - (m*60)<=9)?('0'+(res - (h*3600) - (m*60))):(res - (h*3600) - (m*60))
			return h+':'+m+':'+s
		}
	},
	formatterContinuedTime(row, column) {
		let second = row[column.property]
		if (second > 0) {
			var day = 0;
			var hour = 0;
			var minute = 0;
			var data = {};
			minute = Math.floor(second / (60))
			if (parseInt(minute) >= 60) {
				hour = parseInt(minute / 60);
				minute %= 60; //算出有多分钟
			}
			if (parseInt(hour) >= 24) {
				day = parseInt(hour / 24);
				hour %= 24; //算出有多分钟
			}
			data.day = day?day+'天': '';
			data.hour = hour?hour+'小时':'';
			data.minute = minute?minute+'分钟':'';
			data.second = (second % 60)?(second % 60)+'秒':'';
			return data.day+data.hour+data.minute+data.second;
		}
	},
	formatterContinuedTimeByKey (row, column) {
			let second = row[column.property]
			if (second > 0) {
				var day = 0;
				var hour = 0;
				var minute = 0;
				var data = {};
				minute = Math.floor(second / (60))
				if (parseInt(minute) >= 60) {
					hour = parseInt(minute / 60);
					minute %= 60; //算出有多分钟
				}
				if (parseInt(hour) >= 24) {
					day = parseInt(hour / 24);
					hour %= 24; //算出有多分钟
				}
				data.day = day?day+'天': '';
				data.hour = hour?hour+'小时':'';
				data.minute = minute?minute+'分钟':'';
				data.second = (second % 60)?(second % 60)+'秒':'';
				return data.day+data.hour+data.minute+data.second;
			}else if(second == 0){
				return 0 + '秒'
			}
	},
	formatterParcentByKey(row, column) {
		let res = row[column.property]
		return res + '%'
	},
	formatterCompanyName:function(row, column){
		if(!row.parentCompanyName){
			return row.companyName
		}else{
			return (row.parentCompanyName +'/'+row.companyName)
		}
	},
	debounce(fn, t = 500) {
		let lastTime;
		return () => {
			clearTimeout(lastTime);
			const [that, args] = [this, arguments];
			lastTime = setTimeout(() => {
			   fn.apply(that, args);
			}, t);
		}
	},
	throttle(func, t = 500) {
		var timeout;
		return () => {
			var context = this;
			var args = arguments;
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = null;
					func.apply(context, args)
				}, t)
			}
		}
	},
	deviceTypeFun(row) {
		switch(row.deviceType){
			case '1' : 
				return '路由器';
			case '2' : 
				return '交换机';
			case '3' :
				return 'IPC';
			case '4' :
				return 'MCU';
			case '5' :
				return '服务器';
			case '6' :
				return 'PC';
			case '7' :
				return '终端';
			default  : 
				return ''
		}
	},
	dataSource(row) {
		if(row.taskType == 1) {
			return '拨测任务'
		}else if(row.taskType == 2){
			return '接口任务'
		}else if(row.taskType == 3){
			return '专线任务'
		}
	},
	faultTypeFun(row) {
		if(row.eventType == 1){
			return '时延'
		}else if(row.eventType == 2) {
			return '丢包'
		}else if(row.eventType == 3) {
			return '中断'
		}
	},
	statusFun(row) {
		if(row.status == 1){
			return '在线'
		}else{
			return '离线'
		}
	},
	async asyncForEach(num, callback) {
		for (let index = 0; index < num; index++) {
			await callback(index)
		}
	},
	copyToClip(content) {
		let aux = document.createElement("input"); 
		aux.setAttribute("value", content); 
		document.body.appendChild(aux); 
		aux.select();
		document.execCommand("copy"); 
		document.body.removeChild(aux);
	}
}
