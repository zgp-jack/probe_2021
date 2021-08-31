<template>
    <div class="map-content">
        <div id="charts" ref="charts"></div>
        <canvas id="icon-layer" width="700" height="600"></canvas>
        <!-- v-drag="{width: 850, height: 540}" -->
        <div class="fault-total">
            <p class="fault-title">故障总个数</p>
            <p class="fault-size"><span>{{total}}</span>个</p>
        </div>
        <el-button v-if="showCity" class="btn-revert" size="mini" type="text" @click="revertMap">
            <i class="btn-return-icon"></i>
            返回上一级
        </el-button>
        <div class="fault-list">
            <p class="fault-1">故障个数>50</p>
            <p class="fault-2">故障个数≤50</p>
            <p class="fault-3">故障个数≤10</p>
        </div>
    </div>
</template>
<script>

    const imgPrimary = require('assets/fault-primary.png')
    const imgAlarm = require('assets/fault-alarm.png')
    const imgDanger = require('assets/fault-danger.png')
    // 散点在地图上的坐标
    const geoCoordMap = require('@/js/json/geo-coord-map-sc.json');
    // 后端默认查询数据使用的省参数值
    const mapSheng = '四川省';
    // echart地图配置省
    const mapShengName = '四川';
    const isAdminCity = false;
    // 区县geo数据
    import JsonMap from '@/js/geo-setting-sc.js';
    // 市geo数据
    import 'echarts/map/js/province/sichuan.js';

    import baseUrl from '@/js/baseUrl.js';
	import axiosHttp from '@/js/axiosHttp.js';
    export default {
        name: 'mapCharts',
        data() {
            return {
                total: 0,
                //echarts配置
                optionMap: {
                    backgroundColor: 'transparent',
                    title: {
                        show: false,
                        text: '地图',
                        subtext: '',
                        x:'center',
                        textStyle: {
                            color: '#fff',
                            fontSize: 24
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: '{b0}'
                    },
                    geo: {
                        map: mapShengName,
                        top: 68,
                        left: 78,
                        right: 62,
                        bottom: 32,
                        show: !isAdminCity,
                        // layoutCenter: ['50%', '50%'],
                        // layoutSize: '100%',
                        roam: false,
                        aspectScale: 1.2,
                        zoom: 1.1,
                        label: {
                            normal: { //静态的时候展示样式
                                show: false, //是否显示地图省份得名称
                            },
                            emphasis: { //动态展示的样式
                                color:'#fff',
                                textShadowColor: '#333',
                                textShadowBlur: 15,
                                fontWeight: 'bold',
                                fontSize: 14,
                                offset: [0, 300]
                            }
                        },
                        itemStyle: {
                            normal: {
                                areaColor: '#348886',
                                borderWidth: 0,
                                label: {show: false},
                                shadowColor: '#333',
                                shadowBlur: 10,
                            },
                            emphasis: {
                                areaColor: '#348886',
                            }
                        },
                        silent: true
                    },
                    //配置属性
                    series: [{
                        top: 60,
                        left: 70,
                        right: 70,
                        bottom: 40,
                        // layoutCenter: ['50%', '50%'],
                        // layoutSize: '100%',
                        type: 'map',
                        map: mapShengName,
                        label: {
                            show: !isAdminCity,
                            color: '#CCCCCC',
                            fontSize: 10
                        },
                        aspectScale: 1.2,
                        zoom: 1.1,
                        roam: isAdminCity,
                        itemStyle: {
                            normal: {
                                areaColor: '#00585C',
                                borderColor: '#0f8f8a',
                                borderWidth: 1
                            },
                            emphasis: {
                                opacity: .3,
                                label: {
                                    show: false,
                                    color: '#fff'
                                }
                            },
                        },
                    }]
                    // },{
                    //     name: '告警数',
                    //     type: 'custom',
                    //     coordinateSystem: 'geo',
                    //     renderItem: function (params, api) {
                    //         return  {
                    //             type: 'image',
                    //             style: {
                    //                 image: require('../../../assets/alarm.png'),
                    //                 x: api.coord([api.value(0), api.value(1)])[0] - 24,
                    //                 y: api.coord([api.value(0), api.value(1)])[1] - 24,
                    //                 width: 32,
                    //                 height: 32
                    //             }
                    //         };
                    //     },
                    //     data: []
                    // }]
                },
                showCity: false,

                falutData: [],
                iconPositionList: [],
                timer: null,
                searchParam: {name: mapSheng, level: 1}
            }
        },
        components: {

        },
        created() {
            if(!isAdminCity && !!JsonMap) {
                for (let key in JsonMap.cityList) {
                    //注册离线地图
                    this.$echarts.registerMap(key, JsonMap.cityList[key])
                }
            }
        },
        mounted() {
            // this.init();
        },
        methods: {
            init(data) {
                this.setEchartsMap(data);
            },
            toPage(params) {
                let toPage = 'analyseDelayDegradation';
                // this.$store.commit('pushIncludeList', 'analyseDialTest');
                sessionStorage.setItem('defaultActive', toPage);
                this.$store.dispatch('setDefaultActive', toPage);
                sessionStorage.setItem('openlist', JSON.stringify(['iconfont icon-zhuanjia']))
                this.$store.dispatch('setOpenList', ['iconfont icon-zhuanjia'])
                setTimeout(() => this.$router.push({name: toPage, params: params}))
            },
            getMapFalutTypeCout(param) {
                let mapName = param.name === mapSheng ? param.name.split('省')[0].split('市')[0] : param.name;

                this.optionMap.series[0].map = mapName;
                this.optionMap.geo.map = mapName;
                return axiosHttp.get(`${baseUrl.BASEURL}home/mapFalutTypeCout?level=${param.level}&name=${param.name}`)
                // .then((res) => {
                //     const data = res.data;
                //     this.total = 0;
                //     if(data.status && !!data.data) {
                //         const arr = data.data.barrioList;
                //         this.setEchartsMap(arr);
                //     }
                // })
            },
            async getMapFalutTypeCoutData(param) {
                let data = [];
                // this.$emit('setParam', param);
                try{
                    const res = await this.getMapFalutTypeCout(param);
                    const dataRes = res.data;
                    this.total = 0;
                    if(dataRes.status && !!dataRes.data) {
                        data = dataRes.data.barrioList;
                    }
                }catch(err) {
                    console.error(err);
                }
                this.setEchartsMap(data, true);
            },
            setEchartsMap(data, resetNot) {
                let that = this;
                that.total = 0;
                //重置
                if(!resetNot) {
                    this.searchParam.level = 1;
                    this.searchParam.name = mapShengName;
                    this.optionMap.series[0].map = mapShengName;
                    this.optionMap.geo.map = mapShengName;
                    this.showCity = false;
                }
                //如果有定时器
                console.log(this.timer);
                if(this.timer) {
                    clearInterval(this.timer);
                }
                // 将坐标与值对应并反映在地图上
                const convertData = (data) => {
                    let res = [];
                    for (let i = 0; i < data.length; i++) {
                        if(data[i].num) {
                            let geoCoord = geoCoordMap[data[i].barrio];
                            if (geoCoord) {
                                res.push({
                                    name: data[i].barrio,
                                    position: geoCoord,
                                    value: data[i].num
                                });
                                that.total += data[i].num;
                            }
                        }
                    }
                    return res;
                };
                this.falutData = convertData(data);
                this.$nextTick(() => {
                    //初始化echarts实例
                    let myChart = this.$echarts.init(document.getElementById('charts'));
                    
                    //使用制定的配置项和数据显示图表
                    myChart.setOption(this.optionMap);
                    myChart.off('click');
                    myChart.on('click', data => {
                        console.log(data);
                        for (const item of that.iconPositionList) {
                            if(item[0] + 20 > data.event.offsetX && item[0] - 20 < data.event.offsetX) {
                                if(item[1] + 14 > data.event.offsetY && item[1] - 40 < data.event.offsetY) {
                                    console.log('in');
                                    that.toPage({status: '0'});
                                    return;
                                }
                            }
                        }
                        //清空点
                        // iconCtx.clearRect(0, 0, iconLayer.width, iconLayer.height)
                        if(data.componentType === 'series' && this.searchParam.level < 2 && !isAdminCity) {
                            //TODO
                            const name = data.name;
                            that.showCity = true;
                            that.optionMap.geo.map = name;
                            that.optionMap.series[0].map = name;
                            this.searchParam.name = data.name;
                            this.searchParam.level = 2;
                            this.getMapFalutTypeCoutData(this.searchParam);
                            // myChart.setOption(that.optionMap);
                        }
                    })
                    // myChart.off('georoam');
                    // myChart.on('georoam', params => {
                    //     var option = myChart.getOption();
                    //     if(params.zoom!=null&&params.zoom!=undefined) {
                    //         option.geo[1].zoom=option.geo[0].zoom;
                    //         option.geo[1].center=option.geo[0].center;
                    //     }else{//捕捉到拖曳时
                    //         option.geo[1].center=option.geo[0].center;
                    //     }
                    //     console.log(option);
                    //     myChart.setOption(option);//设置option
                    // });
                    this.drawPoint(myChart);
                })
            },
            //画点
            drawPoint(myChart) {
                let that = this;
                
                let iconAdd, iconHeight;
                let iconChange = {
                    abeam: 20,
                    portrait: 9,
                    height: 26
                }
                let iconLayer = document.getElementById("icon-layer")
                let iconCtx = iconLayer.getContext("2d");
                //obj：点数据
                function iconDraw(obj) {

                    let img = new Image();

                    iconCtx.beginPath();
                    let iconPosition = myChart.convertToPixel('geo', obj.position)
                    let styleColor
                    that.iconPositionList.push(iconPosition);
                    if(obj.value > 50) {
                        img.src = imgDanger;
                        styleColor = { r: 251, g: 50, b: 1 }
                    } else if (obj.value > 9 && obj.value < 51) {
                        img.src = imgAlarm;
                        styleColor = { r: 255, g: 125, b: 38 }
                    } else {
                        img.src = imgPrimary;
                        styleColor = { r: 0, g: 169, b: 244 }
                    }
                    //设置阴影光效
                    iconCtx.shadowOffsetX = 0;
                    iconCtx.shadowOffsetY = 0;
                    iconCtx.shadowBlur = 15;
                    
                    iconCtx.shadowColor = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ', 1)';

                    iconCtx.strokeStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ', .2)';
                    // BezierEllipse1(iconCtx, iconPosition[0], iconPosition[1] + 12, 6, 2);
                    BezierEllipse1(iconCtx, iconPosition[0], iconPosition[1], 12, 4);
                    iconCtx.fillStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ', .4)';
                    iconCtx.fill();
                    iconCtx.closePath();

                    iconCtx.beginPath();
                    iconCtx.setLineDash([5, 2]);
                    iconCtx.strokeStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ', 1)';
                    iconCtx.fillStyle = 'rgba(' + styleColor.r + ',' + styleColor.g + ',' + styleColor.b + ', .8)';
                    iconCtx.textAlign = 'center';
                    iconCtx.font = "bold 14px 微软雅黑";
                    iconCtx.fillText(obj.value, iconPosition[0], iconPosition[1] + 20);

                    // BezierEllipse1(iconCtx, iconPosition[0], iconPosition[1] + 12, iconChange.abeam, iconChange.portrait);
                    BezierEllipse1(iconCtx, iconPosition[0], iconPosition[1], iconChange.abeam, iconChange.portrait);

                    // iconCtx.drawImage(img, iconPosition[0] - 21, iconPosition[1] - iconChange.height, 40, 40);
                    iconCtx.drawImage(img, iconPosition[0] - 5, iconPosition[1] - iconChange.height - 14, 10, 42);

                    iconCtx.closePath();
                }
                function BezierEllipse1(context, x, y, a, b) {
                    //关键是bezierCurveTo中两个控制点的设置
                    //0.5和0.6是两个关键系数（在本函数中为试验而得）
                    let ox = 0.5 * a,
                        oy = 0.6 * b;
                    context.save();
                    context.translate(x, y);
                    context.beginPath();
                    //从椭圆纵轴下端开始逆时针方向绘制
                    context.moveTo(0, b);
                    context.bezierCurveTo(ox, b, a, oy, a, 0);
                    context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
                    context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
                    context.bezierCurveTo(-a, oy, -ox, b, 0, b);
                    context.closePath();
                    context.stroke();
                    context.restore();
                };
                function iconMove() {
                    if (Math.floor(iconChange.abeam) == 16) {
                        iconAdd = +0.1
                    } else if (Math.floor(iconChange.abeam) == 20) {
                        iconAdd = -0.1
                    }
                    if (Math.floor(iconChange.height) == 26) {
                        iconHeight = +0.1
                    } else if (Math.floor(iconChange.height) == 30) {
                        iconHeight = -0.1
                    }
                    iconChange.abeam = iconChange.abeam + iconAdd
                    iconChange.portrait = iconChange.portrait + iconAdd
                    iconChange.height = iconChange.height + iconHeight
                }
                function iconAnimation() {
                    iconMove(); //更新
                    that.iconPositionList = [];
                    iconCtx.clearRect(0, 0, iconLayer.width, iconLayer.height); //清除
                    for (const item of that.falutData) {
                        iconDraw(item);
                    }
                    
                }
                that.timer = setInterval(() => {
                    iconAnimation()
                }, 20);
            },
            revertMap() {
                this.optionMap.geo.map = mapShengName;
                this.optionMap.series[0].map = mapShengName;
                this.showCity = false;
                this.searchParam.name = mapSheng;
                this.searchParam.level = 1;
                this.getMapFalutTypeCoutData(this.searchParam);
            },
            resize() {
                this.$echarts.init(document.getElementById('charts')).resize();
            }
        }
    }
</script>
<style lang="scss" scoped>
#icon-layer{
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
}
#charts{
    width: 100%;
    height: 100%;
}
.map-content{
    width:100%;
    height: 100%;
    position: relative;
    .fault-total::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        opacity: .3;
        z-index: 998;
    }
    .fault-total{
        position: absolute;
        right: 20px;
        top: 140px;
        z-index: 12;
        width: auto;
        height: auto;
        min-width: 172px;
        min-height: 92px;
        background-image: url(../../../assets/faultTotal.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #fff;
        text-align: center;
        padding: 5px 10px;
        line-height: 36px;
        box-sizing: border-box;
        letter-spacing: 2px;
        pointer-events: none;
        .fault-title{
            font-size: 16px;
            position: relative;
            z-index: 999;
        }
        .fault-title::before{
            content: '';
            background-image: url(../../../assets/static-title-bg.png);
            background-repeat: no-repeat;
            background-size: 20px 12px;
            background-position-y: 2px;
            width: 20px;
            height: 12px;
            display: inline-block;
            margin-right: 10px;
        }
        .fault-size{
            font-size: 16px;
            position: relative;
            z-index: 999;
            span{
                color: #16E6C9;
                font-size: 38px;
            }
        }
    }
    .fault-list{
        position: absolute;
        right: 10px;
        bottom: -10px;
        z-index: 12;
        width: 160px;
        height: 108px;
        line-height: 30px;
        letter-spacing: 2px;
        .fault-1::before{
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 15px;
            background: #FB3205;
            box-shadow: 0 0 5px 1px #FB3205;
        }
        .fault-2::before{
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 15px;
            background: #FF7D26;
            box-shadow: 0 0 5px 1px #FF7D26;
        }
        .fault-3::before{
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin: 0 15px;
            background: #00A9F4;
            box-shadow: 0 0 5px 1px #00A9F4;
        }
        p{
            color: #fff;
            font-size: 14px;
        }
    }
    .btn-revert{
        position: absolute;
        left: 20px;
        top: 140px;
        z-index: 12;
        color: #16E6C9;
    }
}

</style>
