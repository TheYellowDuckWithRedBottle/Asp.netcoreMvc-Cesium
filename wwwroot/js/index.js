function init(Cesium) {
   Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDMwNTQ3ZC0xYjE5LTQ5MTUtYmM4ZC0yOTgwYTg4ZDA0N2EiLCJpZCI6MTQwNzcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ3MDg4OTJ9.YUsZDqZPckX3GwlCCuqfoOVZokwMKdySqrkVgKUv5dA';
    
    var imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=f5bb12c6cae196cd462140e3a1bccddd",

        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        fileExtension: 'png',
        minimumLevel: 0,
        maximumLevel: 13
    })

    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, 
        baseLayerPicker: false, 
        imageryProvider: imageryProvider,
        geocoder: false, 
        timeline: false, 
        sceneModePicker: false, 
        navigationHelpButton: false, 
        infoBox: true, 
        baseLayerPicker: false,
        homeButton:false,
        selectionIndicator: false,
        contextOptions: {
            webgl: {
                alpha: false
            }
        },
        fullscreenButton: false,
        infoBox: false
    });

   
    //viewer.scene.globe.baseColor = new Cesium.Color(1, 1, 1, 0);
    //viewer.scene.undergroundMode = true;
    //viewer.scene.backgroundColor = new Cesium.Color(1, 1, 1, 0);
    //viewer.scene.globe.depthTestAgainstTerrain = true;
    //viewer.scene.logarithmicDepthBuffer = false;

    viewer._cesiumWidget._creditContainer.style.display = 'none'
    //viewer.scene.skyBox.show = false
    //viewer.scene.sun.show = false
    //viewer.scene.moon.show = false
    //viewer.scene.globe.show = false
    //viewer.scene.skyAtmosphere.show = false
    //viewer.scene.globe.depthTestAgainstTerrain = false
    //viewer.scene.globe.enableLighting = false
    return viewer;
}
function init1(Cesium) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDMwNTQ3ZC0xYjE5LTQ5MTUtYmM4ZC0yOTgwYTg4ZDA0N2EiLCJpZCI6MTQwNzcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ3MDg4OTJ9.YUsZDqZPckX3GwlCCuqfoOVZokwMKdySqrkVgKUv5dA';
    var viewer;
    var imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: 'http://localhost:5052/DATA/Img/{z}/{x}/{y}.png', //服务地址
        
    });
    viewer = new Cesium.Viewer('cesiumContainer', {
        terrainExaggeration: 0.95,
        //imageryProvider: imageryProvider,
        //terrainProvider: terrainProvider,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        timeline: false,
        animation: false,
        selectionIndicator: false,
        infoBox: false
    });
     viewer._cesiumWidget._creditContainer.style.display = 'none'
    viewer.scene.globe.showGroundAtmosphere = false
    viewer.scene.globe.baseColor = new Cesium.Color(1, 1, 1, 0) //修改地球颜色



    viewer.camera.setView({
        // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
        // fromDegrees()方法，将经纬度和高程转换为世界坐标
        destination: new Cesium.Cartesian3.fromDegrees(99, 36.4, 18000008),
        orientation: {
            // 指向
            //heading:Cesium.Math.toRadians(90,0),
            // 视角
            //pitch:Cesium.Math.toRadians(-90),
            //roll:0.0
        }
    })
    viewer.scene.globe.depthTestAgainstTerrain = true
    return viewer;
}
function add3DtilesNoStyle(viewer, url) {
    var tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: url
        })
    )
    tileset.readyPromise.then(function (model) {
        viewer.zoomTo(tileset)
    })
}
function add3DTilesetData(viewer, url,style) {
    var isAdded = get3DTilesData(viewer, url)
    if (isAdded != undefined) {
    }
    else {
        var tileset = new Cesium.Cesium3DTileset({
            url: url
        });
        tileset.style=style
        viewer.scene.primitives.add(tileset)
        addListener(tileset)
        tileset.readyPromise.then(function (tileset) {
            viewer.zoomTo(tileset)
            var properties = tileset.properties;
            if (Cesium.defined(properties)) {
                for (var name in properties) {
          
                }
            } if (url == XINYI_CLASSIF_MODEL_DOWN_URL) {
                tileset.style = XINYI_CLASSIF_MODEL_STYLE
            }
        });
    }
}
function get3DTilesData(viewer, url) {
    var tileset
    var primitives = viewer.scene.primitives
    for (var i = 0; i < primitives.length; i++) {
        if (primitives._primitives[i]._url == url) {
            tileset = primitives._primitives[i]
        }
    }
    return tileset
}
function removeAllTiles(viewer) {
    var primitives = viewer.scene.primitives
    for (var i = primitives.length - 1; i > -1; i--) {
        viewer.scene.primitives.remove(primitives._primitives[i])
    }
}
function remove3dtiles(viewer, url) {
    var isAdded = get3DTilesData(viewer, url)
    if (isAdded != undefined) {//说明存在，存在就移除
        var primitives = viewer.scene.primitives
        for (var i = 0; i < primitives.length; i++) {
            if (primitives._primitives[i]._url == url) {
                viewer.scene.primitives.remove(primitives._primitives[i])
            }
        }
    } else {
        console.log("当前场景中不存在此数据")
    }

}

