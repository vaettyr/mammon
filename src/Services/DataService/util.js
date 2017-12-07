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
const dataToString = (data) => {
	if(!data.Data) {
		return data;
	}
	return {...data, Data:JSON.stringify(data.Data)};
}
const dataFromString = (data) => {
	if(!data.Data) 
		return data;
	return {...data, Data: JSON.parse(data.Data)};
}
export { structureToString };
export { structureFromString };
export { dataToString };
export { dataFromString };