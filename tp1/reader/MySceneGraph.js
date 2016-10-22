
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
	console.log("XML Loading finished.");
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

	// if (elems == null) {
	// 	//return "primitive element is missing.";
	// }

	this.scene.primitives = {};

	for (i = 0; i < primitives.length; i++){
		id = this.reader.getString(primitives[i], "id", true); //TODO: ver que erro dá se não existir
		if (primitives[i].childNodes.length != 1)
			return "Wrong number of primitive types - must be one!";
		switch(primitives[i].childNodes[0].tagName){
			case "rectangle":
				x0 = this.reader.getFloat(primitives[i], "x0", true);
				y0 = this.reader.getFloat(primitives[i], "y0", true);
				x1 = this.reader.getFloat(primitives[i], "x1", true);
				y1 = this.reader.getFloat(primitives[i], "y1", true);
				this.scene.primitives[id] = new MyRectangle(this.scene, id, x0, y0, x1, y1);
				break;
			case "triangle":
				x0 = this.reader.getFloat(primitives[i], "x0", true);
				y0 = this.reader.getFloat(primitives[i], "y0", true);
				z0 = this.reader.getFloat(primitives[i], "z0", true);
				x1 = this.reader.getFloat(primitives[i], "x1", true);
				y1 = this.reader.getFloat(primitives[i], "y1", true);
				z1 = this.reader.getFloat(primitives[i], "z1", true);
				x2 = this.reader.getFloat(primitives[i], "x2", true);
				y2 = this.reader.getFloat(primitives[i], "y2", true);
				z2 = this.reader.getFloat(primitives[i], "z2", true);
				this.scene.primitives[id] = new MyTriangle(this.scene, id, x0, y0, z0, x1, y1, z1, x2, y2, z2);
				break;
			case "cylinder":
				base = this.reader.getFloat(primitives[i], "base", true);
				top = this.reader.getFloat(primitives[i], "top", true);
				height = this.reader.getFloat(primitives[i], "height", true);
				slices = this.reader.getInteger(primitives[i], "slices", true);
				stacks = this.reader.getInteger(primitives[i], "stacks", true);
				this.scene.primitives[id] = new MyCylinder(this.scene, id, base, top, height, slices, stacks);
				break;
			case "sphere":
				radius = this.reader.getFloat(primitives[i], "radius", true);
				slices = this.reader.getInteger(primitives[i], "slices", true);
				stacks = this.reader.getInteger(primitives[i], "stacks", true);
				this.scene.primitives[id] = new MySphere(this.scene, id, radius, slices, stacks);
				break;
			case "torus":
				inner = this.reader.getFloat(primitives[i], "inner", true);
				outer = this.reader.getFloat(primitives[i], "outer", true);
				slices = this.reader.getInteger(primitives[i], "slices", true);
				loop = this.reader.getInteger(primitives[i], "loop", true);
				this.scene.primitives[id] = new MyTorus(this.scene, id, inner, outer, slices, loops);
				break;
			default:
				return "Unrecognized type of primitive: " + primitives[i].childNodes[0].tagName;
		}
	}
};

MySceneGraph.prototype.parseComponents = function(rootElement) {
	var components = rootElement.getElementsByTagName('component');
	for(i = 0; i < components.length; i++){
		myComponent.id = this.reader.getString(components[i], "id", true);
		parseChildren(rootElement, component);
	}

	// if (elems == null) {
	// 	//return "component element is missing.";
	// }
};

MySceneGraph.prototype.parseChildren = function(rootElement, component) {
	var primRefs = rootElement.getElementsByTagName('primitiveref');
	var compRefs = rootElement.getElementsByTagName('componentref');
	component.primitives = [];
	component.subComponents = [];

	for(i = 0; i < primRefs.length; i++){
		primId = this.reader.getString(primRefs[i], "id", true);
		if (!this.scene.primitives.hasOwnProperty(primId))
			return "Reference to undefined primitive " + primId;
		component.primitives.push(primId);
	}

	for(i = 0; i < compRefs.length; i++){
		compId = this.reader.getString(compRefs[i], "id", true);
		component.subComponents.push(compId);
	}
};

MySceneGraph.prototype.getRGBA = function(xmlTag){
	rgba = [];
	rgba[0]=this.reader.getFloat(xmlTag, "r", true);
	rgba[1]=this.reader.getFloat(xmlTag, "g", true);
	rgba[2]=this.reader.getFloat(xmlTag, "b", true);
	rgba[3]=this.reader.getFloat(xmlTag, "a", true);
	return rgba;
};