function add3Dtiles(viewer, url, style) {
    var tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: url
        })
    )
    tileset.style=style
    tileset.readyPromise.then(function (tileset) {
        viewer.zoomTo(tileset, new HeadingPitchRange(0, -1, tileset.boundingSphere.radius))
        var position = tileset.boundingSphere.center
        var catographic = Cartographic.fromCartesian(position, viewer.scene.globe.ellipsoid)
        catographic.height = tileset.boundingSphere.radius * 1.5
        CesiumNavigation.terria.options.defaultResetView = catographic
    })
    tileset.tileLoad.addEventListener(function (tile) {
        processTileFeatures(tile, function (data) {
            var propertyNames = data.getPropertyNames()
            var length = propertyNames.length
            for (var i = 0; i < length; ++i) {
                var propertyName = propertyNames[i]
                var propertyValue = data.getProperty(propertyName)
           
                //if (propertyValue == "1-01") {
                
                //    var pos = data.content.tile.boundingSphere.center
                //    console.log(data.content,pos)
                //    var labels = viewer.scene.primitives.add(new Cesium.LabelCollection());
                //    labels.add({
                //        position: pos,
                //        text: '1-01',
                //        font: '24px Helvetica',
                //        outlineColor: Cesium.Color.BLACK,
                //        outlineWidth: 2,
                //        style: Cesium.LabelStyle.FILL_AND_OUTLINE

                //    })
                //}
            }
        });

    });
}
function set3DTileForFLStyle(queryField, selectValues){
    var conditions = []
    var selectcontent = '${' + queryField + "} === '" + selectValues + "'"
    var cond = [selectcontent, 'rgb(255,0,0)']
    conditions.push(cond)
    var cond_end = ['true', 'rgba(0,0,0,0.002)']
    conditions.push(cond_end)
    var transparentStyle = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: conditions
        }
    })
    return transparentStyle
}
function set3DTileStyle(queryField, selectValues) {
    var conditions = []
    var selectcontent = '${' + queryField + "} === '" + selectValues + "'"
    var cond = [selectcontent, 'rgb(255,255,255)']
    conditions.push(cond)
    var cond_end = ['true', 'rgba(0,0,0,0.002)']
    conditions.push(cond_end)
    var transparentStyle = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: conditions
        }
    })
    return transparentStyle
}
function addListener(tileset) {
    var scene = viewer.scene
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        var pickFeature = viewer.scene.pick(click.position)
        console.log("选中的要素", pickFeature)
        if (pickFeature) {
            selectFeature(pickFeature,tileset)
            getAllProperty(pickFeature)
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
function selectFeature(feature,tileset) {
    var selectbuilding = feature.getProperty('id');
    var  selectcontent= "${id} ===" + selectbuilding  
    var transparentStyle = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: [
                [selectcontent, "rgb(255,255,0)"],
             
                ["true", "rgb(127, 59, 8)"],// true表示剩余的显示的对象
            ]
        },
    });
    tileset.style = transparentStyle
}
function getAllProperty(feature) {
    var propertyNames = feature.getPropertyNames()
    console.log(propertyNames)
    var length = propertyNames.length
    for (var i = 0; i < length; ++i) {
        var propertyName = propertyNames[i]
        var propertyValue = feature.getProperty(propertyName)
        
        console.log(propertyName + ":" + feature.getProperty(propertyName))
    }
}
function getFeaturePos(feature, roomId) {
    var propertyNames = feature.getPropertyNames()
    console.log(propertyNames)
    var length = propertyNames.length
    for (var i = 0; i < length; ++i) {
        var propertyName = propertyNames[i]
        var propertyValue = feature.getProperty(propertyName)
        if (propertyValue == roomId) {

        }
        console.log(propertyName + ":" + feature.getProperty(propertyName))
    }
}

