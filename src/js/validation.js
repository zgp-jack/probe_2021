export default {
	checkNall: function (rule, value, callback) {
		if (!value) {
			return callback(new Error())
		}else{
			callback()
		}
	},
	/* 是否是数字*/
	ifNumber: function(rule, value, callback){
		if (!Number.isInteger(value)) {
			return callback(new Error())
		}
		callback()
	},
	/* 精确到两位小数(小数部分最多两位数，至少一位数) 可以为整数 数值不能大于999999999 数部分最多9位 */
	ifFloat: function(rule, value, callback){
		let reg = /(^[1-9]\d{0,9}\.\d{1,2}$)|(^0\.\d{2}$)|(^[1-9]\.\d{1,2}$)|(^[1-9]\d{0,9}$)/
		let result = (value+'')
		if(!reg.test(result) || value>999999999){
			callback(new Error());
		}else{
			callback()
		}
	},
	/* 可以为空 但有值就用ifFloat规则验证 */
	ifFloatOrNall:function(rule, value, callback){
		if(!value){
			callback()
		}else{
			let reg = /(^[1-9]\d{0,9}\.\d{1,2}$)|(^0\.\d{2}$)|(^[1-9]\.\d{1,2}$)|(^[1-9]\d{0,9}$)/
			let result = (value+'')
			if(!reg.test(result) || value>999999999){
				callback(new Error());
			}else{
				callback()
			}
		}
	},
	ifDouble: function(rule, value, callback){
		let reg = /(^[1-9]\d{0,9}\.\d{1,2}$)|(^0\.\d{2}$)|(^[1-9]\.\d{1,2}$)|(^[1-9]\d{0,9}$)/
		let result = (value+'')
		if(!reg.test(result) || value>999999999){
			callback(new Error());
		}else{
			callback()
		}
	},
	/* 可以为空 但有值就用ifDouble规则验证 */
	ifDoubleOrNall:function(rule, value, callback){
		if(!value){
			callback()
		}else{
			let reg = /(^[1-9]\d{0,9}\.\d{1,2}$)|(^0\.\d{2}$)|(^[1-9]\.\d{1,2}$)|(^[1-9]\d{0,9}$)/
			let result = (value+'')
			if(!reg.test(result) || value>999999999){
				callback(new Error());
			}else{
				callback()
			}
		}
	},
	/* 精确到两位小数 数部分最多10位  小数部分强制2位 */
	ifDecimal: function(rule, value, callback){
		let reg = /(^[1-9]\d{0,9}\.\d{1,2}$)|(^0\.\d{2}$)|(^[1-9]\.\d{1,2}$)|(^[1-9]\d{0,9}$)/
		let result = (value+'')
		if(!reg.test(result) || value>99999999999){
			callback(new Error());
		}else{
			callback()
		}
	},
	/* 可以为空 但有值就用ifDecimal规则验证 */
	ifDecimalOrNall: function(rule, value, callback){
		if(!value){
			callback()
		}else{
			let reg = /(^[1-9]\d{0,9}\.\d{1,2}$)|(^0\.\d{2}$)|(^[1-9]\.\d{1,2}$)|(^[1-9]\d{0,9}$)/
			let result = (value+'')
			if(!reg.test(result) || value>99999999999){
				callback(new Error());
			}else{
				callback()
			}
		}
	},
	/* 正整数*/
	ifInteger: function(rule, value, callback){
		let reg = /^[0-9]*$/
		if(!reg.test(value)){
			return callback(new Error())
		}
		callback()
	},
	/* 正整数*/
	ifIntegerOrNall: function(rule, value, callback){
		if(!value){
			callback()
		}else{
			let reg = /^[0-9]*$/
			if(!reg.test(value)){
				return callback(new Error())
			}
			callback()
		}
	},
	/* 正浮点数*/
	ifPositiveNumber: function(rule, value, callback){
		let reg = /[1-9]\d*.\d*|0.\d*[1-9]\d*/
		if(!reg.test(value)){
			return callback(new Error())
		}
		callback()
	},
	/* 身份证号码*/
	ifIdCard: function(rule, value, callback){
		let reg = /\d{17}[\d|x]|\d{15}/
		if(!reg.test(value)){
			return callback(new Error())
		}
		callback()
	},
	/* 邮箱*/
	ifEmail: function(rule, value, callback){
		let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
		if(!reg.test(value)){
			return callback(new Error())
		}
		callback()
	},
	/* 电话号码*/
	ifTel: function(rule, value, callback){
		let reg = /0?(13|14|15|18)[0-9]{9}/
		if(!reg.test(value)){
			return callback(new Error())
		}
		callback()
	},
	/* 中文字符*/
	ifChines: function(rule, value, callback){
		let reg = /[\u4e00-\u9fa5]/
		if(!reg.test(value)){
			return callback(new Error())
		}
		callback()
	},
	
	/* ip 地址*/
	ifIp: function(rule, value, callback){
		let reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
		console.log('测试：')
		console.log(value)
		console.log(reg.test(value))
		if(!reg.test(value)){
			console.log('错误')
			return callback(new Error())
		}else{
			console.log('正确')
			callback()	
		}
	},
	ifMac:function(rule,value,callback){
		let reg = /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$|^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/
		if(!reg.test(value)){
			console.log('错误')
			return callback(new Error())
		}else{
			console.log('正确')
			callback()	
		}
	},
}
