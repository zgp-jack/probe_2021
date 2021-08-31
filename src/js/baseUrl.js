import $ from 'jquery' 
let obj = {}
if(process.env.NODE_ENV  == 'production'){
	$.ajax({
		type:"GET",
		url:"/static/config.json",
		async: false,
		success:function(data){
			let FILEURL = "http://" + data.VUE_APP_BASE +  data.VUE_APP_FILE_URL
			let WSURL = "ws://" + data.VUE_APP_BASE + data.VUE_APP_WS_URL
			if(data.VUE_APP_FILE != ""){
				FILEURL = "http://" + data.VUE_APP_FILE +  data.VUE_APP_FILE_URL
			}
			if(data.VUE_APP_WS != ""){
				WSURL = "ws://" + data.VUE_APP_WS + data.VUE_APP_WS_URL
			}
			obj = {
				BASEURL: "http://" + data.VUE_APP_BASE +  data.VUE_APP_BASE_URL,
				FILEURL: FILEURL,
				WSURL: WSURL,
				WSSOURCE:  data.VUE_APP_WS_SOURCE
			}
		},
	})
}else{
	obj = {
			BASEURL: process.env.VUE_APP_BASE_URL,
			FILEURL: process.env.VUE_APP_FILE_URL,
			WSURL: process.env.VUE_APP_WS_URL, 
			WSSOURCE: process.env.VUE_APP_WS_SOURCE
		}
}
console.log('!!!!!!!!')
console.log(obj)
export default (obj)





