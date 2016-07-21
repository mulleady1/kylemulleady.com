import React from 'react';

export default class Button extends React.Component {
	render() {
		const { processing, onClick } = this.props,
			text = processing ? 'PROCESSING...' : 'SUBMIT';

		return (
			<button
				disabled={processing} 
				onClick={onClick}>{text}</button>
		);
	}
}
