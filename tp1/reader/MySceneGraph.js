
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;

	// File reading
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/'+filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function()
{
	console.log('XML Loading finished.');
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseXML(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

// ===================================================================================================================================
// ================================================ Parse Individual Parts ===========================================================
// ===================================================================================================================================

// ======================================================= Scene =====================================================================

// Retrieves and saves the information of the root component id and length of the axis
MySceneGraph.prototype.parseScene = function(rootElement){
	this.scene.root = this.reader.getString(rootElement, "root", true);
	this.scene.axisLength = this.reader.getFloat(rootElement, "axis_length", true);
};

// ===================================================================================================================================

// ================================================= Views & Perspectives ============================================================

// Retrives information from the view tag and all perspective tags
MySceneGraph.prototype.parseViews = function(rootElement){
	this.scene.defaultView = this.reader.getString(rootElement, "default", true);
	this.perspectives = {};
	this.scene.perspectives = [];
	var perspectives = rootElement.getElementsByTagName("perspective");

	for(var i = 0; i < perspectives.length; i++){
		var id = this.reader.getString(perspectives[i], "id", true);
		var near = this.reader.getFloat(perspectives[i], "near", true);
		var far = this.reader.getFloat(perspectives[i], "far", true);
		var angle = this.reader.getFloat(perspectives[i], "angle", true);
		var position = this.getFloats(perspectives[i].getElementsByTagName('from')[0], ['x', 'y', 'z']);
		var target = this.getFloats(perspectives[i].getElementsByTagName('to')[0], ['x', 'y', 'z']);
		var myPerspective = new CGFcamera(angle*Math.PI/180, near, far, position, target);
		myPerspective.index = this.scene.perspectives.length;
		if(this.perspectives.hasOwnProperty(id))
			return "Non-Unique perspective id: " + id;
		this.perspectives[id] = myPerspective;
		this.scene.perspectives.push(myPerspective);
	}
};

// ===================================================================================================================================


// ==================================================== Illumination =================================================================

// Gets the information about the general illumination
MySceneGraph.prototype.parseIllumination = function(rootElement){
	this.background = [];
	this.ambient = [];

	var ambientTag = rootElement.getElementsByTagName("ambient")[0];
	var backgroundTag = rootElement.getElementsByTagName("background")[0];

	this.background = this.getFloats(backgroundTag, ['r', 'g', 'b', 'a']);
	this.ambient = this.getFloats(ambientTag, ['r', 'g', 'b', 'a']);
};

// ===================================================================================================================================

// ====================================================== Lights =====================================================================

// Reads and returns an omni light from an omni light tag block
MySceneGraph.prototype.getOmniLight = function(omniBlock){
	omniLightParams = [0,0,0,0];
	var id = this.reader.getString(omniBlock, 'id', true);
	if(this.lightIDs.indexOf(id) != -1)
		return null;
  this.lightIDs.push(id);
	var enabled = this.reader.getBoolean(omniBlock, 'enabled', true);
	for(var i = 0; i < omniBlock.children.length; i++){
		switch(omniBlock.children[i].tagName){
			case 'location': omniLightParams[0] = this.getFloats(omniBlock.children[i], ['x', 'y', 'z', 'w']); break;
			case 'ambient': omniLightParams[1] = this.getFloats(omniBlock.children[i], ['r', 'g', 'b', 'a']); break;
			case 'diffuse': omniLightParams[2] = this.getFloats(omniBlock.children[i], ['r', 'g', 'b', 'a']); break;
			case 'specular': omniLightParams[3] = this.getFloats(omniBlock.children[i], ['r', 'g', 'b', 'a']); break;
			default: return null;
		}
	}

	var myLight = {};
	myLight.type = "omni";
	myLight.id = id;
	myLight.enabled = enabled;
	myLight.position = [omniLightParams[0][0], omniLightParams[0][1], omniLightParams[0][2], omniLightParams[0][3]];
	myLight.ambient = [omniLightParams[1][0], omniLightParams[1][1], omniLightParams[1][2], omniLightParams[1][3]];
	myLight.diffuse = [omniLightParams[2][0], omniLightParams[2][1], omniLightParams[2][2], omniLightParams[2][3]];
	myLight.specular = [omniLightParams[3][0], omniLightParams[3][1], omniLightParams[3][2], omniLightParams[3][3]];
	return myLight;
};

// Reads and returns a spot light from a spot light tag block
MySceneGraph.prototype.getSpotLight = function(spotBlock){
	spotLightParams = [0,0,0,0, 0];
	var id = this.reader.getString(spotBlock, 'id', true);
	if(this.lightIDs.indexOf(id) != -1)
		return null;
	this.lightIDs.push(id);
	var enabled = this.reader.getBoolean(spotBlock, 'enabled', true);
	var angle = this.reader.getFloat(spotBlock, "angle", true);
	var exponent = this.reader.getFloat(spotBlock, "exponent", true);
	for(var i = 0; i < spotBlock.children.length; i++){
		switch(spotBlock.children[i].tagName){
			case 'target': omniLightParams[0] = this.getFloats(spotBlock.children[i], ['x', 'y', 'z']); break;
			case 'location': omniLightParams[1] = this.getFloats(spotBlock.children[i], ['x', 'y', 'z', 'w']); break;
			case 'ambient': omniLightParams[2] = this.getFloats(spotBlock.children[i], ['r', 'g', 'b', 'a']); break;
			case 'diffuse': omniLightParams[3] = this.getFloats(spotBlock.children[i], ['r', 'g', 'b', 'a']); break;
			case 'specular': omniLightParams[4] = this.getFloats(spotBlock.children[i], ['r', 'g', 'b', 'a']); break;
			default: return null;
		}
	}
	var direction = [];
	direction[0] = omniLightParams[1][0] - omniLightParams[0][0];
	direction[1] = omniLightParams[1][1] - omniLightParams[0][1];
	direction[2] = omniLightParams[1][2] - omniLightParams[0][2];

	var myLight = {};
	myLight.type = "spot";
	myLight.id = id;
	myLight.enabled = enabled;
	myLight.spotCutOff= angle*Math.PI/180;
	myLight.spotDirection = direction;
	myLight.spotExponent = exponent;
	myLight.position = [omniLightParams[1][0], omniLightParams[1][1], omniLightParams[1][2], omniLightParams[1][3]];
	myLight.ambient = [omniLightParams[2][0], omniLightParams[2][1], omniLightParams[2][2], omniLightParams[2][3]];
	myLight.diffuse = [omniLightParams[3][0], omniLightParams[3][1], omniLightParams[3][2], omniLightParams[3][3]];
	myLight.specular = [omniLightParams[4][0], omniLightParams[4][1], omniLightParams[4][2], omniLightParams[4][3]];
	return myLight;
};

// Reads all lights from the omni and spot tags in the lights tag block
MySceneGraph.prototype.parseLights = function(rootElement){
	this.lights = [];
	this.lightIDs = [];
	for(var i=0; i < rootElement.children.length; i++){
		var myLight = null;
		if(rootElement.children[i].tagName == 'omni'){
			myLight = this.getOmniLight(rootElement.children[i]);
			if(myLight == null)
				return "error parsing light nr " + i;
			this.lights.push(myLight);
		}
		else if(rootElement.children[i].tagName == 'spot'){
			myLight = this.getSpotLight(rootElement.children[i]);
			if(myLight == null)
				return "error parsing light nr " + i;
			this.lights.push(myLight);
		}
		else{
			return "Unrecognized light tag :" + rootElement.children[i].tagName;
		}
	}
};

// ===================================================================================================================================

// ====================================================== Textures ===================================================================

// Reads all textures from the textures tag block
MySceneGraph.prototype.parseTextures = function(rootElement){
	this.textures={};

	var textures = rootElement.getElementsByTagName('texture');

	for(var i=0; i < textures.length; i++){
		var id = this.reader.getString(textures[i], 'id', true);
		if(this.textures.hasOwnProperty(id))
			return "Non-Unique texture id " + id;
		var file = this.reader.getString(textures[i], 'file', true);
		var myTexture = new CGFtexture(this.scene, file);
		myTexture.length_s = this.reader.getInteger(textures[i], 'length_s', true);
		myTexture.length_t = this.reader.getInteger(textures[i], 'length_t', true);
		this.textures[id] = myTexture;
	}
};

// ===================================================================================================================================

// ====================================================== Materials ==================================================================

// Reads all materials from the materials tag block
MySceneGraph.prototype.parseMaterials = function(rootElement){
	this.materials={};

	var materials = rootElement.getElementsByTagName('material');

	for(var i=0; i < materials.length; i++){
		var id = this.reader.getString(materials[i], 'id', true);
		if(this.materials.hasOwnProperty(id))
			return "Non-Unique material id " + id;
		var myMaterial = this.getMaterial(materials[i]);
		if(myMaterial == null){
			return 'Error, invalid format on tag ' + materials[i];
		}
		this.materials[id] = myMaterial;
	}
};

// ===================================================================================================================================

// ==================================================== Transformations ==============================================================

// Gets the needed parameters for each kind of transformation
MySceneGraph.prototype.getTransformationValues = function(transformation){
	pos = [];

	if(transformation.tagName != 'rotate'){
		pos[0]=this.reader.getFloat(transformation, 'x', true);
		pos[1]=this.reader.getFloat(transformation, 'y', true);
		pos[2]=this.reader.getFloat(transformation, 'z', true);
	}
	else{
		var axis = this.reader.getString(transformation, 'axis', true);
		var angle = this.reader.getString(transformation, 'angle', true);
		pos[0] = angle * Math.PI / 180;
		pos[1] = pos[2] = pos[3] = 0;
		switch(axis){
			case 'x': pos[1] = 1; break;
			case 'y': pos[2] = 1; break;
			case 'z': pos[3] = 1; break;
		}
	}
	return pos;
};

// Reads a transformation and saves it as the corresponding matrix
MySceneGraph.prototype.parseTransformation = function(transformationBlock) {
	var transfValues = [];
	var transformationMatrix = mat4.create();

	for(var i = 0; i < transformationBlock.children.length; i++){
		transfValues = this.getTransformationValues(transformationBlock.children[i]);
		switch(transformationBlock.children[i].tagName){
			case 'translate':

				mat4.translate(transformationMatrix, transformationMatrix, transfValues);
				break;
			case 'scale':
				mat4.scale(transformationMatrix, transformationMatrix, transfValues);
				break;
			case 'rotate':
				mat4.rotate(transformationMatrix, transformationMatrix, transfValues[0], [transfValues[1], transfValues[2], transfValues[3]]);
				break;
			default:
				return null;
		}
	}
	return transformationMatrix;
};

// Reads all transformations from the transformations tag block
MySceneGraph.prototype.parseTransformations = function(rootElement) {
	this.transformations = {};

	var transfs = rootElement.getElementsByTagName('transformation');
	for(var i = 0; i < transfs.length; i++){
		var id = this.reader.getString(transfs[i], 'id', true);
		if(this.transformations.hasOwnProperty(id))
			return "Non-Unique transformation id " + id;
		this.transformations[id] = this.parseTransformation(transfs[i]);
	}
};

// ===================================================================================================================================

// ===================================================== Primitives ==================================================================

// Reads all primitives from the primitives tag block
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var primitives = rootElement.getElementsByTagName('primitive');

	this.primitives = {};

	for(var i = 0; i < primitives.length; i++){
		var id = this.reader.getString(primitives[i], 'id', true); //TODO: ver que erro dá se não existir
		if(this.primitives.hasOwnProperty(id))
			return "Non-Unique primitive id " + id;
		if (primitives[i].children.length != 1)
			return 'Wrong number of primitive types - must be one!';
		switch(primitives[i].children[0].tagName){
			case 'rectangle':
				var x1 = this.reader.getFloat(primitives[i].children[0], 'x1', true);
				var y1 = this.reader.getFloat(primitives[i].children[0], 'y1', true);
				var x2 = this.reader.getFloat(primitives[i].children[0], 'x2', true);
				var y2 = this.reader.getFloat(primitives[i].children[0], 'y2', true);
				this.primitives[id] = new MyRectangle(this.scene, id, x1, y1, x2, y2);
				break;
			case 'triangle':
				x1 = this.reader.getFloat(primitives[i].children[0], 'x1', true);
				y1 = this.reader.getFloat(primitives[i].children[0], 'y1', true);
				z1 = this.reader.getFloat(primitives[i].children[0], 'z1', true);
				x2 = this.reader.getFloat(primitives[i].children[0], 'x2', true);
				y2 = this.reader.getFloat(primitives[i].children[0], 'y2', true);
				z2 = this.reader.getFloat(primitives[i].children[0], 'z2', true);
				var x3 = this.reader.getFloat(primitives[i].children[0], 'x3', true);
				var y3 = this.reader.getFloat(primitives[i].children[0], 'y3', true);
				var z3 = this.reader.getFloat(primitives[i].children[0], 'z3', true);
				this.primitives[id] = new MyTriangle(this.scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				break;
			case 'cylinder':
				var base = this.reader.getFloat(primitives[i].children[0], 'base', true);
				var top = this.reader.getFloat(primitives[i].children[0], 'top', true);
				var height = this.reader.getFloat(primitives[i].children[0], 'height', true);
				var slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				var stacks = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
				this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
				break;
			case 'sphere':
				var radius = this.reader.getFloat(primitives[i].children[0], 'radius', true);
			  slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			  stacks = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
				this.primitives[id] = new MySphere(this.scene, id, radius, slices, stacks);
				break;
			case 'torus':
				inner = this.reader.getFloat(primitives[i].children[0], 'inner', true);
				outer = this.reader.getFloat(primitives[i].children[0], 'outer', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				loops = this.reader.getInteger(primitives[i].children[0], 'loops', true);
				this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
				break;
			default:
				return 'Unrecognized type of primitive: ' + primitives[i].children[0].tagName;
		}
	}
};

// ===================================================================================================================================

MySceneGraph.prototype.parseControlPoints = function(rootElement) {
	var controlPoints = rootElement.getElementsByTagName('controlpoint');

	var points = [];
	for(var i = 0; i < controlPoints.length; i++){
		var x = this.reader.getFloat(controlPoints[i], 'xx', true);
		var y = this.reader.getFloat(controlPoints[i], 'yy', true);
		var z = this.reader.getFloat(controlPoints[i], 'zz', true);
		points.push([x, y, z]);
	}
	return points;
};

// Reads all components from the components tag block
MySceneGraph.prototype.parseAnimations = function(rootElement) {
	var animations = rootElement.getElementsByTagName('animation');

	this.animations = {};

	for(var i = 0; i < animations.length; i++){
		var id = this.reader.getString(animations[i], 'id', true);
		var span = this.reader.getFloat(animations[i], 'span', true);
		var type = this.reader.getString(animations[i], 'type', true);
		if(type == 'linear'){
			var controlPoints = this.parseControlPoints(animations[i]);
			this.animations[id] = new MyLinearAnimation(span, controlPoints);
		}
		else if(type == 'circular'){}
	}
};

// ===================================================================================================================================
// ===================================================== Components ==================================================================
// ===================================================================================================================================

// Reads all components from the components tag block
MySceneGraph.prototype.parseComponents = function(rootElement) {
	this.components = {};
	var components = rootElement.getElementsByTagName('component');
	for(var i = 0; i < components.length; i++){
		var myComponent = {};
		var id = this.reader.getString(components[i], 'id', true);
		if(this.components.hasOwnProperty(id))
			return "Non-Unique component id " + id;
		var error = this.parseChildren(components[i], myComponent);
		if(error != null){
			return error;
		}
		error = this.parseComponentMaterials(components[i], myComponent);
		if(error != null){
			return error;
		}
		error = this.parseComponentTextures(components[i], myComponent);
		if(error != null){
			return error;
		}
		error = this.parseComponentTransformations(components[i], myComponent);
		if(error != null){
			return error;
		}
		error = this.parseComponentAnimations(components[i], myComponent);
		if(error != null){
			return error;
		}
		myComponent.currentMaterial = 0;
		this.components[id] = myComponent;
	}
};

// Reads all children of a component
MySceneGraph.prototype.parseChildren = function(rootElement, component) {
	var primRefs = rootElement.getElementsByTagName('primitiveref');
	var compRefs = rootElement.getElementsByTagName('componentref');
	component.primitives = [];
	component.subComponents = [];

	for(i = 0; i < primRefs.length; i++){
		primId = this.reader.getString(primRefs[i], 'id', true);
		if (!this.primitives.hasOwnProperty(primId))
			return 'Reference to undefined primitive ' + primId;

		component.primitives.push(primId);
	}

	for(i = 0; i < compRefs.length; i++){
		compId = this.reader.getString(compRefs[i], 'id', true);
		component.subComponents.push(compId);
	}
};

// Reads a float value from xmlTag for each entry in getTags
MySceneGraph.prototype.getFloats = function(xmlTag, getTags){
	caughtValues = [];
	for(var i = 0; i < getTags.length; i++){
		caughtValues.push(this.reader.getFloat(xmlTag, getTags[i], true));
	}
	return caughtValues;
};

// Retrieves a material given the material block
MySceneGraph.prototype.getMaterial = function(rootElement){
	if(rootElement.children.length != 5){
		return null;
	}
	var materialParams = [0, 0, 0, 0, 0];
	for(var i = 0; i < rootElement.children.length; i++){
		switch(rootElement.children[i].tagName){
			case 'emission': materialParams[0] = this.getFloats(rootElement.children[i], ['r', 'g', 'b', 'a']); break;
			case 'ambient': materialParams[1] = this.getFloats(rootElement.children[i], ['r', 'g', 'b', 'a']); break;
			case 'diffuse': materialParams[2] = this.getFloats(rootElement.children[i], ['r', 'g', 'b', 'a']); break;
			case 'specular': materialParams[3] = this.getFloats(rootElement.children[i], ['r', 'g', 'b', 'a']); break;
			case 'shininess': materialParams[4] = this.reader.getInteger(rootElement.children[i], 'value', true); break;
			default: return null;
		}
	}
	var newMaterial = new CGFappearance(this.scene);
	newMaterial.setEmission(materialParams[0][0], materialParams[0][1], materialParams[0][2], materialParams[0][3], materialParams[0][4]);
	newMaterial.setAmbient(materialParams[1][0], materialParams[1][1], materialParams[1][2], materialParams[1][3], materialParams[1][4]);
	newMaterial.setDiffuse(materialParams[2][0], materialParams[2][1], materialParams[2][2], materialParams[2][3], materialParams[2][4]);
	newMaterial.setSpecular(materialParams[3][0], materialParams[3][1], materialParams[3][2], materialParams[3][3], materialParams[3][4]);
	newMaterial.setShininess(materialParams[4]);
	return newMaterial;
};

// Reads all materials existing in a component
MySceneGraph.prototype.parseComponentMaterials = function(rootElement, component) {
	var materials = rootElement.getElementsByTagName('material');
	component.materials = [];

	for(i = 0; i < materials.length; i++){
		materialId = this.reader.getString(materials[i], 'id', true);
		if (!this.materials.hasOwnProperty(materialId) && materialId != "null" && materialId != "inherit"){
			return 'Reference to undefined material ' + materialId;
		}
		component.materials.push(materialId);
	}
};

// Reads the given texture for a component
MySceneGraph.prototype.parseComponentTextures = function(rootElement, component) {
	var textures = rootElement.getElementsByTagName('texture');
	component.textures = [];

	for(i = 0; i < textures.length; i++){
		textureId = this.reader.getString(textures[i], 'id', true);
		if (!this.textures.hasOwnProperty(textureId) && textureId != "null"){
			return 'Reference to undefined texture ' + textureId;
		}
		component.textures.push(this.textures[textureId]);
	}
};

// Checks if the transformation tag is correct, either if it has the specific transformation tags or just a ref or both which gives an error
MySceneGraph.prototype.transformationKind = function(componentTransformations) {
	var hasRefs = 0, hasSpecifics = 0;

	for(var i = 0; i < componentTransformations.children.length; i++){
		if(componentTransformations.children[i].tagName == 'transformationref'){
			if(hasSpecifics != 0){
				return -1;
			}
			else {
				hasRefs = 1;
			}
		}
		else{
			if(hasRefs != 0){
				return -1;
			}
			else{
				hasSpecifics = 1;
			}
		}
	}

	if(hasRefs == 1){
		return 0;
	}
	else if(hasSpecifics == 1) {
		return 1;
	}
	else{
		return 2;
	}
};

// Reads the transformation ref fror a component
MySceneGraph.prototype.parseTransformationRefs = function(rootElement, component) {
	var transfRefs = rootElement.getElementsByTagName('transformationref');

	for(i = 0; i < transfRefs.length; i++){
		transfRefId = this.reader.getString(transfRefs[i], 'id', true);
		if (!this.transformations.hasOwnProperty(transfRefId))
			return 'Reference to undefined transformation ' + transfRefId;
		component.transformations.push(this.transformations[transfRefId]);
	}
};

// Reads all transformations for a component
MySceneGraph.prototype.parseComponentTransformations = function(rootElement, component) {
	component.transformations = [];
	var typeOfTransf = this.transformationKind(rootElement.getElementsByTagName('transformation')[0]);
	if(typeOfTransf == -1){
		return 'error, mixed tags in ' + rootElement.tagName;
	}
	if(typeOfTransf == 0){
			this.parseTransformationRefs(rootElement.getElementsByTagName('transformation')[0], component);
	}
	else if (typeOfTransf == 1) {
		var matrix = this.parseTransformation(rootElement.getElementsByTagName('transformation')[0]);
		if(matrix == null){
			return 'unknown tag in transformation';
		}
		component.transformations.push(matrix);
	}
};

MySceneGraph.prototype.parseComponentAnimations = function(rootElement, component){
	var animations = rootElement.getElementsByTagName('animationref');
	component.animations = [];

	for(i = 0; i < animations.length; i++){
		animationId = this.reader.getString(animations[i], 'id', true);
		if (!this.animations.hasOwnProperty(animationId)){
			return 'Reference to undefined animation ' + animationId;
		}
		component.animations.push(this.animations[animationId]);
	}
};

// ===================================================================================================================================
// ===================================================================================================================================
// ===================================================================================================================================


// Reads all attributes and components from the xml file
MySceneGraph.prototype.parseXML = function(rootElement) {

	if(!this.hasCorrectTags(rootElement)){
		console.log("Error, wrong tag order / number");
		return "ERROR";
	}

	this.parseScene(rootElement.getElementsByTagName('scene')[0]);

	error = this.parseViews(rootElement.getElementsByTagName('views')[0]);
	if(error != null){
		console.log(error);
		return error;
	}

	this.parseIllumination(rootElement.getElementsByTagName('illumination')[0]);

	error = this.parseLights(rootElement.getElementsByTagName('lights')[0]);
	if(error != null){
		console.log(error);
		return error;
	}

	error = this.parseTextures(rootElement.getElementsByTagName('textures')[0]);
	if(error != null){
		console.log(error);
		return error;
	}

	error = this.parseMaterials(rootElement.getElementsByTagName('materials')[0]);
	if(error != null){
		console.log(error);
		return error;
	}

	error = this.parseTransformations(rootElement.getElementsByTagName('transformations')[0]);
	if(error != null){
		console.log(error);
		return error;
	}

	error = this.parseAnimations(rootElement.getElementsByTagName('animations')[0]);
	if(error != null){
		console.log(error);
		return error;
	}

	error = this.parsePrimitives(rootElement.getElementsByTagName('primitives')[0]);
	if(error != null){
		console.log(error);
		return error;
}
	error = this.parseComponents(rootElement.getElementsByTagName('components')[0]);
	if(error != null){
		console.log(error);
		return error;
	}
	console.log("everythingloadedok!!!");
};

// ===================================================================================================================================
// ===================================================== Error Checking ==============================================================
// ===================================================================================================================================

// Checks if te xml has the correct tags in the correct order
MySceneGraph.prototype.hasCorrectTags = function(rootElement){
	var correctTags = ["scene", "views", "illumination", "lights", "textures", "materials", "transformations", "animations", "primitives", "components"];

	if(rootElement.children.length != correctTags.length)
		return false;

	for(var i = 0; i < rootElement.children.length; i++){
		if(rootElement.children[i].tagName != correctTags[i])
			return false;
	}
	return true;
};

// ===================================================================================================================================
// ===================================================================================================================================
// ===================================================================================================================================


/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error('XML Loading Error: '+message);
	this.loadedOk=false;
};
