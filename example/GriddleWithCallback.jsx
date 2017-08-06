import React, { Component } from 'react';
import _ from 'underscore';
import Griddle from 'griddle-react';

const Loading = (props) => {
    return (
	<div className="loading">
		{this.props.loadingText || "Loading"}
	</div>
    );
}

const NextArrow = React.createElement('i', {className: "glyphicon glyphicon-chevron-right"}, null);
const PreviousArrow = React.createElement('i', {className: "glyphicon glyphicon-chevron-left"}, null);
const SettingsIconComponent = React.createElement('i', {className: "glyphicon glyphicon-cog"}, null);


class GriddleWithCallback extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			results: [],
			page: 0,
			maxPage: 0,
			sortColumn: null,
			sortAscending: true,
			initial: true	// Initialize to loading
		};
	}
		
	componentDidMount() {
		let newState = Object.assign({}, this.state, {
			pageSize: this.props.resultsPerPage
		});

		if (!this.hasExternalResults()) {
			console.error("When ussing GriddleWithCallback, a getExternalResults callback must be supplied.");
			return;
		}

		// Update state with external results mounting
		this.updateStateWithExternalResults(newState, updatedState => {
			this.setState(updatedState);
		});
	}

	componentWillReceiveProps(nextProps) {
		let newState = Object.assign({}, this.state, {
			page: 0,
			filter: nextProps.filter
		};

		this.updateStateWithExternalResults(newState, updatedState => {
			// if filter is null or undefined, reset filter
			if (_.isUndefined(nextProps.filter) ||
				_.isNull(nextProps.filter) ||
				_.isEmpty(nextProps.filter)) {
					updatedState.filter = nextProps.filter;
					updatedState.filteredResults = null;
				}

			// Set the state
			this.setState(updatedState);
		});
	}

	// Utility function
	setDefault(original, value) {
		return typeof original === 'undefined' ? value : original;
	}

	setPage(index, pageSize) {
		// this should interact with the data source to get the page at the given index
		let newState = Object.assign({}, this.state, {
			page: index,
			pageSize: this.setDefault(pageSize, this.state.pageSize)
		});

		this.updateStateWithExternalResults(newState, updatedState => {
			this.setState(updatedState);
		})
	}

	getExternalResults(state, callback) {
		let filter, sortColumn, sortAscending, page, pageSize;

		// Fill the search properties
		if (state !== undefined && state.filter !== undefined) {
			filter = state.filter;
		} else {
			filter = this.state.filter;
		}

		if (state !== undefined && state.sortColumn !== undefined) {
			sortColumn = state.sortColumn;
		} else {
			sortColumn = this.state.sortColumn;
		}

		sortColumn = _.isEmpty(sortColumn) ? this.props.initialSort : sortColumn;

		if (state !== undefined && state.sortAscending !== undefined) {
			sortAscending = state.sortAscending;
		} else {
			sortAscending = this.state.sortAscending;
		}

		if (state !== undefined && state.page !== undefined) {
			page = state.page;
		} else {
			page = this.state.page;
		}

		if (state !== undefined && state.pageSize !== undefined) {
			pageSize = state.pageSize;
		} else {
			pageSize = this.state.pageSize;
		}

		// Obtain the results
		this.props.getExternalResults(
				filter,
				sortColumn,
				sortAscending,
				page,
				pageSize,
				callback);
	}

	updateStateWithExternalResults(state, callback) {
		// Update table to indicate that it's loading
		this.setState({
			isLoading: true
		});
		// Grab the results
		this.getExternalResults(state, externalResults => {
			// Full the state result properties
			if (this.props.enableInfiniteScroll && this.state.results) {
				state.results = this.state.results.concat(externalResults.results);
			} else {
				state.results = externalResults.results;
			}

			state.totalResults = externalResults.totalResults;
			state.maxPage = this.getMaxPage(
				externalResults.pageSize,
				externalResults.totalResults
			);
			state.isLoading = false;

			// If current page is larger than max page, reset page
			if (state.page >= state.maxPage) {
				state.page = state.maxPage - 1;
			}

			callback(state);
		});
	}

	getMaxPage(pageSize, totalResults) {
		if (!totalResults) {
			totalResults = this.state.totalResults;
		}

		return Math.ceil(totalResults / pageSize);
	}

	hasExternalResults() {
		return typeof(this.props.getExternalResults) === 'function';
	}

	changeSort(sort, sortAscending) {
		// this should change the sort for the given column
		let newState = Object.assign({}, this.state, {
			page: 0,
			sortColumn: sort,
			sortAscending: sortAscending
		};

		this.updateStateWithExternalResults(newState, updatedState => {
			this.setState(updatedState);
		})
	}

	setFilter(filter) {
		// no-op
	}

	setPageSize(size) {
		this.setPage(0, size);
	}

	render() {
		return (
			<Griddle
				{...this.props}
				useExternal={true}
				externalSetPage={this.setPage}
				externalChangeSort={this.changeSort}
				externalSetFilter={this.setFilter}
				externalSetPageSize={this.setPageSize}
				externalMaxPage={this.state.maxPage}
				externalCurrentPage={this.state.page}
				results={this.state.results}
				tableClassName="table"
				resultsPerPage={this.state.pageSize}
				externalSortColumn={this.state.sortColumn}
				externalSortAscending={this.state.sortAscending}
				externalLoadingComponent={this.props.loadingComponent}
				externalIsLoading={this.state.isLoading}
				loadingComponent={Loading}
				nextIconComponent={NextArrow}
				previousIconComponent={PreviousArrow}
				settingsIconComponent={SettingsIconComponent}
				settingsText="Settings "
				showSettings={true}
				useGriddleStyles={false}
				enableSort={true}
				showFilter={false}
			/>
		);
	}
}

GriddleWithCallback.defaultProps = {
    getExternalResults: null,
    resultsPerPage: 10,
    loadingComponent: null,
    enableInfiniteScroll: false,
    filter: ''
};

export default GriddleWithCallback;
