//this will mutate the tree passed in, so be sure to pass in a copy
export const setValue = (key, tree, op) => {
	key.replace(/\[(\w+)\]/g, '.$1').split('.')
	.reduce((root, prop, index, list) => {
		if(index === list.length-1) {
			root[prop] = op(root[prop]);
			return undefined;
		} else {
			if(!root[prop]) {
				root[prop] = {};
			}
			return root[prop];
		}}, 
		tree);
}

export const getValue = (key, tree) => {
	return key.replace(/\[(\w+)\]/g, '.$1').split('.')
	.reduce((root, prop, index, list) => {
		if(!root[prop]) {
			root[prop] = {};
		}
		return root[prop];
	}, tree);
}