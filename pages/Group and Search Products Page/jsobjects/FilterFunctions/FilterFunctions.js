export default {
	//Load products
	onLoad: () => {
		// Fetch all products and reset the filter state
		const response = getAllProducts.data;
		storeValue('filteredProducts', response); // Store all products
	},

	// Function to handle search as user types
	onSearchChange: (searchTerm) => {
		// Get the current list of products
		const currentProducts = appsmith.store.filteredProducts;

		// Filter products based on the search term
		if (searchTerm.length >= 2) {
			console.log(">2")
			// Only search if 2 or more characters are entered
			const searchResults = currentProducts.filter(product =>											 product.name.toLowerCase().includes(searchTerm.toLowerCase())
																									);
			//Return search results
			return searchResults;
		} else {
			console.log("else<2")
			return appsmith.store.filteredProducts;
		}
	},

	// Function to reset all filters and restore defaults
	resetFilters: () => {
		// Reset selected filter values
		resetWidget('CategoryFilter');
		resetWidget('BrandFilter');
		resetWidget('SkinConcernFilter');
		resetWidget('IngredientsFilter');
		resetWidget('SkinTypeFilter');
		resetWidget('sortBy');
		resetWidget('priceSliderValue');

		// // Fetch all products and reset the filter state
		// const response = getAllProducts.data;
		// storeValue('filteredProducts', response); // Store all products
		// resetWidget('List1'); // Refresh the product list widget
	},

	// Function to apply filters and fetch filtered products
	applyFilters: () => {
		//Set Parameters
		const params = {
			maxPrice: priceSliderValue.value,
			sortBy: sortBy.selectedOptionValue,
			brands: BrandFilter.selectedOptionValues.join(","),
			avoidIngredients: IngredientsFilter.selectedOptionValues.join(","),
			types: SkinTypeFilter.selectedOptionValues.join(","),
			concerns: SkinConcernFilter.selectedOptionValues.join(","),
		};

		//Run filter
		getFilteredProducts.run(params);
		const response = getFilteredProducts.data;
		storeValue('filteredProducts', response);
		resetWidget('List1'); // Refresh the product list widget
	},
};

