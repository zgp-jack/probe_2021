<template>
  <div id="global-uploader">
          <!-- 上传 -->
          <uploader
			  ref="uploader"
			  :options="options"
			  :autoStart="false"
			  @file-added="onFileAdded"
			  @file-success="onFileSuccess"
			  @file-progress="onFileProgress"
			  @file-error="onFileError"
			  class="uploader-app">
              <uploader-unsupport></uploader-unsupport>

              <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn" single>点击上传</uploader-btn>
				本地上传最大支持3GB，mp4H.264格式、mp3、pdf格式文件
              <uploader-list v-show="panelShow">
                  <div class="file-panel" slot-scope="props">
                      <div class="file-title"> <!-- v-if="false" -->
                          <h2>文件列表</h2>
                          <div class="operate" v-if="false">
                              <el-button @click="close" type="text">确定</el-button>
                          </div>
                      </div>
                      <ul class="file-list"><!--  v-if="false" -->
                          <li v-for="file in props.fileList" :key="file.id" class="file-li">
                              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                          </li>
                          <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
                      </ul>
                  </div>
              </uploader-list>
          </uploader>
      </div>
</template>

<script>
    /**
     *   全局上传插件
     *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
     *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
     *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
     */
    import $ from "jquery"
    import {ACCEPT_CONFIG} from './vue-simple-upload-js/config.js'
    import Bus from './vue-simple-upload-js/bus.js'
    import SparkMD5 from 'spark-md5'
	import CommonFun from '../js/commonFun.js'
	import baseUrl from '../js/baseUrl.js'
    export default {
      name:'GlobalUploader',
        data() {
            return {
                options: {
                    target: baseUrl.BASEURL + 'file/chunkUpload',// url dai = http://192.168.2.15:8080/api/file/chunkUpload
                    chunkSize: '2048000',//1m = 1048576
                    fileParameterName: 'upfile',
                    maxChunkRetries: 3,
                    testChunks: true,   //是否开启服务器分片校验
                    // 服务器分片校验函数，秒传及断点续传基础
                    checkChunkUploadedByResponse: function (chunk, message) {
                        let objMessage = JSON.parse(message);
						console.log('===')
						console.log(chunk)
						console.log(objMessage)
						if(objMessage.status!=1){
							return true
						}
                        if (objMessage.data.skipUpload) {
                            return true;
                        }
                        return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
                    },
                    headers: {
                       token: sessionStorage.getItem('token')
                    },
                    query() {}
                },
                attrs: {
                    accept: ACCEPT_CONFIG.getAll()
                },
                panelShow: false,   //选择文件后，展示上传panel
				fileList:[],
            }
        },
        mounted() {
            Bus.$on('openUploader', query => {
                this.params = query || {};
                if (this.$refs.uploadBtn) {
                    $('#global-uploader-btn').click();
                }
            });
        },
        computed: {
            //Uploader实例
            uploader() {
                return this.$refs.uploader.uploader;
            }
        },
        methods: {
            onFileAdded(file) {
				if(file.size>3221225472){
					this.$message({ message: '文件不超过3G', type: 'error' });
					return false
				}
				this.$emit('setIfShowFileList',false)
                this.panelShow = true;
                this.computeMD5(file);
                Bus.$emit('fileAdded');
				console.log('获取到文件')
				console.log(file)
            },
            onFileProgress(rootFile, file, chunk) {
                console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
            },
            onFileSuccess(rootFile, file, response, chunk) {
				console.log('===++++++')
				console.log(JSON.parse(response))
				console.log(rootFile)
				console.log(file)
				console.log(response)
				console.log(chunk)
				let $this = this
                let res = JSON.parse(response);

                // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
                if(res.status != 1) {
                    $this.$message({ message: '上传失败', type: 'error' });
                    // 文件状态设为“失败”
                    $this.statusSet(file.id, 'failed');
                    return
                }
				//整个文件上传成功后保存文件在本地
				if(res.status==1 && !CommonFun.ifNall(res.data) && $this.fileListIdCheck(res.data.id)){
					$this.statusSet(file.id, 'success');
					if(res.data.fileOriginalName.lastIndexOf('.') == res.data.fileOriginalName.indexOf('.pdf')){//pdf文件
						let data = res.data
						let obj = {
							uploadFileId:data.id,
							title:data.fileOriginalName,
							displayOrder:$this.fileList.length+1,
							durationHour:0,
							durationMinute:0,
							durationSecond:0,
						}
						$this.fileList.push(obj)
						$this.$emit('setFileList',$this.fileList)
					}else{//视频，音频文件
						/* 获得学习时长 */
						let url = '';
						let audioElement;
						let fileStudyTime = ''
						try {
							url = window.URL.createObjectURL(file.file);
							audioElement = new Audio(url);
							audioElement.addEventListener("loadedmetadata", function (_event) {
								let duration = Math.ceil(audioElement.duration) //向上取整秒速
								let hour = parseInt(duration/3600)
								let min = parseInt((duration - hour*3600)/60)
								let sec = duration - hour*3600 - min*60
								let data = res.data
								let obj = {
									uploadFileId:data.id,
									title:data.fileOriginalName,
									displayOrder:$this.fileList.length+1,
									durationHour:hour,
									durationMinute:min,
									durationSecond:sec,
								}
								$this.fileList.push(obj)
								$this.$emit('setFileList',$this.fileList)
							});
						} catch (error) {
							
						}
					}
					$this.close()
				}
				
                // 如果服务端返回需要合并
                Bus.$emit('fileSuccess');
                console.log('上传成功');
				if(!$this.fileListIdCheck(res.data.id)){
					$this.$emit('setFileList',$this.fileList)
					$this.close()
				}
            },
			fileListIdCheck(id){
				let $this = this
				let k = 0
				for(let i=0;i<$this.fileList.length;i++){
					if($this.fileList[i].uploadFileId == id){
						k+=1
					}
				}
				if(k == 0){
					return true
				}else{
					return false
				}
			},
            onFileError(rootFile, file, response, chunk) {
                this.$message({
                    message: '上传失败',
                    type: 'error'
                })
            },
            /**
             * 计算md5，实现断点续传及秒传
             * @param file
             */
            computeMD5(file) {
                let fileReader = new FileReader();
                let time = new Date().getTime();
                let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                let currentChunk = 0;
                const chunkSize = 10 * 1024 * 1000;
                let chunks = Math.ceil(file.size / chunkSize);
                let spark = new SparkMD5.ArrayBuffer();
                // 文件状态设为"计算MD5"
                this.statusSet(file.id, 'md5');
                file.pause();
                loadNext();
                fileReader.onload = (e => {
                    spark.append(e.target.result);
                    if (currentChunk < chunks) {
                        currentChunk++;
                        loadNext();
                        // 实时展示MD5的计算进度
                        this.$nextTick(() => {
                            $(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
                        })
                    } else {
                        let md5 = spark.end();
                        this.computeMD5Success(md5, file);
                        console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
                    }
                });
                fileReader.onerror = function () {
                    this.error(`文件${file.name}读取出错，请检查该文件`)
                    file.cancel();
                };
                function loadNext() {
                    let start = currentChunk * chunkSize;
                    let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
                }
            },
            computeMD5Success(md5, file) {
                // 将自定义参数直接加载uploader实例的opts上
                Object.assign(this.uploader.opts, {
                    query: {
                        ...this.params,
                    }
                })
                file.uniqueIdentifier = md5;
                file.resume();
                this.statusRemove(file.id);
            },
            close() {
				let $this = this
                $this.uploader.cancel();
                $this.panelShow = false;
				$this.$emit('setIfShowFileList',true)
            },
            /**
             * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
             * @param id
             * @param status
             */
            statusSet(id, status) {
                let statusMap = {
                    md5: {
                        text: '校验文件',
                        bgc: '#fff'
                    },
                    merging: {
                        text: '合并中',
                        bgc: '#e2eeff'
                    },
                    transcoding: {
                        text: '转码中',
                        bgc: '#e2eeff'
                    },
                    failed: {
                        text: '上传失败',
                        bgc: '#e2eeff'
                    },
					success: {
					    text: '成功',
					    bgc: '#e2eeff'
					}
                }
                this.$nextTick(() => {
                    $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
                        'position': 'absolute',
                        'top': '0',
                        'left': '0',
                        'right': '0',
                        'bottom': '0',
                        'zIndex': '1',
                        'backgroundColor': statusMap[status].bgc
                    }).text(statusMap[status].text);
                })
            },
            statusRemove(id) {
                this.$nextTick(() => {
                    $(`.myStatus_${id}`).remove();
                })
            },
            error(msg) {
                this.$notify({
                    title: '错误',
                    message: '错误',
                    type: 'error',
                    duration: 2000
                })
            }
        },
        watch: {},
        destroyed() {
            Bus.$off('openUploader');
        },
        components: {},
		created: function (){
			let $this = this
		}
    }
