
import { defineStore } from 'pinia';
const fakeStoreUrl = 'https://6754193836bcd1eec85023b2.mockapi.io/api';

export const useProductStore = defineStore({
  id: 'products',

  state: () => ({
    items: {},
    ids: [],
  }),

  getters: {
    list() {
      return this.ids.map(id => this.items[id]);
    },

    loaded() {
      return this.ids.length > 0; 
    },
  },

  actions: {
    async fetchAll() {
      if (this.loaded) return;

      try {
        const res = await fetch(`${fakeStoreUrl}/products`);
        const data = await res.json();

        this.ids = data.map((product) => {
          this.items[product.prodID] = product;
          return product.prodID;
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },
});