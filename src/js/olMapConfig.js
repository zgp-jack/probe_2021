import TileLayer from 'ol/layer/Tile';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileImage from 'ol/source/TileImage';
import Projection from "ol/proj/Projection";
import { addProjection, addCoordinateTransforms } from 'ol/proj';

import projzh from "projzh";
import { applyTransform } from "ol/extent";

let extent = [72.004, 0.8293, 137.8347, 55.8271];
var projBD09 = new Projection({
    code: 'BD:09',
    extent: applyTransform(extent, projzh.ll2bmerc),
    units: 'm'
});

addProjection(projBD09);
addCoordinateTransforms("EPSG:4326", projBD09, projzh.ll2bmerc, projzh.bmerc2ll);
addCoordinateTransforms('EPSG:3857', projBD09, projzh.smerc2bmerc, projzh.bmerc2smerc);
/*定义百度地图分辨率与瓦片网格*/
let resolutions = [];
for (var i = 0; i <= 18; i++) {
    resolutions[i] = Math.pow(2, 18 - i);
}

let tilegrid = new TileGrid({
    origin: [0, 0],
    resolutions: resolutions,
    // extent: applyTransform(extent, projzh.ll2bmerc),
    tileSize: [256, 256]
});

let maptype = 0;        //0表示部署的离线瓦片地图，1表示OSM,2表示使用Arcgis在线午夜蓝地图服务

let streetmap = () => {
    let maplayer = null;
    switch(maptype) {
        case 0:
            maplayer = new TileLayer({
                //加载地图
                source: new TileImage({
                    // url:`/static/tiles/{z}/{x}/{y}.png`, //无偏移地图
                    projection: "BD:09",
                    tileGrid: tilegrid,
                    tilePixelRatio: 1,
                    tileUrlFunction: function(tileCoord, pixelRatio, proj) {
                        var z = tileCoord[0];
                        var x = tileCoord[1];
                        var y = tileCoord[2] + 1;
                        if (x < 0) {
                            x = -x;
                        }
                        if (y < 0) {
                            y = -y;
                        }
                        return '/static/tiles/' + z + '/' + x + '/' + y + '.png';
                    },
                })
            })
        break;
        case 1:
            maplayer=new TileLayer({
                source: new OSM()
            })
        break;
        case 2:
            maplayer=new TileLayer({
                source:new TileArcGISRest({
                    url:'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
                })
            })
        break;
    }
    return maplayer;
}

var mapconfig = {
    x: 103.92261391549005,     //中心点经度和纬度
    y: 30.578115218737437,
    zoom: 12,          //地图缩放级别
    streetmap: streetmap
};

export default mapconfig
