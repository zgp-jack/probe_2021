<template>
    <div class="map-content">
        <div id="olMap" ref="olMap"></div>
        <!-- v-drag="{width: 850, height: 540}" -->
        <!-- <div class="fault-total">
            <p class="fault-title">故障总个数</p>
            <p class="fault-size"><span>{{total}}</span>个</p>
        </div>
        <div class="fault-list">
            <p class="fault-1">故障个数>50</p>
            <p class="fault-2">故障个数≤50</p>
            <p class="fault-3">故障个数≤10</p>
        </div> -->
    </div>
</template>
<script>
    const imgDanger = require('assets/fault-danger.svg')

    import "ol/ol.css";
    import { Map, View, Feature } from "ol";
    import { transform, fromLonLat } from 'ol/proj';

    import VectorSource from 'ol/source/Vector';
    import VectorLayer from 'ol/layer/Vector';
    import LabelStyle from 'ol/style/Style';
    import IconStyle from 'ol/style/Icon';
    import TextStyle from 'ol/style/Text';

    import StyleFill from 'ol/style/Fill';
    import StyleStroke from 'ol/style/Stroke';
 
    import GeomPoint from 'ol/geom/Point'

    import olMapConfig from '@/js/olMapConfig';
    // 散点在地图上的坐标
    const geoCoordMap = require('@/js/json/geo-coord-map-sc.json');
    const mapShi = '成都市';

    import baseUrl from '@/js/baseUrl.js';
	import axiosHttp from '@/js/axiosHttp.js';
    import CommonFun from '@/js/commonFun';

    export default {
        name: 'openLayerMap',
        data() {
            return {
                total: 100,
                falutData: {},
                searchParam: {name: mapShi, level: 2},
                vectorLayer: null
            }
        },
        components: {

        },
        created() {
            
        },
        mounted() {
            this.initMap();
            this.mapPollutionImage = this.initSvgImage();
        },
        methods: {
            init() {
                this.setVectorLayer(this.searchParam);
            },
            initMap() {
                let olMap = this.$refs.olMap;

                this.map = new Map({
                    target: olMap,
                    layers: [
                        olMapConfig.streetmap()
                    ],
                    view: new View({
                        projection: "EPSG:4326",    //使用这个坐标系
                        center: [olMapConfig.x, olMapConfig.y],  //成都
                        zoom: olMapConfig.zoom,
                        minZoom: 10,
                        maxZoom: 15
                    }),
                    pixelRatio: window.devicePixelRatio,
                });
                //添加图层
                this.setVectorLayer(this.searchParam);

                //点击取点
                this.map.on('singleclick', evt => {
                    
                    //transform(evt.coordinate, 'EPSG:4326', 'BD:09')
                    console.log('点击坐标:', evt.coordinate);

                    
                    CommonFun.copyToClip(evt.coordinate);

                    this.$message(evt.coordinate + '已复制到剪切板')
                        
                    let pixel = this.map.getEventPixel(evt.originalEvent);
                    let feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                        return feature;
                    });
                    if (feature) {
                        //点击marker
                        let coordinates = feature.getGeometry().getCoordinates();
                        console.log('id', feature.get('taskId'));
                        //TODO
                    } else {
                       //点击地图 
                    }
                })
            },
            initSvgImage(src) {
                const image = new Image(200, 200) // 这里设置的大小为原始大小
                image.src = imgDanger // src 为svg地址
                return image
            },
            //设置vectorLayer
            async setVectorLayer(param) {
                let res = {};
                let data = [];
                try{
                    res = await this.getMapFalutTypeCout(param);
                    const dataRes = res.data;
                    this.total = 0;
                    if(dataRes.status && !!dataRes.data) {
                        data = dataRes.data.barrioList;
                    }
                }catch(err) {
                    console.error(err);
                }
                let that = this;
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

                if(!this.falutData.length) {
                    return
                }
                //标注列表
                function featureList(falutData) {
                    let list = [];

                    for (const item of that.falutData) {
                        //transform(item.position, 'EPSG:4326', 'EPSG:3857');
                        // 用于充当标注的要素
                        let labelFeature = new Feature({
                            geometry: new GeomPoint(item.position),
                            name: item.value + '',
                            taskId: 10
                        });
                        // 设置标注样式
                        let labelStyle = new LabelStyle({
                            image: new IconStyle({
                                img: that.mapPollutionImage,
                                imgSize: [200, 200],
                                scale: 0.15,
                                opacity: 0.9,
                                color: '#C25C38',
                                anchor: [0.5, 200],              //锚点
                                anchorOrigin:'top-right',       //锚点源
                                anchorXUnits: 'fraction',       //锚点X值单位
                                anchorYUnits: 'pixels',         //锚点Y值单位
                                offsetOrigin: 'top-right'      //偏移原点
                            }),
                            text: new TextStyle({
                                textAlign: 'center',            //位置
                                textBaseline: 'top',         //基准线
                                font: 'normal 14px 微软雅黑',    //文字样式
                                text: labelFeature.get('name'),      //文本内容
                                fill: new StyleFill({       //文本填充样式（即文字颜色)
                                    color: '#C25C38'
                                }),
                                stroke: new StyleStroke({
                                    color: '#000', 
                                    width: 1
                                }),
                            })
                        });
                    
                        // 添加标注的样式
                        labelFeature.setStyle(labelStyle);
                        list.push(labelFeature);
                    }
                    return list;
                }
                
                
                // 将标注要素添加到矢量图层中
                // 

                if(!this.vectorLayer) {
                    let vectorSource = new VectorSource()
                    vectorSource.addFeatures(featureList());
                    this.vectorLayer = new VectorLayer({
                        source: vectorSource
                    });
                    this.map.addLayer(this.vectorLayer);
                } else {
                    this.vectorLayer.getSource().clear();
                    this.vectorLayer.getSource().addFeatures(featureList());
                }
            },
            getMapFalutTypeCout(param) {
                //如果有定时器
                console.log(this.timer);
                if(this.timer) {
                    clearInterval(this.timer);
                }
                return axiosHttp.get(`${baseUrl.BASEURL}home/mapFalutTypeCout?level=${param.level}&name=${param.name}`);
            },
            toPage(params) {
                let toPage = 'analyseDelayDegradation';
                // this.$store.commit('pushIncludeList', 'analyseDialTest');
                sessionStorage.setItem('defaultActive', toPage);
                this.$store.dispatch('setDefaultActive', toPage);
                sessionStorage.setItem('openlist',toPage);
                this.$store.dispatch('setOpenList', ['iconfont icon-zhuanjia'])
                setTimeout(() => this.$router.push({name: toPage, params: params}))
            },
            resize() {
                setTimeout(() => {
                    this.map.updateSize();
                }, 10);
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
#olMap{
    width: 100%;
    height: calc(100% + 30px);
    position: relative;
    z-index: 998;
}
#olMap::after{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    box-shadow: inset 0px 0px 40px 40px #020c0d;
    pointer-events: none;
}
.map-content{
    width:100%;
    padding-top: 120px;
    height: 100%;
    position: relative;
    background: #020c0c;
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
