import React, { Component } from 'react';
import Griddle from 'griddle-react';
import GriddleWithCallback from './GriddleWithCallBack.jsx';
import StructuredFilter from '../src/index';

import ExampleData from './ExampleData.jsx';

class ExampleTable extends Component {

    constructor(props) {
	super(props);

	this.state = {
	    filter: ''
	};
    }

    getJsonData(filterString, sortColumn, sortAscending, page, pageSize, callback) {
	thisComponent = this;

	if (filterString == undefined) {
	    filterString = '';
	}
	if (sortColumn == undefined) {
	    sortColumn = '';
	}

	// Normally you would make a request to server here
	let results = this.refs.ExampleData.filter(
		filterString,
		sortColumn,
		sortAscending,
		page,
		pageSize);
	callback(results);
    }

    updateFilter(filter) {
	// Set our filter to json data of the current filter tokens
	this.setState({
	    filter: JSON.stringify(filter)
	});
    }

    getSymbolOptions() {
	return this.refs.ExampleData.getSymbolOptions();
    }

    getSectorOptions() {
	return this.refs.ExampleData.getSectorOptions();
    }

    getIndustryOptions() {
	return this.refs.ExampleData.getIndustryOptions();
    }

    render() {
	return (
		<div>
			<StructuredFilter
				placeholder=""
				options={[
					{category:"Symbol", type:"textoptions", options:this.getSymbolOptions},
					{category:"Name",type:"text"},
					{category:"Price",type:"number"},
					{category:"MarketCap",type:"number"},
					{category:"IPO", type:"date"},
					{category:"Sector", type:"textoptions", options:this.getSectorOptions},
					{category:"Industry", type:"textoptions", options:this.getIndustryOptions}
				]}
				customClasses={{
					input: "filter-tokenizer-text-input",
					results: "filter-tokenizer-list__container",
					listItem: "filter-tokenizer-list__item"
				}}
				onTokenAdd={this.updateFilter}
				onTokenRemove={this.updateFilter}
			/>
			<GriddleWithCallback
				getExternalResults={this.getJsonData}
				filter={this.state.filter}
				resultsPerPage={10}
			/>
			<ExampleData ref={ExampleData => this.ExampleData = ExampleData} />
		</div>
	);
    }
}


export default ExampleTable;
