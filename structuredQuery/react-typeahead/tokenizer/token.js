import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Token extends Component {

	_makeCloseButton() {
		if (!this.props.onRemove) {
			return;
		}

		const onClickClose = (event) => {
			this.props.onRemove(this.props.children);
			event.preventDefault();
		};

		return (
			<a 
				className="typeahead-token-close"
				href="#" 
				onClick={onClickClose.bind(this)}
			>
					&#x00d7;
			</a>
	       );
	}

	render() {
	
		return (
			<div
				{...this.props}
				className="typeahead-token"
			>
				{this.props.children['category']} {this.props.children['operator']} {this.props.children['value']}
				{this._makeCloseButton()}
			</div>
	       );
	}
}

Token.propTypes = {
	children: React.PropTypes.object,
	onRemove: React.PropTypes.func
};

export default Token;
