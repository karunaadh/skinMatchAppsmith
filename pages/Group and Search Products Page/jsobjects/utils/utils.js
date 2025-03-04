export default {
  onOpen: async () => {
    await storeValue('filters', { brands: [], types: [], avoidIngredients: [], concerns: [] });
    await storeValue('priceRange', [0, 150]);
    await storeValue('sortOption', '');
    await this.fetchFilteredProducts();
  },

  fetchFilteredProducts: async () => {
    try {
      // Convert arrays to comma-separated strings
      await storeValue("filterParams", {
        brands: (appsmith.store.filters.brands || []).join(","),
        types: (appsmith.store.filters.types || []).join(","),
        avoidIngredients: (appsmith.store.filters.avoidIngredients || []).join(","),
        concerns: (appsmith.store.filters.concerns || []).join(","),
      });

      // Run API Query with updated filter parameters
      let response = await getFilteredProducts.run({
        maxPrice: appsmith.store.priceRange[1],
        sortBy: appsmith.store.sortOption,
        brands: appsmith.store.filterParams.brands,
        types: appsmith.store.filterParams.types,
        avoidIngredients: appsmith.store.filterParams.avoidIngredients,
        concerns: appsmith.store.filterParams.concerns,
      });

      await storeValue('filteredProducts', response);
      await resetWidget('lst_products'); // Refresh UI
    } catch (error) {
      showAlert('Error fetching products: ' + error.message, 'error');
    }
  },

  updateFilters: async (category, value) => {
    let currentFilters = { ...appsmith.store.filters, [category]: value };
    await storeValue('filters', currentFilters);
    await this.fetchFilteredProducts();
  },

  updatePriceRange: async (value) => {
    await storeValue('priceRange', value);
    await this.fetchFilteredProducts();
  },

  updateSortOption: async (option) => {
    await storeValue('sortOption', option);
    await this.fetchFilteredProducts();
  },

  resetFilters: async () => {
    await storeValue('filters', { brands: [], types: [], avoidIngredients: [], concerns: [] });
    await storeValue('priceRange', [0, 150]);
    await storeValue('sortOption', '');
    await resetWidget('sel_filter');
    await resetWidget('sld_priceRange');
    await resetWidget('sel_sortByPrice');
    await this.fetchFilteredProducts();
  },
};
