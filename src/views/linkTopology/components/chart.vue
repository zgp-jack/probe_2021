<template>
<div style="height: 100%">
    <div id="TopologyChart" ref="TopologyChart"></div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li class="contextmenu-label">{{point.name}}</li>
        <li @click="handleClickFolder(point)" class="contextmenu-item">查看故障信息</li>
    </ul>
</div>
</template>
<script>
import axiosHttp from "@/js/axiosHttp.js";
import baseUrl from "@/js/baseUrl.js";
import CommonFun from "@/js/commonFun.js";
var elementResizeDetectorMaker = require('element-resize-detector');
export default {
    name: "TopologyChart",
    data() {
        return {
            option: {
                color: ['#E4DB65', '#49FFE7', '#00A8FF', '#FF2E2E', '#ccc'],
                legend: {
                    top: 'bottom',
                    left: 'right',
                    orient: 'horizontal',
                    width: 380,
                    itemGap: 20,
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: '#fff'
                    },
                    icon: 'circle',
                    data: ['探针', '路由器/交换机', '终端', '告警状态', '任务暂停']
                },
                tooltip: {
                    show: true,
                    backgroundColor: 'rgba(0, 0, 0,0.7)',

                },
                series: [{
                    type: 'graph',
                    layout: 'force',
                    animation: false,
                    // animationThreshold: 2000,
                    // coordinateSystem: 'cartesian2d',
                    label: {
                        position: 'right',
                        formatter: '{b}'
                    },
                    draggable: true, //draggable: true
                    // xAxisIndex: 0,
                    // yAxisIndex: 0,
                    symbolSize: 11,
                    // focusNodeAdjacency : true,
                    edgeSymbol : [ 'none', 'arrow' ],
                    edgeSymbolSize : 7,
                    data: [],
                    roam: true,
                    categories: [
                        {name: "探针"},
                        {name: "路由器/交换机"},
                        {name: "终端"},
                        {name: "告警状态"},
                        {name: "任务暂停"},
                    ],
                    force: {
                        initLayout: 'none',
                        repulsion: 10,
                        edgeLength: 25,
                        gravity: 0.05,
                        // layoutAnimation: false
                    },
                    lineStyle: {color: '#CCCCCC'},
                    edges: [],
                    tooltip: {
                        backgroundColor: '#00A8FF',
                        position: 'top',
                        formatter: '{b}',
                        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
                    }
                }]
            },
            device: {ip: ''},
            visible: false,
            left: 0,
            top: 0,
            point: {
                name: '',
                taskId: ''
            }
        };
    },
    mounted() {
        let that = this;
        //鼠标右键
        window.addEventListener('contextmenu', that.breakContentMenuEvent);
        window.addEventListener('click', that.hideContentMenu);
    },
    methods: {
        breakContentMenuEvent(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        hideContentMenu() {
            this.visible = false;
        },
        handleClickFolder(item) {
            axiosHttp.get(`${baseUrl.BASEURL}analyseTask/getAnalyseTask/${item.taskId}`).then(res => {
                const data = res.data;
                if(!!data.status) {
                    this.$store.commit('pushIncludeList', 'TopologyChart');
                    sessionStorage.currentAramItem = JSON.stringify(data.data);
                    this.toPage();
                }
                
            })
        },
        toPage() {
            let toPage = 'alarmDetailInfo';
            // let icon = 'iconfont icon-zhuanjia';
            // sessionStorage.setItem('defaultActive', toPage);
            // this.$store.dispatch('setDefaultActive', toPage);
            // sessionStorage.setItem('openlist',toPage)
            // this.$store.dispatch('setOpenList', [icon])
            setTimeout(() => this.$router.push({name: toPage}))
        },
        init(params, device) {
            let that = this;
            //设置deviceId
            if(device && !device.length) {
                //this.$message.error('请先选中一个探针IP');
                return;
            }
            that.device.ip = device[0].ip;
            let loading = CommonFun.openFullScreen(that);
            axiosHttp.post(`${baseUrl.BASEURL}analyseRoute/topography`, params).then(res => {
                CommonFun.closeFullScreen(loading);
                //nodes
                let nodes = [
                    //初始点-探针
                    {
                        name: that.device.ip, 
                        // category: 0,
                        label: {show: true},
                        itemStyle: { color: '#E4DB65', borderWidth: 6, borderColor: '#E4DB65', shadowColor: '#E4DB65', shadowBlur: 15}
                    }
                ];
                let links = [];
                let data = res.data;

                if(data.status === 1) {
                    let list = [], unList = [];
                    if(device[0].taskNumber > 200) {
                        for (const item of data.data) {
                            if(item.rountStatus) {
                                list.push(item);
                            } else {
                                unList.push(item);
                            }
                        }
                        if(list.length < 200) {
                            list.concat(unList.splice(0, 200 - list.length));
                        } else {
                            list = list.splice(0, 200);
                        }
                    } else {
                        list = data.data;
                    }
                    console.log(list, 'list');
                    for (let item of list) {
                        let routeList = item.routeInfo.split('-');

                        // if(item.targetIp != routeList[routeList.length - 1]) {
                        //     routeList.push(item.targetIp);
                        // }
                        
                        //星号处理
                        routeList = this.spliceStar(routeList, item.id, item.rountStatus, item.targetIp, item.name, item.delay);
                        routeList.forEach((routeItem, routeIndex) => {
                            if(routeIndex === routeList.length - 1) {
                                //叶子节点-
                                let nodeObj = {
                                    name: routeItem.name, 
                                    // category: item.rountStatus ? 3 : 2, //3
                                    itemStyle: {color: !item.taskStatus ? '#ccc' : item.rountStatus ? '#FF2E2E' : "#00A8FF"},
                                    label: {show: true}, 
                                    isLeaf: true, 
                                    routeList: {}, 
                                    dataId: item.id,
                                    taskId: item.taskId
                                };
                                //路径信息
                                nodeObj.routeList[item.id] = routeList.map(icon => {
                                    let json = {name: icon.name, status: item.rountStatus, taskStatus: item.taskStatus};
                                    return json;
                                });
                                //告警状态
                                nodes.push(nodeObj);
                            } else if(nodes.findIndex(nodeItem => routeItem.name === nodeItem.name) < 0) {
                                //过渡节点category: 1,
                                // label: {show: true},
                                nodes.push({name: routeItem.name, dataId: item.id, itemStyle: {color: '#49FFE7'}});
                            }

                            //与探针关联
                            if(routeIndex === 0) {
                                let source1 = that.device.ip;
                                let target1 = routeList[0].name;

                                let interrupt = routeIndex === routeList.length - 1 && routeList[0].interrupt;

                                let deviceIndex = links.findIndex(deviceItem => {
                                    return (deviceItem.source === source1 && deviceItem.target === target1);
                                })
                                if(deviceIndex < 0) {
                                    links.push({source: source1, target: target1, dataId: item.id, lineStyle: {type: interrupt ? 'dashed': 'solid', color: '#0AB3AC'}});
                                }
                            }

                            //添加关系
                            if(routeIndex < routeList.length - 1) {
                                let source = routeItem.name;
                                let target = routeList[routeIndex + 1].name;

                                let interrupt = routeItem.interrupt && routeList[routeIndex + 1].interrupt;
                                // if(target === '*' && routeIndex != routeList.length - 1) {
                                //     target = '*' + item.id;
                                // }
                                let linkIndex = links.findIndex(linkItem => {
                                    return (linkItem.source === source && linkItem.target === target);
                                })
                                if(linkIndex < 0) {
                                    links.push({source: source, target: target, dataId: item.id, lineStyle: {type: interrupt ? 'dashed': 'solid', color: '#0AB3AC'}});
                                }
                            }
                        })
                    }
                    //关系去重，防止绘制多条
                    for(var i = 0; i < nodes.length; i++){
                        for(var j = i + 1; j < nodes.length; j++){
                            if(nodes[i].name == nodes[j].name) {
                                if(nodes[j].isLeaf) {
                                    //保留叶子节点标识
                                    //nodes[i].category = nodes[j].category; //3
                                    
                                    nodes[i].itemStyle = (nodes[i].isLeaf) ? nodes[i].itemStyle : nodes[j].itemStyle;
                                    //
                                    if(!nodes[i].routeList) {
                                        nodes[i].routeList = {};
                                    }
                                    nodes[i].routeList[nodes[j].dataId] = nodes[j].routeList[nodes[j].dataId];
                                    nodes[i].isLeaf = true;
                                    nodes[i].label = {show: true};
                                }
                                nodes.splice(j, 1);
                                j--;
                            }
                        }
                    }
                    //节点小于50则关闭动画
                    if(nodes.length < 50) {
                        // that.option.series[0].force.layoutAnimation = false;
                    }
                    console.log(nodes, 'nodes');
                    console.log(links, 'links');
                    that.option.series[0].data = nodes;
                    that.option.series[0].edges = links;

                    that.drawMap();
                } else {
                    CommonFun.responseError(res.data, that);
                }
            }).catch(function(err) {
                CommonFun.closeFullScreen(loading);
            });
        },
        spliceStar(list, key, status, targetIp, aliasName, delay) {
            let arr = [];
            for(var i = 1; i < list.length - 2; i++){
                if(list[i] == '*' && list[i + 1] == '*') {
                    list.splice(i, 1);
                }
            }
            list[list.length - 2] === '*' && list.splice(list.length - 2, 1);
            
            //先遍历一遍修改中间*
            list.forEach((item, index) => {
                if(item === '*') {
                    switch(index) {
                        case 0: break;
                        case list.length - 1: break;
                        default: item = `*[${list[index+1]}]`; break;
                    }
                }
                let json ={name: item, status: status};
                if(index === list.length - 1) {
                    if(item !== targetIp) {
                        json['interrupt'] = true;
                        // json.name += `\n-Kbps`
                    } else {
                        json['name'] = `${aliasName || item}(${delay || '-'}ms)`;
                    }
                } else {
                    // json.name += `\n-Kbps`
                }
                //json['aliasName'] = aliasName;
                arr.push(json);
                if(index === list.length - 1 && item !== targetIp) {
                    let jsonCopy = JSON.parse(JSON.stringify(json))
                    jsonCopy['name'] = `${aliasName || targetIp}(${delay || '-'}ms)`;
                    arr.push(jsonCopy);
                }
            })
            return arr;
        },
        reDrawMap(barSimple) {
            let option = barSimple.getOption();
            if(!!option) {
                let edge = option.series[0].edges.filter(item => item.highlight === true);
                let newEdge = this.option.series[0].edges;
                for (const item of edge) {
                    for (let i = 0; i < newEdge.length; i++) {
                        if(newEdge[i].source === item.source && newEdge[i].target.split('(')[0] === item.target.split('(')[0]) {
                            newEdge[i].highlight = item.highlight;
                            newEdge[i].lineStyle = item.lineStyle;
                            break;
                        }
                    }
                }
            }
        },
        drawMap() {
            let that = this;
            let barSimple = that.$echarts.init(document.getElementById('TopologyChart'));
            this.reDrawMap(barSimple);
            barSimple.setOption(that.option);
            barSimple.off('click');
            barSimple.on('click', params => {
                if(params.dataType === 'node' && params.data.isLeaf) {
                    console.log('选中叶子', params.name);
                    that.$emit('getCheckedRoute', params.data.routeList);
                    //递归整条路径
                    this.findOne(params.data.routeList, params.data.dataId, true);
                    barSimple.setOption(that.option);
                }
            });
            barSimple.off('contextmenu');
            //右键跳转任务
            barSimple.on('contextmenu', param => {
                console.log(param, 'contextmenu');
                if(param.data.isLeaf && param.data.itemStyle.color === '#FF2E2E') {
                    this.left = param.event.offsetX + 20;
                    this.top = param.event.offsetY + 50;
                    this.visible = true;
                    this.point.name = param.name;
                    this.point.taskId = param.data.taskId;
                }
            })
            //节点拖拽固定
            // barSimple.on('mouseup', function (params) {
            //     var option = myChart.getOption();
            //     option.series[0].data[params.dataIndex].x = params.event.offsetX;
            //     option.series[0].data[params.dataIndex].y = params.event.offsetY;
            //     option.series[0].data[params.dataIndex].fixed = true;
            //     barSimple.setOption(option);
            // });
        },
        resetSize() {
            //使echarts尺寸重置
            this.$echarts.init(document.getElementById('TopologyChart')).resize(); 
            console.log('resize');
        },
        //开关节点label名称
        showNodeLable(boo) {

            let barSimple = this.$echarts.init(document.getElementById('TopologyChart'));
            let option = barSimple.getOption();

            option.series[0].data.map(item => {
                if(!!item.label && item.isLeaf) {
                    item.label = {show: !item.label.show};
                }
                return item;
            })
            barSimple.setOption(option);
        },
        //高亮选中
        findOne(obj, id, isInit) {
            let that = this;
            let lineStyle = {color: '#49FFE7', width: 2, shadowColor: '#ccc', shadowBlur: 5, opacity: 1, shadowOffsetX: 1, shadowOffsetY: 2};
            if(isInit) {
                //初始化
                this.option.series[0].edges.map(item => {
                    if(item.lineStyle.type === 'dashed') {
                        item['lineStyle'] = {type: 'dashed', color: '#0AB3AC'};
                    } else {
                        item['lineStyle'] = {type: 'solid', color: '#0AB3AC'};
                    }
                    item['highlight'] = false;
                    return item;
                })
            }
            // this.option.series[0].data.map(item => {
            //     for(let i = 0; i < list.length - 2; i++) {
            //         if(item.name === list[i]) {
            //             item['oldStyle'] = JSON.stringify(item['itemStyle']);
            //             item['itemStyle'] = {color: '#95E05E'};
            //             item['label'] = {show: true};
            //             break;
            //         } else {
            //             item['itemStyle'] = item.oldStyle ? JSON.parse(item.oldStyle) : item.itemStyle;
            //             item['label'] = {show: false};
            //         }
            //     }
            //     return item;
            // })
            for (const key in obj) {
                //跳过告警状态
                if (Object.hasOwnProperty.call(obj, key)) {
                    let list = obj[key];
                    for(let i = -1; i < list.length - 1; i++) {
                        //链接探针
                        let [source, target] = [0, 0];
                        if(i == -1) {
                            source = that.device.ip;
                            target = list[0].name;
                        } else {
                            source = list[i].name;
                            target = list[i + 1].name;
                        }
                        for (let edge of this.option.series[0].edges) {
                            let lineStyle1 = JSON.parse(JSON.stringify(lineStyle));
                            if(edge.source === source && edge.target === target) {
                                lineStyle1['type'] = edge.lineStyle.type;
                                edge['lineStyle'] = lineStyle1;
                                edge['highlight'] = true;
                                break;
                            }
                        }
                    };
                }
            }
            
            console.log(this.option.series[0].edges);
        },
    },
    beforeDestroy() {
        let that = this;
        window.removeEventListener('contextmenu', that.breakContentMenuEvent);
        window.removeEventListener('click', that.hideContentMenu);
    }
};
</script>
<style lang="scss" scoped>
#TopologyChart{
    width: 100%;
    height: calc(100% - 40px);
}
.contextmenu {
    margin: 0;
    background-color: #002322;
    border: 1px solid #00E1D9;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 400;
    color: #fff;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li.contextmenu-label {
    font-weight: bold;
    color: #f3f3f3;
}
.contextmenu li.contextmenu-item:hover {
    background: #00A59F;
}
</style>