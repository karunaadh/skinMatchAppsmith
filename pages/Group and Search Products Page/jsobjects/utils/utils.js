export default {
  onOpen: async () => {
    await storeValue('favorites', appsmith.store?.favorites || []);
    await storeValue('search', appsmith.store?.search || '');
    await storeValue('filters', appsmith.store?.filters || {});
    await storeValue('priceRange', appsmith.store?.priceRange || [0, 150]);
    await storeValue('sortOption', appsmith.store?.sortOption || '');
    await this.fetchAndFilterProducts();
  },

  fetchAndFilterProducts: async () => {
    let allProducts = await getAllProducts.run();
    let filteredProducts = this.applyFilters(allProducts);
    await storeValue('filteredProducts', filteredProducts);
    await resetWidget('lst_products');
  },

  applyFilters: (products) => {
    const { search, filters, priceRange, sortOption } = appsmith.store;
    
    let filtered = products.filter(product => {
      // Apply search filter
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      
      // Apply category filters
      for (let category in filters) {
        if (filters[category].length > 0 && !filters[category].includes(product[category])) {
          return false;
        }
      }
      
      // Apply price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    if (sortOption === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    return filtered;
  },

  updateSearch: async (value) => {
    await storeValue('search', value);
    await this.fetchAndFilterProducts();
  },

  updateFilters: async (category, value) => {
    let currentFilters = appsmith.store.filters;
    currentFilters[category] = value;
    await storeValue('filters', currentFilters);
    await this.fetchAndFilterProducts();
  },

  updatePriceRange: async (value) => {
    await storeValue('priceRange', value);
    await this.fetchAndFilterProducts();
  },

  updateSortOption: async (option) => {
    await storeValue('sortOption', option);
    await this.fetchAndFilterProducts();
  },

  resetFilters: async () => {
    await storeValue('search', '');
    await storeValue('filters', {});
    await storeValue('priceRange', [0, 150]);
    await storeValue('sortOption', '');
    await resetWidget('inp_search');
    await resetWidget('sel_filter');
    await resetWidget('sld_priceRange');
    await resetWidget('sel_sortByPrice');
    await this.fetchAndFilterProducts();
  },

  addToFavorites: async (product) => {
    let favorites = appsmith.store.favorites || [];
    if (!favorites.some(item => item.id === product.id)) {
      await storeValue('favorites', [...favorites, product]);
      await showAlert(`${product.name} added to favorites`, 'success');
    } else {
      await showAlert(`${product.name} is already in favorites`, 'info');
    }
  },

  removeFromFavorites: async (productId) => {
    let favorites = appsmith.store.favorites || [];
    let updatedFavorites = favorites.filter(item => item.id !== productId);
    await storeValue('favorites', updatedFavorites);
    await resetWidget('lst_products');
  }
	
};