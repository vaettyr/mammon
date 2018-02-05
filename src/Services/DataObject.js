import * as actions from 'Store/actionTypes';
import * as http from 'axios';
const endpoint = "DataSource.php";
//this creates an instance of a DataSource
class DataObject {
	constructor(structure, type, endpoint) {
		this.structure = structure;
		this.type = type;
		//if(endpoint)
		//	this.endpoint = endpoint;
	}
	
	serialize(data) {
		//takes data from the user and puts it in data-base ready format
		let serialized = {Data:{}};
		this.structure.forEach((section) => {
			let sectionname = section.Name.replace(/\W/g, '_');
			if(section.Base) {
				if(section.Type === 'flat') {
					section.Contents.forEach((item) => {
						let itemname = item.Name.replace(/\W/g, '_');
						if(item.Base) {
							if(typeof data[sectionname][itemname] === 'object') {
								Object.keys(data[sectionname][itemname]).forEach((sub) => {
									serialized[itemname+"_"+sub] = data[sectionname][itemname][sub];
								});
							} else {
								serialized[itemname] = data[sectionname][itemname];
							}							
						} else {
							if(!serialized.Data[sectionname]){
								serialized.Data[sectionname] = {};
							}
							serialized.Data[sectionname][itemname] = data[sectionname][itemname];
						}
					});
				} else {
					serialized[sectionname] = [];
					if(data[sectionname]) {
						data[sectionname].forEach((entry) => {
							let listentry = {Data:{}};
							section.Contents.forEach((item) => {
								let itemname = item.Name.replace(/\W/g,'_');
								if(item.Base) {
									if(typeof entry[itemname] === 'object') {
										Object.keys(entry[itemname]).forEach((sub) => {
											listentry[itemname+"_"+sub] = entry[itemname][sub];
										});
									} else {
										listentry[itemname] = entry[itemname];
									}
								} else {
									listentry.Data[itemname] = entry[itemname];
								}
							});
							//get any missing simple items and patch them in
							let skipped = Object.keys(entry).filter((bit) => listentry[bit] === undefined && typeof entry[bit] !== 'object');
							skipped.forEach((skip) => {
								listentry[skip] = entry[skip];
							});
							listentry.Data = JSON.stringify(listentry.Data);
							serialized[sectionname].push(listentry);
						});
					}
				}
			} else {
				serialized.Data[sectionname] = data[sectionname];
			}
		});
		serialized.Data = JSON.stringify(serialized.Data);
		this.data = serialized;
		return serialized;
	}
	
	deserialize(data) {
		//takes data from the server and parses back out to our structure
		return data;
	}
	
	on(data, trigger) {
		let query = "?source="+this.type+"&trigger="+trigger;
		http.post(process.env.REACT_APP_API + endpoint+query, data)
		.then(response => {
			debugger;
		});
	}
	
	save(dispatch, data, config) {
		if(!data) 
			data = this.data;		
		let endpoint = this.endpoint; 
		if(config) {
			if(config.endpoint)
				endpoint = config.endpoint;
			if(config.query) 
				endpoint += '?' + config.query;
		}
		dispatch({type: actions.CREATE_DATA_START, table: this.type, source: this.type });
		http.post(process.env.REACT_APP_API + endpoint, data)
			.then((response) => {
				let deserialized = this.deserialize(response.data);
				dispatch({type: actions.CREATE_DATA_END, table: this.type, data: deserialized});
				if(config && config.then) 
					config.then(response.data);
			})
			.catch((error) => {
				dispatch({type: actions.CREATE_DATA_ERROR, table: this.type, error: error});
				if(config && config.catch) {
					config.catch(error);
				}
			});
	}
}

export default DataObject;