import React from 'react';

export function addPropsToChildren(children, props) {
	return React.Children.map(children, (child) => {
		return React.cloneElement(child, props);
	});
}