function add3DTileByHeight(url) {
    tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
        url:url
    }))
    tileset.readyPromise.then((tileset) => {
        setColorByHeight()
        viewer.flytTo(tileset)
    })
}
function setColorByHeight() {
    tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: [
                ["${height}>=300", "rgba(45,0,75,0.5)"],
                ["${height}>=200", "rgba(102,71,151)"],
                ["${height}>=100", "rgba(170,162,204)"],
                ["${height}>=50", "rgba(224,226,238)"],
                ["${height}>=25", "rgba(252,230,200)"],
                ["${height}>=10", "rgba(248,176,87)"],
                ["${height}>=5", "rgba(198,106,11)"],
                ["true", "rgba(127,59,8)"]
            ]
        }
    })
}
function colorByDistance() {
    tileset.style = new Cesium.Cesium3DTileStyle({
        defines: {
            distance: `distance(vec2(${longitude},${latitude}),vec2(-1.291777521, 0.7105706624))`
        },
        color: {
            conditions: [
                [`${distance}>0.0012`, "color('red')"],
                [`${distance}>0.0008`, `mix(color(yellow),color('red'),(${distance}-0.008)/0.0004`],
                [`${distance}<0.00001`, "color('white')"],
                ["true",`mix(color('blue'),color('green'),${distance}/0.0004)`]
            ]
        }
    },
    )
}

function hideByHeight() {
    tileset.style = new Cesium.Cesium3DTileStyle({
        show: "${height} > 200",
    });
}

function ReturnSTModel() {
    var LP_MODEL_URLS = [
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0001/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0002/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0005/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0006/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0009/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0010/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0011/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0012/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0015/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0016/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0017/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0018/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0019/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0020/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0021/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0022/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0023/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0024/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0025/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0026/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0027/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0028/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0029/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0030/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0031/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0032/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0033/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0034/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0035/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0036/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0037/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0038/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0039/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0040/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0041/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0042/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0043/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0044/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0045/tileset.json',
        'http://222.184.234.26:5064/Data/SWDJ/320602/010025GB03200/ST/0046/tileset.json']
    return LP_MODEL_URLS
}
function addClassification3Dtiles(viewer, url) {
    var tileset = new Cesium.Cesium3DTileset({
        url: url,
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
    })
    tileset.style = new Cesium.Cesium3DTileStyle({
        color: "color('blue', 0.8)"
    })
    viewer.scene.primitives.add(tileset)
    //tileset.readyPromise.then(function () { })
}

function processContentFeatures(content, callback) {
    var featuresLength = content.featuresLength;
    for (var i = 0; i < featuresLength; ++i) {
        var feature = content.getFeature(i);
        callback(feature);
    }
}
function processTileFeatures(tile, callback) {
    var content = tile.content;
    var innerContents = content.innerContents;
    if (Cesium.defined(innerContents)) {
        var length = innerContents.length;
        for (var i = 0; i < length; ++i) {
            processContentFeatures(innerContents[i], callback);
        }
    } else {
        processContentFeatures(content, callback);
    }

}

