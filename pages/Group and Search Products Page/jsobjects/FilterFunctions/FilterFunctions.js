export default {
	// Function to handle search as user types
	onSearchChange: async (searchTerm) => {
		await storeValue('search', searchTerm);
		if (searchTerm.length >= 2) { // Only search if 2 or more characters are entered
			const response = await getFilteredProducts.run({ search: searchTerm });
			storeValue('filteredProducts', response);
			resetWidget('lst_productList'); // Refresh the product list widget
		} else if (searchTerm.length === 0) {
			// If search is cleared, reset to show all products or initial state
			this.resetSearch(); // Call resetSearch directly
		}
	},

	// Function to reset search
	resetSearch: async () => {
		await storeValue('search', '');
		const response = await getFilteredProducts.run({}); // Fetch all products or initial state
		storeValue('filteredProducts', response);
		resetWidget('lst_productList');
	},

	// Function to update the price slider value
	updatePriceSlider: (value) => {
		storeValue('priceSliderValue', value);
	},

	// Function to update the sort order
	updateSortOrder: (order) => {
		storeValue('sortBy', order);
	},

	// Function to update selected filters (e.g., brands, types, concerns)
	updateFilter: (filterType, selectedValues) => {
		const currentFilters = appsmith.store.filter || {};
		currentFilters[filterType] = selectedValues;
		storeValue('filter', currentFilters);
	},

	// Function to reset all filters and restore defaults
	resetFilters: async () => {
		// Reset selected filter values
		resetWidget('CategoryFilter');
		resetWidget('BrandFilter');
		resetWidget('SkinConcernFilter');
		resetWidget('IngredientsFilter');
		resetWidget('SkinTypeFilter');
		resetWidget('sortBy');
		resetWidget('priceSliderValue');

		// Fetch all products and reset the filter state
		const response = await getAllProducts.run();
		storeValue('filteredProducts', response); // Store all products
		resetWidget('lst_productList'); // Refresh the product list widget
	},


	// Function to apply filters and fetch filtered products
	applyFilters: async () => {
		const filters = {
			maxPrice: appsmith.store.priceSliderValue,
			sortBy: appsmith.store.sortBy,
			brands: appsmith.store.filter?.brands || [],
			types: appsmith.store.filter?.types || [],
			avoidIngredients: appsmith.store.filter?.avoidIngredients || [],
			concerns: appsmith.store.filter?.concerns || []
		};

		// Call the API to get filtered products
		const response = await getFilteredProducts.run(filters);

		storeValue('filteredProducts', response);
		resetWidget('lst_productList'); // Refresh the product list widget
	},

	// Function to get select options for dropdown
	getSelectOptions: (data, labelKey, valueKey = 'value') => {
		let dupValues = data.map(row => { return { 'label': row[labelKey], 'value': row[valueKey] } });
		let output = {};
		dupValues.forEach(option => { output[option.label] = option });
		let outputProps = Object.getOwnPropertyNames(output);
		return outputProps.map(prop => output[prop]);
	},

	// Function to process filter options
	getProcessedFilterOptions: () => {
		return this.filterOptions.map(category => ({
			label: category.label,
			value: category.value,
			children: this.getSelectOptions(category.children, 'label', 'value')
		}));
	},

};

