import React, { Component } from 'react';
import moment from 'moment';
import classSet from 'react-classset';

class Day extends Component {

	handleClick(event) {
		if (this.props.disabled) {
			return;
		}

		this.props.onClick(event);
	}

	render() {
		let classes = classSet({
			'datepicker__day': true,
			'datepicker__day--disabled': this.props.disabled,
			'datepicker__day--selected': this.props.day.sameDay(this.props.selected),
			'datepicker__day--today': this.props.day.sameDay(moment())
		});

		return (
			<div
				className={classes}
				onClick={this.handleClick}
			>
			</div>
		);
	}
}

export default Day;
