import React, { Component } from 'react';
import TypeaheadSelector from './selector';
import KeyEvent from '../keyevent';
import DatePicker from '../../react-datepicker/datepicker';
import PropTypes from 'prop-types';
import moment from 'moment';
import fuzzy from 'fuzzy';
import onClickOutside from 'react-onclickoutside';
import classSet from 'react-classset';

// Typeahead an auto-completion text input
//
// Renders a text input that shows options nearby that you can
// use the keyboard or mouse to select.
// Requires CSS for MASSIVE DAMAGE!
class Typeahead extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			// set of all options
			options: this.props.options,
			header: this.props.header,
			datatype: this.props.datatype,
			focused: false,
			// current visible set of options
			visible: this.getOptionsForValue(
					this.props.defaultValue,
					this.props.options
				),
			entryValue: this.props.defaultValue,
			// A valid typeahead value
			selection: null
		};
	}


	componentWillReceiveProps(nextProps) {
		this.setState({
			options: nextProps.options,
			header: nextProps.header,
			datatype: nextProps.data,
			visible: nextProps.options
		});
	}

	getOptionsForValue(value, options) {
		let result = fuzzy.filter(value, options).map(res => {
			return res.string;
		});

		if (this.props.maxVisible) {
			result = result.slice(0, this.props.maxVisible);
		}

		return result;
	}
				
	setEntryText(context, value) {
		console.log('set entry text this', this);
		console.log('set entry text', context);
		if (context.typeahead.instanceRef.entry != null) {
			context.typeahead.instanceRef.entry.value = value;
		}
		this._onTextEntryUpdated(context);
	}

	_renderIncrementalSearchResults() {
		if (!this.state.focused) {
			return '';
		}

		// something was just selected
		if (this.state.selection) {
			return '';
		}

		// there are no typeahead / autocomplete suggestions
		if (!this.state.visible.length) {
			return '';
		}

		return (
			<TypeaheadSelector
				ref={sel => this.sel = sel}
				options={this.state.visible}
				header={this.state.header}
				onOptionSelected={this._onOptionSelected.bind(this)}
				customClasses={this.props.customClasses}
			/>
	       );
	}

	_onOptionSelected(option) {
		console.log(this);
		console.log('set on option selected', this.entry);
		let nEntry = this.entry;
		nEntry.focus();
		nEntry.value = option;

		this.setState({
			visible: this.getOptionsForValue(
						 option,
						 this.state.options
				),
			selection: option,
			entryValue: option
		});

		this.props.onOptionSelected(option);
	}

	_onTextEntryUpdated(context) {
		console.log('set entry text updated', context);
		let value = '';
		if (context.typeahead.instanceRef.entry != null) {
			value = context.typeahead.instanceRef.entry.value;
		}

		console.log('on text entry updated this', this);
		let options = this.state.options;

		this.setState({
			visible: this.getOptionsForValue(
						value, 
						options
				),
			selection: null,
			entryValue: value
		});
	}

	_onEnter(event) {
		if (!this.sel.state.selection) {
			return this.props.onKeyDown(event);
		}

		this._onOptionSelected(this.sel.state.selection);
	}

	_onEscape() {
		this.sel.setSelectionIndex(null);
	}

	_onTab(event) {
		let option = this.sel.state.selection ?
			this.sel.state.selection :
			this.state.visible[0];
		this._onOptionSelected(option)
	}

	// handle events on keyboard by user
	eventMap(event) {
		let events = {};

		events[KeyEvent.DOM_VK_UP] = this.sel.navUp;
		events[KeyEvent.DOM_VK_DOWN] = this.sel.navDown;
		events[KeyEvent.DOM_VK_RETURN] = events[KeyEvent.DOM_VK_ENTER] = this._onEnter;
		events[KeyEvent.DOM_VK_ESCAPE] = this._onEscape;
		events[KeyEvent.DOM_VK_TAB] = this._onTab;

		return events;
	}

	// handle user searching
	// @event: key pressed by user
	_onKeyDown(event) {
		// If enter pressed
		if (event.keyCode === KeyEvent.DOM_VK_RETURN || 
			event.keyCode === KeyEvent.DOM_VK_ENTER) {
			// if no options provided, we match on anything
			if (this.props.options.length === 0) {
				this._onOptionsSelected(this.state.entryValue);
			}

			// If what has been typed in is an exact match of one
			// of the options
			if (this.props.options.indexOf(this.state.entryValue) > -1) {
				this._onOptionSelected(this.state.entryValue);
			}
		}

		// if there are no visible elements, dont perform
		// selector navigation
		// Just pass this up to upstream onKeyDown handler
		if (!this.sel) {
			return this.props.onKeyDown(event);
		}

		let handler = this.eventMap()[event.keyCode];

		if (handler) {
			handler(event);
		} else {
			return this.props.onKeyDown(event);
		}

		// Don't propagate keystroke back to DOM/browser
		event.preventDefault();
	}

	// focus when user clicks inside of component
	_onFocus(event) {
		this.setState({
			focused: true
		});
	}

	// user clicks outside of the component, drop focus
	handleClickOutside(event) {
		this.setState({
			focused: false
		});
	}

	isDescendant(parent, child) {
		let node = child.parentNode;

		while (node != null) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}

		return false;
	}

	_handleDateChange(date) {
		this.props.onOptionSelected(date.format('YYYY-MM-DD'));
	}

	_showDatePicker() {
		if (this.state.type === 'date') {
			return true;
		}

		return false;
	}

	inputRef() {
		if (this._showDatePicker()) {
			return this.datepicker.refs.dateinput.refs.entry;
		} else {
			return this.entry;
		}
	}

	render() {
		let inputClasses = {};
		inputClasses[this.props.customClasses.input] = !!this.props.customClasses.input;
		let inputClassList = classSet(inputClasses);

		let classes = {
			typeahead: true
		};
		classes[this.props.className] = !!this.props.className;
		let classList = classSet(inputClasses);

		// Render date picker if data type is 'date'
		if (this._showDatePicker()) {
			return (
				<span
					ref={input => this.input = input}
					className={classList}
					onFocus={this._onFocus.bind(this)}
				>
					<DatePicker
						ref={datepicker => this.datepicker = datepicker}
						dateFormat={"YYYY-MM-DD"}
						selected={moment()}
						onChange={this._handleDateChange.bind(this)}
						onKeyDown={this._onKeyDown.bind(this)}
					/>
				</span>
			);
		}

		// Otherwise render the normal picker
		return (
			<span
				ref={input => this.input = input}
				className={classList}
				onFocus={this._onFocus.bind(this)}
			>
				<input
					ref={entry => this.entry = entry}
					type="text"
					placeholder={this.props.placeholder}
					className={inputClassList}
					defaultValue={this.state.entryValue}
					onChange={this._onTextEntryUpdated.bind(this)}
					onKeyDown={this._onKeyDown.bind(this)}
				/>
				{this._renderIncrementalSearchResults()}
			</span>
	       );
	}
}

Typeahead.propTypes = {
	customClasses: React.PropTypes.object,
	maxVisible: React.PropTypes.number,
	options: React.PropTypes.array,
	header: React.PropTypes.string,
	datatype: React.PropTypes.string,
	defaultValue: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	onOptionSelected: React.PropTypes.func,
	onKeyDown: React.PropTypes.func
};

Typeahead.defaultProps = {
	options: [],
	header: 'Category',
	datatype: 'text',
	customClasses: {},
	defaultValue: '',
	placeholder: '',
	onKeyDown: event => { return; },
	onOptionSelected: option => { }
};

export default onClickOutside(Typeahead);
