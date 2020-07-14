var renderer, camera, scene; // 渲染器，相加，场景
var Earth, satellites = []; // 地球，卫星（数组）

/**
 * 返回一个卫星和轨道的组合体
 * @param satelliteSize 卫星的大小
 * @param satelliteRadius 卫星的旋转半径
 * @param rotation 组合体的x,y,z三个方向的旋转角度
 * @param speed 卫星运动速度
 * @param scene 场景
 * @param rgb 颜色
 * @returns {{satellite: THREE.Mesh, speed: *}} 卫星组合对象;速度
 */
var initSatellite = function (satelliteSize, satelliteRadius, rotation, speed, scene, rgb) {
    var track = new THREE.Mesh(new THREE.RingGeometry(satelliteRadius, satelliteRadius + 0.05, 50, 1), new THREE.MeshBasicMaterial());
    var centerMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1), new THREE.MeshLambertMaterial()); // 材质设定
    var pivotPoint = new THREE.Object3D();
    var satellite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(generateSprite(rgb)),
        blending: THREE.AdditiveBlending
    }));

    satellite.scale.x = satellite.scale.y = satellite.scale.z = satelliteSize;
    satellite.position.set(satelliteRadius, 0, 0);
    pivotPoint.add(satellite);
    pivotPoint.add(track);
    centerMesh.add(pivotPoint);
    centerMesh.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(centerMesh);

    return { satellite: centerMesh, speed: speed };
};

/**
 * 实现发光星星
 * @param color 颜色的r,g和b值,比如：“123,123,123”;
 * @returns {Element} 返回canvas对象
 */
var generateSprite = function (color) {
    var canvas = document.createElement('canvas');

    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);

    gradient.addColorStop(0, 'rgba(' + color + ',1)');
    gradient.addColorStop(0.2, 'rgba(' + color + ',1)');
    gradient.addColorStop(0.4, 'rgba(' + color + ',.6)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
};

var render = function() {
    renderer.render(scene, camera);
    Earth.rotation.y -= 0.01;

    for (var i = 0; i < satellites.length; i++) {
        satellites[i].satellite.rotation.z -= satellites[i].speed;
    }

    requestAnimationFrame(render);
}
var initRound = function () {
    var dom = document.getElementById('round');
    var sunTexture = THREE.ImageUtils.loadTexture('../static/img/map_world.png', {}, function () {
        renderer.render(scene, camera);
    });
    var satellite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(generateSprite('196,233,255')),
        blending: THREE.AdditiveBlending
    }));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(20, dom.clientWidth / dom.clientHeight, 1, 1000);
    camera.position.set(0, 0, 300); // 设置相机位置
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(dom.clientWidth, dom.clientHeight); // 设置窗口尺寸
    dom.appendChild(renderer.domElement);

    //地球
    Earth = new THREE.Mesh(new THREE.SphereGeometry(20, 30, 30), new THREE.MeshBasicMaterial({
        map: sunTexture
    })); // 材质设定

    satellite.scale.x = satellite.scale.y = satellite.scale.z = 0;
    scene.add(satellite); // 添加发光,让地球有发光的样式
    // scene.add(Earth);

    //添加卫星
    satellites.push(initSatellite(5, 30, { x: -Math.PI * 0.35, y: Math.PI * 0.3, z: 0 }, 0.02, scene, '222, 99, 213'));
    satellites.push(initSatellite(5, 30, { x: -Math.PI * 0.35, y: -Math.PI * 0.27, z: 0 }, 0.03, scene, '255, 255, 0'));
    satellites.push(initSatellite(5, 30, { x: -Math.PI * 0.35, y: Math.PI * 0.05, z: 0 }, 0.04, scene, '25, 225, 175'));
    satellites.push(initSatellite(5, 30, { x: -Math.PI * 0.35, y: Math.PI * 0.05, z: 0 }, 0.035, scene, '87, 199, 241'));

    render();
}
