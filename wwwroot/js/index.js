function init(Cesium) {
   Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDMwNTQ3ZC0xYjE5LTQ5MTUtYmM4ZC0yOTgwYTg4ZDA0N2EiLCJpZCI6MTQwNzcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ3MDg4OTJ9.YUsZDqZPckX3GwlCCuqfoOVZokwMKdySqrkVgKUv5dA';
    
    var imageryProvider = new Cesium.UrlTemplateImageryProvider({
        url: "http://localhost:6060/Data/BASE_DATA/IMAGE/{Z}/{X}/{Y}.png",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        fileExtension: 'png',
        minimumLevel: 0,
        maximumLevel: 13
    })
    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, 
        baseLayerPicker: false, 
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
    viewer.scene.globe.baseColor = new Cesium.Color(1, 1, 1, 0);
    viewer.scene.undergroundMode = true;
    viewer.scene.backgroundColor = new Cesium.Color(1, 1, 1, 0);
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.logarithmicDepthBuffer = false;

    viewer._cesiumWidget._creditContainer.style.display = 'none'
    viewer.scene.skyBox.show = false
    viewer.scene.sun.show = false
    viewer.scene.moon.show = false
    viewer.scene.globe.show = false
    viewer.scene.skyAtmosphere.show = false
    viewer.scene.globe.depthTestAgainstTerrain = false
    viewer.scene.globe.enableLighting = false
    return viewer;
}
function init1(Cesium) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzZDMwNTQ3ZC0xYjE5LTQ5MTUtYmM4ZC0yOTgwYTg4ZDA0N2EiLCJpZCI6MTQwNzcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjQ3MDg4OTJ9.YUsZDqZPckX3GwlCCuqfoOVZokwMKdySqrkVgKUv5dA';
    var viewer;
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
    let isAdded = get3DTilesData(viewer, url)
    if (isAdded != undefined) {
    }
    else {
        var tileset = new Cesium.Cesium3DTileset({
            url: url
        });
        tileset.style=style
        viewer.scene.primitives.add(tileset)

        addListener(tileset)
        viewer.zoomTo(tileset)
        tileset.loadProgress.addEventListener(function (numberOfPendingRequests, numberOfTilesProcessing) {
            if ((numberOfPendingRequests === 0) && (numberOfTilesProcessing === 0)) {
                return;
            }
        });
        tileset.readyPromise.then(function (tileset) {
            // tile.properties is not defined until readyPromise resolves.
            viewer.zoomTo(tileset)
            var properties = tileset.properties;
            console.log(properties)
            if (Cesium.defined(properties)) {
                for (var name in properties) {
                    console.log(name)
                }
            } if (url == XINYI_CLASSIF_MODEL_DOWN_URL) {
                tileset.style = XINYI_CLASSIF_MODEL_STYLE
            }
        });
    }
}
function get3DTilesData(viewer, url) {
    let tileset
    let primitives = viewer.scene.primitives
    for (let i = 0; i < primitives.length; i++) {
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
    let isAdded = get3DTilesData(viewer, url)
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
function addPickEntity(viewer, settingList) {
    if (viewer && settingList.length == 1) {

        removeAllTiles(viewer)
        for (let item of settingList) {
            add3Dtiles(viewer, item[0], item[1])
        }
    } else if (viewer && settingList.length == 2) {

        removeAllTiles(viewer)
        // remove3dtiles(viewer, settingList[1])
        for (let item of settingList) {
            add3Dtiles(viewer, item[0], item[1])
        }
    }
}
function add3Dtiles(viewer, url, style) {
    var tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: url
        })
    )
    tileset.style = style
    tileset.readyPromise.then(function (tileset) {
        viewer.zoomTo(tileset, new HeadingPitchRange(0, -1, tileset.boundingSphere.radius))
        let position = tileset.boundingSphere.center
        let catographic = Cartographic.fromCartesian(position, viewer.scene.globe.ellipsoid)
        catographic.height = tileset.boundingSphere.radius * 1.5
        CesiumNavigation.terria.options.defaultResetView = catographic
    })
}
function set3DTileStyle(queryField, selectValues) {
    let conditions = []
    var selectcontent = '${' + queryField + "} === '" + selectValues + "'"
    var cond = [selectcontent, 'rgb(255,255,255)']
    conditions.push(cond)
    let cond_end = ['true', 'rgba(255,165,188,0.002)']
    conditions.push(cond_end)
    var transparentStyle = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: conditions
        }
    })
    return transparentStyle
}
function addListener(tileset) {
    let scene = viewer.scene
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        var pickFeature = viewer.scene.pick(click.position)
        console.log("选中的要素", pickFeature)
        if (pickFeature) {
             selectFeature(pickFeature,tileset)
            //getAllProperty(pickFeature)
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
    for (let i = 0; i < length; ++i) {
        var propertyName = propertyNames[i]
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