</script>

<style scoped lang="scss">
    #global-uploader {
        .uploader-app {
            // width: 520px;
        }
        .file-panel {
            background-color: #fff;
            border: 1px solid #e2e2e2;
            border-radius: 7px 7px 0 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, .2);
            .file-title {
                display: flex;
                height: 40px;
                line-height: 40px;
                padding: 0 15px;
                border-bottom: 1px solid #ddd;
                .operate {
                    flex: 1;
                    text-align: right;
                }
            }
            .file-list {
                position: relative;
                height: 240px;
                overflow-x: hidden;
                overflow-y: auto;
                background-color: #fff;
                > li {
                    background-color: #fff;
                }
            }
        }
        .no-file {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 16px;
        }
        .uploader-file-icon {
            &:before {
                content: '' !important;
            }
            &[icon=image] {
                background: url(./vue-simple-upload-images/image-icon.jpg);
            }
            &[icon=video] {
                background: url(./vue-simple-upload-images/video-icon.jpg);
            }
            &[icon=document] {
                background: url(./vue-simple-upload-images/text-icon.jpg);
            }
        }
        .uploader-file-actions > span {
            margin-right: 6px;
        }
    }
	.global-uploader-btn,.global-uploader-btn:hover{height: 32px;line-height: 32px;background-color: #66b1ff;color: #fff;padding: 0 15px;cursor: pointer;border: none;outline: none;border-radius: 5px;}
	.uploader-list{margin-top: 3px;}
	.file-list{height: auto !important;}
	.uploader-btn,.uploader-btn:hover{color: #fff;line-height: 32px;background-color: #66b1ff;height: 32px;border: none;padding: 0 15px;cursor: pointer;}
	.file-li{position: relative;}
	.fileListEditBox{width: 640px;background-color: #D9D9D9;margin-top: 3px;background-color: #e2eeff;box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);}
	.file-item{display: flex;padding: 5px;border: 1px solid #e2e2e2; border-width: 0 1px;}
	.file-item-div{}
	.file-lable{line-height: 20px;margin-bottom: 3px;font-size: 12px;font-weight: bold;}
	.file-value-input{height: 30px;border: 1px solid #ddd;width: 200px;margin-right: 10px;padding-left: 3px;outline: none;border-radius: 5px;}
	.file-value-input-last{padding: 0;margin-right: 0;}
	.file-list-title{width: 640px;height: 40px;line-height: 40px;font-size: 12px;font-weight: bold;padding-left:15px;background-color: #fff;border-radius: 7px 7px 0 0;border: 1px solid #e2e2e2;border-width: 1px 1px 0 1px;border-bottom: 1px solid #ddd;}
</style>
