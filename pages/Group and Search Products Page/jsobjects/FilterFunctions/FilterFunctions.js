export default {
	// Function to handle search as user types
	onSearchChange: (searchTerm) => {
		// Get the current list of products
		const currentProducts = appsmith.store.filteredProducts || getAllProducts.data;

		// Filter products based on the search term
		if (searchTerm.length >= 2) {
			// Only search if 2 or more characters are entered
			const searchResults = currentProducts.filter(product =>											 product.name.toLowerCase().includes(searchTerm.toLowerCase())
																									);
			//Return search results
			return searchResults;
		} else {
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

		// Fetch all products and reset the filter state
		const response = getAllProducts.data;
		storeValue('filteredProducts', response); // Store all products
		resetWidget('lst_productList'); // Refresh the product list widget
	},

	// Function to apply filters and fetch filtered products
	applyFilters: () => {
		// Call the API to get filtered products
		const response = getFilteredProducts.data;
		storeValue('filteredProducts', response);
		resetWidget('lst_productList'); // Refresh the product list widget
	},
};

