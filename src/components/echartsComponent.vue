<template>
<!-- 搜索 开始 -->
	<div class="outbox">
		<div class="echartsBox" style="width: 910px;height: 400px;" v-if="echartIndex == '1'" id="inspectionStatistics1"></div>
		<div class="echartsBox" style="width: 910px;height: 400px;" v-if="echartIndex == '2'" id="inspectionStatistics2"></div>
		<div class="echartsBox" style="width: 910px;height: 400px;" v-if="echartIndex == '3'" id="inspectionStatistics3"></div>
	</div>
<!--搜索 结束  -->
</template>

<script>
	import CommonFun from  '../js/commonFun.js'
export default {
  name: 'Echarts',
  data () {
    return {
		inspectionStatisticsChart1:null,
		inspectionStatisticsChart2:null,
		inspectionStatisticsChart3:null,
		dataOfMultiple:[],
		color:['#73ACFF', '#FDD56A', '#FDB36A', '#FD866A'],
		currentListData:this.listData,
		currentDataListOfTitle:this.dataListOfTitle,
		currentDataListOfData:this.dataListOfData,
		currentDataListOfMultiple:this.dataListOfMultiple
    }
  },
  props: ['echartIndex','listData','dataListOfTitle','dataListOfData','dataListOfMultiple'],
  methods: {
    // 单选图表
    initCharts1() {
		let $this = this
        $this.inspectionStatisticsChart1 = $this.$echarts.init(document.getElementById('inspectionStatistics1'), 'customed');
        let option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:['#73ACFF', '#FDD56A', '#FDB36A', '#FD866A'],
            legend: {
                orient: 'vertical',
                show:false,
                formatter:function(name){
                    var oa = option.series[0].data;
                    var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;
                    for(var i = 0; i < option.series[0].data.length; i++){
                        if(name==oa[i].name){
                            return name + '     ' + oa[i].value + '     ' + (oa[i].value/num * 100).toFixed(2) + '%';
                        }
                    }
                }
            },
            series : [
                {
                    name: '选择人数',
                    type: 'pie',
                    radius : '60%',
                    center: ['50%', '50%'],
                    data:this.currentListData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    itemStyle: {
                        normal: {
                            label:{
                                show: true,
    //	                            position:'inside',
                                formatter: '{b} : {c} ({d}%)'
                            }
                        },
                        labelLine :{show:true}
                    }
                }
            ]
        };
        $this.inspectionStatisticsChart1.setOption(option)
		$this.inspectionStatisticsChart1.resize()
		console.log('刷新：')
		console.log(option.series[0].data)
    },
	initCharts2() {
		let $this = this
	    $this.inspectionStatisticsChart2 = $this.$echarts.init(document.getElementById('inspectionStatistics2'), 'customed');
	    let option = {
			backgroundColor: '#fff',
			color: ['#73ACFF'],
			barWidth: 14,
			title: {
				// text: '世界人口总量',
				// subtext: '数据来自网络'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				// left: '0%',
				top: '10',
				x:'right', //可设定图例在左、右、居中
				icon: 'circle',
				textStyle: { //图例文字的样式
					color: '#8C8C8C',
					fontSize: 12
				},
				show:false,
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				splitLine: {
					show: false // 去除网格线
				},
				axisLine: {
					lineStyle: {
						type: 'solid',
						color: '#BFBFBF', // 坐标线的颜色
						width: '1'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#595959' //坐标值的颜色
					},
					formatter: function (params) {
						var newParamsName = ''
						var paramsNameNumber = params.length //总字数
						var provideNumber = 5 //一行显示几个字
						var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
						if (paramsNameNumber > provideNumber) {
							for (var p = 0; p < rowNumber; p++) {
								var tempStr = ''
								var start = p * provideNumber
								var end = start + provideNumber
								if (p == rowNumber - 1) {
									tempStr = params.substring(start, paramsNameNumber)
								} else {
									tempStr = params.substring(start, end) + '\n'
								}
								newParamsName += tempStr
							}
						} else {
							newParamsName = params
						}
						return newParamsName
					}
				},
				boundaryGap: [0, 0.01],
				data: this.currentDataListOfTitle
			},
			yAxis: {
			
				type: 'value',
				splitLine: {
					// show: false // 去除网格线
					lineStyle:{
						color: '#E8E8E8',
						type: 'solid' //设置间隔线为虚线
					}
				},
				axisTick: {
					show: false //小横线
				},
				splitArea: {
					// show: true // 保留网格区域
				},
				axisLine: {
					show: false, // 去除纵向边框线
					lineStyle: {
						type: 'solid',
						color: '#BFBFBF', // 坐标线的颜色
						width: '1'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#595959' //坐标值的颜色
					}
				}
			},
			series: [
				{
					name: '选择人数',
					type: 'bar',
					label: {
						show: false,
						position: 'right', // 位置
						color: '#298DFF',
						fontSize: 12,
						fontWeight: 'normal', // 加粗
						distance: 5, // 距离
						offset: [0, 1] // 偏移距离[横向，纵向]
					}, // 柱子上方的数值
					data: this.currentDataListOfData
				},
			]
	    }
		$this.inspectionStatisticsChart2.setOption(option)
		$this.inspectionStatisticsChart2.resize()
	},
	initCharts3() {
		let $this = this
	    $this.inspectionStatisticsChart3 = $this.$echarts.init(document.getElementById('inspectionStatistics3'), 'customed');
	    let option = {
			backgroundColor: '#fff',
			color: ['#73ACFF', '#FDD56A', '#FDB36A', '#FD866A'],
			barWidth: 14,
			title: {
				// text: '世界人口总量',
				// subtext: '数据来自网络'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				top: '10',
				right: 30,
				itemWidth: 10,
				itemHeight: 10,
				itemGap: 20,
				textStyle: { //图例文字的样式
					color: '#8C8C8C',
					fontSize: 12,
					padding:0,
				},
				show:false,
				data: ['打分项1', '打分项2']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				splitLine: {
					show: false // 去除网格线
				},
				axisLine: {
					lineStyle: {
						type: 'solid',
						color: '#BFBFBF', // 坐标线的颜色
						width: '1'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#595959' //坐标值的颜色
					},
					formatter: function (params) {
						var newParamsName = ''
						var paramsNameNumber = params.length //总字数
						var provideNumber = 5 //一行显示几个字
						var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
						if (paramsNameNumber > provideNumber) {
							for (var p = 0; p < rowNumber; p++) {
								var tempStr = ''
								var start = p * provideNumber
								var end = start + provideNumber
								if (p == rowNumber - 1) {
									tempStr = params.substring(start, paramsNameNumber)
								} else {
									tempStr = params.substring(start, end) + '\n'
								}
								newParamsName += tempStr
							}
						} else {
							newParamsName = params
						}
						return newParamsName
					}
				},
				boundaryGap: [0, 0.01],
				data: ['1分', '2分', '3分', '4分', '5分','6分', '7分', '8分', '9分', '10分']
			},
			yAxis: {
				type: 'value',
				splitLine: {
					// show: false // 去除网格线
					lineStyle:{
						color: '#E8E8E8',
						type: 'solid' //设置间隔线为虚线
					}
				},
				axisTick: {
					show: false //小横线
				},
				splitArea: {
					// show: true // 保留网格区域
				},
				axisLine: {
					show: false, // 去除纵向边框线
					lineStyle: {
						type: 'solid',
						color: '#BFBFBF', // 坐标线的颜色
						width: '1'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#595959' //坐标值的颜色
					}
				}
			},
			series:this.dataOfMultiple,
		}
	    $this.inspectionStatisticsChart3.setOption(option)
		$this.inspectionStatisticsChart3.resize()
	},
  },
   watch: {
      listData: {
        handler(newValue, oldValue) {
			console.log('newValue')
			console.log(newValue)
			this.currentListData = newValue
			this.initCharts1()
        },
        deep: true
      },
	  dataListOfTitle: {
        handler(newValue, oldValue) {
			console.log('newValue')
			console.log(newValue)
			this.currentDataListOfTitle = newValue
			this.initCharts2()
        },
        deep: true
      },
	  dataListOfData: {
        handler(newValue, oldValue) {
			console.log('newValue')
			console.log(newValue)
			this.currentDataListOfData = newValue
			this.initCharts2()
        },
        deep: true
      },
	  dataListOfMultiple: {
        handler(newValue, oldValue) {
			console.log('newValue')
			console.log(newValue)
			this.currentDataListOfMultiple = newValue
			$this.dataOfMultiple = []
			if(!CommonFun.ifNall($this.currentDataListOfMultiple)){
					  console.log('dataOfMultiple:')
					  console.log($this.dataOfMultiple)
					  for(let i=0;i<$this.currentDataListOfMultiple.length;i++){
						  let item = $this.currentDataListOfMultiple[i]
							let obj = {
								name: item.name,
								type: 'bar',
								label: {
									show: false,
									position: 'right', // 位置
									color: $this.color[i],
									fontSize: 12,
									fontWeight: 'normal', // 加粗
									distance: 5, // 距离
									offset: [0, 2] // 偏移距离[横向，纵向]
								}, // 柱子右方的数值
								data: item.data
							}
							$this.dataOfMultiple.push(obj)
					  }
			}
			this.initCharts3()
        },
        deep: true
      },
    },
  created(){
	  let $this = this
	  $this.dataOfMultiple = []
	  if(!CommonFun.ifNall($this.currentDataListOfMultiple)){
		  console.log('dataOfMultiple:')
		  console.log($this.dataOfMultiple)
		  for(let i=0;i<$this.currentDataListOfMultiple.length;i++){
			  let item = $this.currentDataListOfMultiple[i]
				let obj = {
					name: item.name,
					type: 'bar',
					label: {
						show: false,
						position: 'right', // 位置
						color: $this.color[i],
						fontSize: 12,
						fontWeight: 'normal', // 加粗
						distance: 5, // 距离
						offset: [0, 2] // 偏移距离[横向，纵向]
					}, // 柱子右方的数值
					data: item.data
				}
				$this.dataOfMultiple.push(obj)
		  }
	  }
  },
  mounted(){
	  console.log('listData')
	  console.log(this.listData)
	  switch(this.echartIndex){
		  case '1':
			  this.initCharts1()
			  break;
		  case '2':
			  this.initCharts2()
			  break;
		  case '3':
			  this.initCharts3()
			  break;
	  }
	  
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.echartsBox{width:910px;height:400px;}</style>
