function World(){
    
    this.defaultScene;
    
    this.defaultCamera;
    
    this.scene;
    
    this.camera;
    
}

World.prototype = {
	
	construtor : World,
	
    init : function(scene,camera){
    	
		var domElement = document.createElement('div');
		domElement.setAttribute('id','world');
		document.body.appendChild(domElement);
	
		var scope = this;
    
		this.defaultScene = new THREE.Scene();
		this.defaultScene.name = 'default scene';
		
   		this.defaultCamera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
   		this.defaultCamera.name = 'defauldt camera';
   		this.defaultCamera.position.set(0,0,100);
		this.defaultCamera.lookAt(new THREE.Vector3(0,0,0));
		
        if(!scene) {
			this.scene = this.defaultScene;
		}else{
			this.scene = scene;
		}
		if(!camera) {
			this.camera = this.defaultCamera;
		}else{
			this.camera = camera;
		}
		
		this.renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
		this.renderer.setSize(window.innerWidth,window.innerHeight);
		this.renderer.setPixelRatio(1.5);
		this.renderer.shadowMap.enabled = true;
	
		var container =  document.getElementById('world');
		container.appendChild(this.renderer.domElement);
	
		window.addEventListener('resize',onWindowResize,false);
	
		function onWindowResize(){
      		var WIDTH=window.innerWidth;
      		var HEIGHT=window.innerHeight;
      		scope.renderer.setSize(WIDTH, HEIGHT);
      		scope.camera.aspect = WIDTH / HEIGHT;
      		scope.camera.updateProjectionMatrix();
    	}
	    
		this.axisHelper = new THREE.AxisHelper(10);
		this.scene.add(this.axisHelper);
		var ambient = new THREE.AmbientLight( 0xffffff );
    	this.scene.add( ambient );
    
    },
		
	render : function(){
		this.renderer.render(this.scene,this.camera);
	},
	
	removeAxis : function(){
		this.scene.remove(this.axisHelper);
	},
	
	changeScene : function(scene,camera){
		this.scene = scene;
		this.camera = camera;
		var WIDTH=window.innerWidth;
      	var HEIGHT=window.innerHeight;
      	this.renderer.setSize(WIDTH, HEIGHT);
      	this.camera.aspect = WIDTH / HEIGHT;
      	this.camera.updateProjectionMatrix();
	}
	
}	
