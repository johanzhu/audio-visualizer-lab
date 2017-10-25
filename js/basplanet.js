function BasPlanet() {
	
	var planet = new THREE.IcosahedronGeometry(6, 1);
      
    THREE.BAS.Utils.separateFaces(planet);
    
    var geometry = new THREE.BAS.ModelBufferGeometry(planet,{
        localizeFaces: false,
        computeCentroids: true
    });
    
    geometry.bufferUVs();
    
    var i, j, offset, centroid;
    
    var aDelayDuration = geometry.createAttribute('aDelayDuration', 2);
    var minDuration = 0.8;
    var maxDuration = 1.2;
    var maxDelayX = 0.9;
    var maxDelayY = 0.125;
    var stretch = 0.11;
    
    this.totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;
    
    var width = 120;
    var height = 120;
    
    for (i = 0, offset = 0; i < geometry.faceCount; i++) {
    	
    	centroid = geometry.centroids[i];
    
        var duration = THREE.Math.randFloat(minDuration, maxDuration);
        
        var delayX = THREE.Math.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
        var delayY;
    
        delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0)
    
        for (j = 0; j < 3; j++) {
            
          aDelayDuration.array[offset]     = delayX + delayY + (Math.random() * stretch * duration);
          aDelayDuration.array[offset + 1] = duration;
    
          offset += 2;
        }
      }
    
    
      var aStartPosition = geometry.createAttribute('aStartPosition', 3, function(data, i) {
        data[0] = geometry.centroids[i].x;
        data[1] = geometry.centroids[i].y;
        data[2] = geometry.centroids[i].z;
      });
      
      var aEndPosition = geometry.createAttribute('aEndPosition',3);
      var control0 = geometry.createAttribute('aControl0', 3);
      var control1 = geometry.createAttribute('aControl1', 3);

      
      var faceCount = geometry.faceCount;
      for (i = 0, i3 = 0; i < faceCount; i++, i3 += 9) {
	    var face = planet.faces[i];
	    var centroid = THREE.BAS.Utils.computeCentroid(planet, face);
	
	    // ctrl
	    var c0x = centroid.x * 1.2;
	    var c0y = centroid.y * 1.2;
	    var c0z = centroid.z;
	
	    var c1x = centroid.x * 2.4;
	    var c1y = centroid.y * 2.4;
	    var c1z = centroid.z * 2.4;
	
	    for (v = 0; v < 9; v += 3) {
	      control0.array[i3 + v    ] = c0x;
	      control0.array[i3 + v + 1] = c0y;
	      control0.array[i3 + v + 2] = c0z;
	
	      control1.array[i3 + v    ] = c1x;
	      control1.array[i3 + v + 1] = c1y;
	      control1.array[i3 + v + 2] = c1z;
	    }
	    
	    var x, y, z;

	    x = centroid.x * 4;
	    y = centroid.y * 4;
	    z = centroid.z * 4;
	
	    for (v = 0; v < 9; v += 3) {
	      aEndPosition.array[i3 + v    ] = x;
	      aEndPosition.array[i3 + v + 1] = y;
	      aEndPosition.array[i3 + v + 2] = z;
	    }
	    
	  }
      
      var material = new THREE.BAS.PhongAnimationMaterial({
        side: THREE.DoubleSide,
        shading: THREE.FlatShading,
        uniforms: {
            uTime: {value: 0},
        },
        uniformValues: {
	        diffuse: new THREE.Color('#ff3953'),
		},
        vertexFunctions: [
            THREE.BAS.ShaderChunk['cubic_bezier'],
            THREE.BAS.ShaderChunk['ease_cubic_in_out'],
            THREE.BAS.ShaderChunk['quaternion_rotation']
        ],
        vertexParameters: [
            'uniform float uTime;',
            'uniform float uCo;',
            'uniform float uPM;',
            'attribute vec2 aDelayDuration;',
            'attribute vec3 aStartPosition;',
            'attribute vec3 aControl0;',
            'attribute vec3 aControl1;',
            'attribute vec3 aEndPosition;'
        ],
        vertexInit: [
            'float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
        ],
        vertexPosition: [
            'vec3 tPosition = transformed - aStartPosition;',
	        'tPosition *= 1.0 - tProgress;',
	        'tPosition += aStartPosition;',
            'tPosition += cubicBezier(tPosition, aControl0, aControl1, aEndPosition, tProgress);',
        	'transformed = tPosition;'
          ]
        });
        
        this.geometry = geometry;
		this.material = material;
		
        THREE.Mesh.call(this,this.geometry,this.material);
        
        
    	this.rotation.set(Math.PI/4,Math.PI/4,Math.PI/4);
        this.frustumCulled = false;
        
    }    
    
    BasPlanet.prototype = Object.create(THREE.Mesh.prototype);
    BasPlanet.prototype.constructor = BasPlanet;
    
    Object.defineProperty(BasPlanet.prototype, 'time', {
      get: function () {
        return this.material.uniforms['uTime'].value;
      },
      set: function (v) {
        this.material.uniforms['uTime'].value = v;
      }
    });
	
	
