
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

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var primitives = rootElement.getElementsByTagName('primitive');

	this.scene.primitives = {};

	for(var i = 0; i < primitives.length; i++){
		id = this.reader.getString(primitives[i], 'id', true); //TODO: ver que erro dá se não existir
		if (primitives[i].children.length != 1)
			return 'Wrong number of primitive types - must be one!';
		switch(primitives[i].children[0].tagName){
			case 'rectangle':
				x1 = this.reader.getFloat(primitives[i].children[0], 'x1', true);
				y1 = this.reader.getFloat(primitives[i].children[0], 'y1', true);
				x2 = this.reader.getFloat(primitives[i].children[0], 'x2', true);
				y2 = this.reader.getFloat(primitives[i].children[0], 'y2', true);
				this.scene.primitives[id] = new MyRectangle(this.scene, id, x1, y1, x2, y2);
				break;
			case 'triangle':
				x1 = this.reader.getFloat(primitives[i].children[0], 'x1', true);
				y1 = this.reader.getFloat(primitives[i].children[0], 'y1', true);
				z1 = this.reader.getFloat(primitives[i].children[0], 'z1', true);
				x2 = this.reader.getFloat(primitives[i].children[0], 'x2', true);
				y2 = this.reader.getFloat(primitives[i].children[0], 'y2', true);
				z2 = this.reader.getFloat(primitives[i].children[0], 'z2', true);
				x3 = this.reader.getFloat(primitives[i].children[0], 'x3', true);
				y3 = this.reader.getFloat(primitives[i].children[0], 'y3', true);
				z3 = this.reader.getFloat(primitives[i].children[0], 'z3', true);
				this.scene.primitives[id] = new MyTriangle(this.scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				break;
			case 'cylinder':
				base = this.reader.getFloat(primitives[i].children[0], 'base', true);
				top = this.reader.getFloat(primitives[i].children[0], 'top', true);
				height = this.reader.getFloat(primitives[i].children[0], 'height', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				stacks = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
				this.scene.primitives[id] = new MyCylinder(this.scene, id, base, top, height, slices, stacks);
				break;
			case 'sphere':
				radius = this.reader.getFloat(primitives[i].children[0], 'radius', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				stacks = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
				this.scene.primitives[id] = new MySphere(this.scene, id, radius, slices, stacks);
				break;
			case 'torus':
				inner = this.reader.getFloat(primitives[i].children[0], 'inner', true);
				outer = this.reader.getFloat(primitives[i].children[0], 'outer', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				loops = this.reader.getInteger(primitives[i].children[0], 'loops', true);
				this.scene.primitives[id] = new MyTorus(this.scene, id, inner, outer, slices, loops);
				break;
			default:
				return 'Unrecognized type of primitive: ' + primitives[i].children[0].tagName;
		}
	}
};

MySceneGraph.prototype.parseComponents = function(rootElement) {
	this.scene.components = {};
	var components = rootElement.getElementsByTagName('component');
	for(var i = 0; i < components.length; i++){
		var myComponent = {};
		var id = this.reader.getString(components[i], 'id', true);
		this.parseChildren(rootElement, myComponent);
		this.parseComponentMaterials(components[i], myComponent);
		this.parseComponentTextures(components[i], myComponent);
		this.parseComponentTransformations(components[i], myComponent);
		this.scene.components[id] = myComponent;
	}

	// if (elems == null) {
	// 	//return 'component element is missing.';
	// }
};

MySceneGraph.prototype.parseChildren = function(rootElement, component) {
	var primRefs = rootElement.getElementsByTagName('primitiveref');
	var compRefs = rootElement.getElementsByTagName('componentref');
	component.primitives = [];
	component.subComponents = [];

	for(i = 0; i < primRefs.length; i++){
		primId = this.reader.getString(primRefs[i], 'id', true);
		if (!this.scene.primitives.hasOwnProperty(primId))
			return 'Reference to undefined primitive ' + primId;
		component.primitives.push(primId);
	}

	for(i = 0; i < compRefs.length; i++){
		compId = this.reader.getString(compRefs[i], 'id', true);
		component.subComponents.push(compId);
	}
};

MySceneGraph.prototype.getRGBA = function(xmlTag){
	rgba = [];
	rgba[0]=this.reader.getFloat(xmlTag, 'r', true);
	rgba[1]=this.reader.getFloat(xmlTag, 'g', true);
	rgba[2]=this.reader.getFloat(xmlTag, 'b', true);
	rgba[3]=this.reader.getFloat(xmlTag, 'a', true);
	return rgba;
};

MySceneGraph.prototype.getMaterial = function(rootElement){
	if(rootElement.children.length != 5){
		return null;
	}
	var materialParams = [0, 0, 0, 0, 0];
	for(var i = 0; i < rootElement.children.length; i++){
		switch(rootElement.children[i].tagName){
			case 'emission': materialParams[0] = this.getRGBA(rootElement.children[i]); break;
			case 'ambient': materialParams[1] = this.getRGBA(rootElement.children[i]); break;
			case 'diffuse': materialParams[2] = this.getRGBA(rootElement.children[i]); break;
			case 'specular': materialParams[3] = this.getRGBA(rootElement.children[i]); break;
			case 'shininess': materialParams[4] = getInteger(rootElement.children[i], 'value', true); break;
			default: return null;
		}
		var newMaterial = new CGFappearance(this.scene);
		newMaterial.setEmission(materialParams[0][0], materialParams[0][1], materialParams[0][2], materialParams[0][3], materialParams[0][4]);
		newMaterial.setAmbient(materialParams[1][0], materialParams[1][1], materialParams[1][2], materialParams[1][3], materialParams[1][4]);
		newMaterial.setDiffuse(materialParams[2][0], materialParams[2][1], materialParams[2][2], materialParams[2][3], materialParams[2][4]);
		newMaterial.setSpecular(materialParams[3][0], materialParams[3][1], materialParams[3][2], materialParams[3][3], materialParams[3][4]);
		newMaterial.setShininess(materialParams[4]);
		return newMaterial;
	}
};

MySceneGraph.prototype.parseMaterials = function(rootElement){
	this.scene.materials={};

	var materials = rootElement.getElementsByTagName('material');

	for(var i=0; i < materials.length; i++){
		var id = this.reader.getString(materials[i], 'id', true);
		var myMaterial = this.getMaterial(materials[i]);
		if(myMaterial == null){
			return 'Error, invalid format on tag ' + materials[i];
		}
		this.scene.materials[id] = myMaterial;
	}
};


MySceneGraph.prototype.parseComponentMaterials = function(rootElement, component) {
	var materials = rootElement.getElementsByTagName('material');
	component.materials = [];

	for(i = 0; i < materials.length; i++){
		materialId = this.reader.getString(materials[i], 'id', true);
		if (!this.scene.primitives.hasOwnProperty(materialId))
			return 'Reference to undefined material ' + materialId;
		component.materials.push(this.scene.materials[materialId]);
	}
};

MySceneGraph.prototype.parseTextures = function(rootElement){
	this.scene.textures={};

	var textures = rootElement.getElementsByTagName('texture');

	for(var i=0; i < textures.length; i++){
		var id = this.reader.getString(textures[i], 'id', true);
		var myTexture = {};
		myTexture.file = this.reader.getString(textures[i], 'file', true);
		myTexture.length_s = this.reader.getString(textures[i], 'length_s', true);
		myTexture.length_t = this.reader.getString(textures[i], 'length_t', true);
		this.scene.textures[id] = myTexture;
	}
};

MySceneGraph.prototype.parseComponentTextures = function(rootElement, component) {
	var textures = rootElement.getElementsByTagName('texture');
	component.textures = [];

	for(i = 0; i < textures.length; i++){
		textureId = this.reader.getString(textures[i], 'id', true);
		if (!this.scene.primitives.hasOwnProperty(textureId))
			return 'Reference to undefined texture ' + textureId;
		component.textures.push(this.scene.textures[textureId]);
	}
};

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

MySceneGraph.prototype.parseTransformation = function(transformationBlock) {
	this.scene.pushMatrix();
	var transfValues = [];

	for(var i = 0; i < transformationBlock.children.length; i++){
		transfValues = this.getTransformationValues(transformationBlock.children[i]);
		switch(transformationBlock.children[i].tagName){
			case 'translate':
				this.scene.translate(transfValues[0], transfValues[1], transfValues[2]);
				break;
			case 'scale':
				this.scene.scale(transfValues[0], transfValues[1], transfValues[2]);
				break;
			case 'rotate':
				this.scene.rotate(transfValues[0], transfValues[1], transfValues[2], transfValues[3]);
				break;
			default:
				return null;
		}
	}
	var transformationMatrix = this.scene.getMatrix();
	this.scene.popMatrix();
	return transformationMatrix;
};

MySceneGraph.prototype.parseTransformations = function(rootElement) {
	this.scene.transformations = {};

	var transfs = rootElement.getElementsByTagName('transformation');
	for(var i = 0; i < transfs.length; i++){
		var id = this.reader.getString(transfs[i], 'id', true);
		this.scene.transformations[id] = this.parseTransformation(transfs[i]);
	}
};

MySceneGraph.prototype.transformationKind = function(componentTransformations) {
	var hasRefs = 0, hasSpecifics = 0;
	for(var i = 0; i < componentTransformations; i++){
		if(componentTransformations[i] == 'transformationref'){
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

MySceneGraph.prototype.parseTransformationRefs = function(rootElement, component) {
	var transfRefs = rootElement.getElementsByTagName('transformationref');

	for(i = 0; i < transfRefs.length; i++){
		transfRefId = this.reader.getString(transfRefs[i], 'id', true);
		if (!this.scene.transformations.hasOwnProperty(transfId))
			return 'Reference to undefined transformation ' + transfId;
		component.transformations.push(this.scene.transformations[transfId]);
	}
};

MySceneGraph.prototype.parseComponentTransformations = function(rootElement, component) {
	component.transformations = [];
	var typeOfTransf = this.transformationKind(rootElement);
	if(typeOfTransf == -1){
		return 'error, mixed tags in ' + rootElement.tagName;
	}
	if(typeOfTransf == 0){
			this.parseTransformationRefs(rootElement, component);
	}
	else if (typeOfTransf == 1) {
		var matrix = this.parseTransformation(rootElement);
		if(matrix == null){
			return 'unknown tag in transformation';
		}
		component.transformations.push(matrix);
	}
};

MySceneGraph.prototype.parseXML = function(rootElement) {

	this.parseTextures(rootElement.getElementsByTagName('textures')[0]);

	this.parseMaterials(rootElement.getElementsByTagName('materials')[0]);

	this.parseTransformations(rootElement.getElementsByTagName('transformations')[0]);

	error = this.parsePrimitives(rootElement.getElementsByTagName('primitives')[0]);
	if(error != null)
		return error;

	error = this.parseComponents(rootElement.getElementsByTagName('components')[0]);
	if(error != null)
		return error;
	console.log("everythingloadedok!!!");
	console.log(this.scene.primitives);
	console.log(this.scene.components);

};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error('XML Loading Error: '+message);
	this.loadedOk=false;
};


MySceneGraph.prototype.displayComponent=function(component) {
	for (var i=0; i < component.subComponents; i++){
		var subComponentID = component.subComponents[i];
		this.displayComponent(this.scene.components[subComponentID]);
	}

	for(i=0; i < component.primitives; i++){
		var primitiveID = component.primitives[i];
		this.scene.primitives[primitiveID].display();
	}

};
