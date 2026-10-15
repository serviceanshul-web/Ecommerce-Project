// Decoupled Reactive Client Store
// Manages Cart, Wishlist, Filter Queries, Modals, and LocalStorage persistence

const CART_STORAGE_KEY = "atelier_cart_v1";
const WISHLIST_STORAGE_KEY = "atelier_wishlist_v1";
const THEME_STORAGE_KEY = "atelier_theme_v1";

class Store {
  constructor() {
    this.cart = this.loadFromStorage(CART_STORAGE_KEY, []);
    this.wishlist = new Set(this.loadFromStorage(WISHLIST_STORAGE_KEY, []));
    this.appliedCoupon = null; // { code: 'WELCOME10', discountPercent: 10 }
    this.freeShippingThreshold = 250; // Free shipping over $250
    this.standardShippingFee = 15;
    this.taxRate = 0.08; // 8% sales tax

    this.filters = {
      category: "All",
      sizes: [],
      colors: [],
      maxPrice: 600,
      inStockOnly: false,
      searchQuery: "",
      sortOption: "featured" // 'featured' | 'price-asc' | 'price-desc' | 'rating'
    };

    this.theme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
    this.applyTheme(this.theme);
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Failed reading ${key} from localStorage`, e);
      return fallback;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed saving ${key} to localStorage`, e);
    }
  }

  emit(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  // --- Cart Operations ---
  addToCart(product, selectedColor, selectedSize, quantity = 1) {
    const cartItemId = `${product.id}_${selectedColor}_${selectedSize}`;
    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);

    // Look up color object to grab matching image swatch if available
    const colorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
    const image = colorObj ? colorObj.image : product.images.front;

    // Check available stock for selected size
    const sizeObj = product.sizes.find(s => s.size === selectedSize);
    const maxStock = sizeObj ? sizeObj.stock : 10;

    if (existingIndex > -1) {
      const newQty = this.cart[existingIndex].quantity + quantity;
      if (newQty > maxStock) {
        this.emit("store:toast", {
          message: `Only ${maxStock} units currently available in size ${selectedSize}.`,
          type: "warning"
        });
        this.cart[existingIndex].quantity = maxStock;
      } else {
        this.cart[existingIndex].quantity = newQty;
        this.emit("store:toast", {
          message: `Updated ${product.name} quantity in your bag.`,
          type: "success"
        });
      }
    } else {
      const initialQty = Math.min(quantity, maxStock > 0 ? maxStock : 1);
      this.cart.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        selectedColor,
        selectedSize,
        quantity: initialQty,
        image,
        maxStock
      });

      this.emit("store:toast", {
        message: `Added "${product.name}" (${selectedSize} / ${selectedColor}) to your bag.`,
        type: "success"
      });
    }

    this.saveToStorage(CART_STORAGE_KEY, this.cart);
    this.emit("store:cart-updated", this.getCartSummary());
  }

  updateQuantity(cartItemId, quantity) {
    const index = this.cart.findIndex(item => item.cartItemId === cartItemId);
    if (index === -1) return;

    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    const item = this.cart[index];
    if (quantity > item.maxStock) {
      this.emit("store:toast", {
        message: `Maximum available stock is ${item.maxStock}.`,
        type: "warning"
      });
      item.quantity = item.maxStock;
    } else {
      item.quantity = quantity;
    }

    this.saveToStorage(CART_STORAGE_KEY, this.cart);
    this.emit("store:cart-updated", this.getCartSummary());
  }

  removeFromCart(cartItemId) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
    this.saveToStorage(CART_STORAGE_KEY, this.cart);
    this.emit("store:cart-updated", this.getCartSummary());

    if (item) {
      this.emit("store:toast", {
        message: `Removed "${item.name}" from your bag.`,
        type: "info"
      });
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedCoupon = null;
    this.saveToStorage(CART_STORAGE_KEY, this.cart);
    this.emit("store:cart-updated", this.getCartSummary());
  }

  applyCoupon(couponObj) {
    this.appliedCoupon = couponObj;
    this.emit("store:cart-updated", this.getCartSummary());
    this.emit("store:toast", {
      message: `Coupon "${couponObj.code}" applied! (${couponObj.discountPercent}% OFF)`,
      type: "success"
    });
  }

  removeCoupon() {
    if (this.appliedCoupon) {
      const code = this.appliedCoupon.code;
      this.appliedCoupon = null;
      this.emit("store:cart-updated", this.getCartSummary());
      this.emit("store:toast", {
        message: `Coupon "${code}" removed.`,
        type: "info"
      });
    }
  }

  getCartSummary() {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const discountAmount = this.appliedCoupon
      ? Math.round((subtotal * this.appliedCoupon.discountPercent) / 100)
      : 0;

    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const isFreeShipping = subtotal >= this.freeShippingThreshold || subtotal === 0;
    const shipping = isFreeShipping ? 0 : this.standardShippingFee;
    const tax = Math.round(afterDiscount * this.taxRate);
    const total = afterDiscount + shipping + tax;

    const progressToFreeShipping = Math.min(100, Math.round((subtotal / this.freeShippingThreshold) * 100));
    const amountNeededForFreeShipping = Math.max(0, this.freeShippingThreshold - subtotal);

    return {
      items: this.cart,
      count,
      subtotal,
      discountAmount,
      appliedCoupon: this.appliedCoupon,
      shipping,
      isFreeShipping,
      tax,
      total,
      progressToFreeShipping,
      amountNeededForFreeShipping
    };
  }

  // --- Wishlist Operations ---
  toggleWishlist(productId) {
    let action = "added";
    if (this.wishlist.has(productId)) {
      this.wishlist.delete(productId);
      action = "removed";
    } else {
      this.wishlist.add(productId);
      action = "added";
    }

    const arr = Array.from(this.wishlist);
    this.saveToStorage(WISHLIST_STORAGE_KEY, arr);
    this.emit("store:wishlist-updated", { wishlist: arr, count: arr.length });

    this.emit("store:toast", {
      message: action === "added" ? "Saved to your Wishlist." : "Removed from Wishlist.",
      type: "info"
    });
  }

  isInWishlist(productId) {
    return this.wishlist.has(productId);
  }

  getWishlistCount() {
    return this.wishlist.size;
  }

  // --- Filter & Search Operations ---
  setFilter(key, value) {
    this.filters[key] = value;
    this.emit("store:filter-updated", this.filters);
  }

  toggleSizeFilter(size) {
    const idx = this.filters.sizes.indexOf(size);
    if (idx > -1) {
      this.filters.sizes.splice(idx, 1);
    } else {
      this.filters.sizes.push(size);
    }
    this.emit("store:filter-updated", this.filters);
  }

  toggleColorFilter(color) {
    const idx = this.filters.colors.indexOf(color);
    if (idx > -1) {
      this.filters.colors.splice(idx, 1);
    } else {
      this.filters.colors.push(color);
    }
    this.emit("store:filter-updated", this.filters);
  }

  resetFilters() {
    this.filters = {
      category: "All",
      sizes: [],
      colors: [],
      maxPrice: 600,
      inStockOnly: false,
      searchQuery: "",
      sortOption: "featured"
    };
    this.emit("store:filter-updated", this.filters);
  }

  // --- Theme Toggle ---
  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, this.theme);
    this.applyTheme(this.theme);
    this.emit("store:theme-changed", { theme: this.theme });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export const store = new Store();
