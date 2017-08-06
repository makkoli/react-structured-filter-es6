import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';


class TypeaheadOption extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hover: false
		};
	}

	_getClasses() {
		let classes = {
			"typeahead-option": true
		};

		classes[this.props.customClasses.listAnchor] = !!this.props.customClasses.listAnchor;
		return classSet(classes);
	}

	// prevent default when clicking an option
	_onClick() {
		return this.props.onClick();
	}

	// render all options for the category
	render() {
		return (
			<li className={classList} onClick={this._onClick}>
				<a
					href="#"
					className={this._getClasses()}
					ref={anchor => this.anchor = anchor}
				>
					{this.props.children}
				</a>
			</li>
	       );
	}
}

TypeaheadOption.propTypes = {
	customClasses: React.PropTypes.object,
	onClick: React.PropTypes.func,
	children: React.PropTypes.string
};

TypeaheadOption.defaultProps = {
	customClasses: {},
	onClick: event => { event.preventDefault(); }
}

export default TypeaheadOption;
