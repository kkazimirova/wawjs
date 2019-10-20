/*
Implementation of "better" introspection functions
Just as an excercise, 
some of them may be useful in real life as well
*/
module.exports = {
  allOwnKeys,
  allOwnValues,
  allOwnEntries,
  getProtoChain,
  allKeys,
  forIn,
  shallowClone,
  hasInheritedProperty,
  hasOverridenProperty
};
// Object.keys supporting Symbols and non-enumerables 
function allOwnKeys(o) {
	return Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o));
}
// Object.values supporting Symbols and non-enumerables 
function allOwnValues(o) {
	return allOwnKeys(o).map(function (property) {
		return o[property];
	});
}
// Object.entries supporting Symbols and non-enumerables 
function allOwnEntries(o) {
    return allOwnKeys(o).map(function (property) {
    	return [property, o[property]];
    });
}
// [obj,...protos] array of objects in proto chain
// starting with obj itself and up-the chain
function getProtoChain(obj) {
	if (Object.getPrototypeOf(obj) === null) {
		return [obj];
	}
	else {
		return [obj].concat(getProtoChain(Object.getPrototypeOf(obj)));
	}
}
// Object.keys including, inherited, not-enumeble, symbols  
function allKeys(obj) {
	return [].concat(...getProtoChain(obj).map(function (o) {
		return allOwnKeys(o);
	}));

}

// for..in loop supporting Symbols and non-enumerable
// for own and inherited properties
function forIn(obj, callback) {
	allKeys(obj).map(function (property) {
		callback(property);
	});
  
}
// create copy of object 
// with same propereties, 
// including symbols, 
// same values 
// and same property ownership 
function shallowClone(obj) {
	if (obj === null) {
		return null;
	}

	let clone = Object.create(Object.getPrototypeOf(obj));
	let descriptors = Object.getOwnPropertyDescriptors(obj);

	for (key of allOwnKeys(obj)) {
		let descriptor = descriptors[key];

		Object.defineProperty(clone, key, {
			writable: descriptor.writable,
			value: descriptor.value,
			enumerable: descriptor.enumerable,
			configurable: descriptor.configurable
		})
		
	}

	return clone;
}

// if the property exists only in proto chain
// not on object
function hasInheritedProperty(obj, prop) {
  	let all = allKeys(obj);
  	let ownKeys = allOwnKeys(obj);

  	let difference = all.filter(function (x) {
  		return !ownKeys.includes(x);
  	});

  	return difference.includes(prop);
}

function hasOverridenProperty(obj, prop) {
	let parents = allKeys(Object.getPrototypeOf(obj));
	let ownKeys = allOwnKeys(obj);

	let common = parents.filter(function (x) {
		return ownKeys.includes(x);
	});

	return common.includes(prop);
}