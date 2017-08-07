import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import DateUtil from './util/date';

class DateInput extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			value: this.safeDateFormat(this.props.date)
		};
	}

	componentDidMount() {
		this.toggleFocus(this.props.focus);
	}

	componentWillReceiveProps(newProps) {
		this.toggleFocus(newProps.focus);

		this.setState({
			value: this.safeDateFormat(newProps.date)
		});
	}

	toggleFocus(focus) {
		if (focus) {
			this.entry.getDOMNode().focus();
		} else {
			this.entry.getDOMNode().blur();
		}
	}

	handleChange(event) {
		let date = moment(event.target.value, this.props.dateFormat, true);

		this.setState({
			value: event.target.value
		});
	}

	safeDateFormat(date) {
		return !!date ? date.format(this.props.dateFormat) : null;
	}

	isValueAValidDate() {
		let date = moment(event.target.value, this.props.dateFormat, true);

		return date.isValid();
	}

	handleEnter(event) {
		if (this.isValueAValidDate()) {
			let date = moment(event.target.value, this.props.dateFormat, true);
			this.props.setSelected(new DateUtil(date));
		}
	}

	handleKeyDown(event) {
		switch (event.key) {
			case "Enter":
				event.preventDefault();
				this.handleEnter(event);
				break;
			case "Backspace":
				this.props.onKeyDown(event);
				break;
		}
	}

	handleClick(event) {
		this.props.handleClick(event);
	}

	render() {
		return (
			<input
				ref={entry => this.entry = entry}
				type="text"
				value={this.state.value}
				onClick={this.handleClick}
				onKeyDown={this.handleKeyDown}
				onFocus={this.props.onFocus}
				onChange={this.handleChange}
				className="datepicker__input"
				placeholder={this.props.placeholderText}
			/>
		);
	}
}

DateInput.propTypes = {
	onKeyDown: React.PropTypes.func
};

DateInput.defaultProps = {
	dateFormat: 'YYYY-MM-DD'
};

export default DateInput;