MySceneGraph.prototype.getMaterial = function(rootElement){
	if(rootElement.childNodes.length != 5){
		return null;
	}
	var materialParams = [0, 0, 0, 0, 0];
	for(var i = 0; i < rootElement.childNodes.length; i++){
		switch(rootElement.childNodes[i].tagName){
			case "emission": materialParams[0] = getRGBA(rootElement.childNodes[i]); break;
			case "ambient": materialParams[1] = getRGBA(rootElement.childNodes[i]); break;
			case "diffuse": materialParams[2] = getRGBA(rootElement.childNodes[i]); break;
			case "specular": materialParams[3] = getRGBA(rootElement.childNodes[i]); break;
			case "shininess": materialParams[4] = getInteger(rootElement.childNodes[i], "value", true); break;
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
		var id = this.reader.getString(materials[i], "id", true);
		var myMaterial = getMaterial(materials[i]);
		if(myMaterial == null){
			return "Error, invalid format on tag " + materials[i];
		}
		this.scene.materials[id] = myMaterial;
	}
};


MySceneGraph.prototype.parseComponentMaterials = function(rootElement, component) {
	var materials = rootElement.getElementsByTagName('material');
	component.materials = [];

	for(i = 0; i < materials.length; i++){
		materialId = this.reader.getString(materials[i], "id", true);
		if (!this.scene.primitives.hasOwnProperty(materialId))
			return "Reference to undefined material " + materialId;
		component.materials.push(this.scene.materials[materialId]);
	}
};

MySceneGraph.prototype.parseTextures = function(rootElement){
	this.scene.textures={};

	var textures = rootElement.getElementsByTagName('texture');

	for(var i=0; i < textures.length; i++){
		var id = this.reader.getString(textures[i], "id", true);
		var myTexture = {};
		myTexture.file = this.reader.getString(textures[i], "file", true);
		myTexture.length_s = this.reader.getString(textures[i], "length_s", true);
		myTexture.length_t = this.reader.getString(textures[i], "length_t", true);
		this.scene.textures[id] = myTexture;
	}
};

MySceneGraph.prototype.parseComponentTextures = function(rootElement, component) {
	var textures = rootElement.getElementsByTagName('texture');
	component.textures = [];

	for(i = 0; i < textures.length; i++){
		textureId = this.reader.getString(textures[i], "id", true);
		if (!this.scene.primitives.hasOwnProperty(textureId))
			return "Reference to undefined texture " + textureId;
		component.textures.push(this.scene.textures[textureId]);
	}
};

MySceneGraph.prototype.getTransformationValues = function(xmlTag, transformation){
	pos = [];
	if(transformation != "rotate"){
		pos[0]=this.reader.getFloat(xmlTag, "x", true);
		pos[1]=this.reader.getFloat(xmlTag, "y", true);
		pos[2]=this.reader.getFloat(xmlTag, "z", true);
	}
	else{
		var axis = this.reader.getString(xmlTag, "axis", true);
		var angle = this.reader.getString(xmlTag, "angle", true);
		pos[0] = angle * Math.PI / 180;
		pos[1] = pos[2] = pos[3] = 0;
		switch(axis){
			case "x": pos[1] = 1; break;
			case "y": pos[2] = 1; break;
			case "z": pos[3] = 1; break;
		}
	}
	return pos;
};

MySceneGraph.prototype.parseTransformation = function(transformationBlock) {
	this.scene.pushMatrix();
	var transfValues = [];
	for(var i = 0; i < transformationBlock.childNodes.length; i++){
		transfValues = this.getTransformationValues(transformationBlock.childNodes[i]);
		switch(childNodes[i].tagName){
			case "translate":
				this.scene.translate(transfValues[0], transfValues[1], transfValues[2]);
				break;
			case "scale":
				this.scene.scale(transfValues[0], transfValues[1], transfValues[2]);
				break;
			case "rotate":
				this.scene.rotate(transfValues[0], transfValues[1], transfValues[2], transfValues[3]);
				break;
			default:
				return "error wrong transformation tag " + childNodes[i].tagName;
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
		var id = this.reader.getString(transfs[i], "id", true);
		this.scene.transformations[id] = this.parseTransformation(transfs[i]);
	}
};

MySceneGraph.prototype.parseComponentTransformations = function(rootElement, component) {
	var transfRef = rootElement.getElementsByTagName('transformationref');
	component.transformation = [];

	for(i = 0; i < textures.length; i++){
		transfId = this.reader.getString(transfRef[i], "id", true);
		if (!this.scene.primitives.hasOwnProperty(transfId))
			return "Reference to undefined transformation " + transfId;
		component.textures.push(this.scene.transformations[transfId]);
	}
};

MySceneGraph.prototype.parseXML = function(rootElement) {

	error = this.parsePrimitives(rootElement);
	if(error != null)
		return error;

	error = this.parseComponents(rootElement);
	if(error != null)
		return error;

};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
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
