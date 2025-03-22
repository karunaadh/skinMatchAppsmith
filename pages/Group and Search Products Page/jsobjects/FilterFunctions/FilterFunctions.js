export default {
	onOpen: async () => {
		await storeValue('search', appsmith.store?.search || '');
		await storeValue('filter', appsmith.store?.filter || {});
		await storeValue('priceSliderValue', appsmith.store?.priceSliderValue || '150'); // Default max price
		await storeValue('sortBy', appsmith.store?.sortBy || ''); 
	},

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

	// Function to reset all filters
	resetFilters: async () => {
		await storeValue('filter', {}); // Clear all filters
		await storeValue('priceSliderValue', '150'); // Reset price slider to default
		await storeValue('sortBy', ''); // Reset sort order to default
		await resetWidget('filter');
		await resetWidget('priceSliderValue');
		await resetWidget('sortBy');
		await this.applyFilters();
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

	// Filter options data
	filterOptions: [
		{
			"label": "Category",
			"value": "category",
			"children": [
				{ "label": "Toner", "value": "Toner" },
				{ "label": "Sunscreen", "value": "Sunscreen" },
				{ "label": "Cleanser", "value": "Cleanser" },
				{ "label": "Exfoliator", "value": "Exfoliator" },
				{ "label": "Moisturizer", "value": "Moisturizer" }
			]
		},
		{
			"label": "Brand",
			"value": "brands",
			"children": getAllBrands.data.map(brand => ({ label: brand, value: brand }))
		},
		{
			"label": "Skin Concern",
			"value": "concerns",
			"children": getAllConcerns.data.map(concern => ({ label: concern.description, value: concern.concernId }))
		},
		{
			"label": "Ingredients to Avoid",
			"value": "avoidIngredients",
			"children": getAllIngredients.data.map(ingredient => ({ label: ingredient.ingredientName, value: ingredient.ingredientId }))
		},
		{
			"label": "Skin Types",
			"value": "types",
			"children": getAllSkinTypes.data.map(type => ({ label: type.description, value: type.skintypeId }))
		}
	]
};

