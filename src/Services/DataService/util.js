const structureToString = (data) => {
	if(!data.Structure)
		return data;
	let Structure = {};
	data.Structure.forEach(item=>{
		Structure[item.Name] = {...item, Name: undefined};
	});
	return {...data, Structure: JSON.stringify(Structure)};
}
const structureFromString = (data) => {
	if(!data.Structure)
		return data;
	let Structure = [], struct = JSON.parse(data.Structure);
	Object.keys(struct).forEach(item => {
		Structure.push({Name: item, ...struct[item]});
	});
	return {...data, Structure: Structure};
}
const serializeData = (data, keys) => {
	if(!keys) { return data; }
	let serialized = {...data};
	keys.forEach((key) => {
		if(data[key]) {
			try {
				serialized = {...serialized, [key]: JSON.stringify(data[key])};
			} catch(e) {
				serialized = {...serialized, [key]:e};
			}
		}		
	});
	return serialized;
}

const deserializeData = (data, keys) => {
	if(!keys) { return data; }
	let deserialized = {...data};
	keys.forEach((key) => {
		if(data[key]) {
			try {
				deserialized = {...deserialized, [key]: JSON.parse(data[key])};
			} catch(e) {
				deserialized = {...deserialized, [key]: e};
			}		
		}
	});
	return deserialized;
}
export { structureToString };
export { structureFromString };
export { serializeData };
export { deserializeData };
