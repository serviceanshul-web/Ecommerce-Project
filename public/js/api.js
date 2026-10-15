// Decoupled API Service Layer
// Currently serves mock data with network latency emulation.
// Designed for seamless transition to Express.js REST API (/api/products, /api/orders, etc.) in the backend phase.

import { MOCK_PRODUCTS } from "./data/mockProducts.js";

const VALID_COUPONS = {
  "WELCOME10": { code: "WELCOME10", discountPercent: 10, description: "10% Welcome Discount" },
  "ATELIER20": { code: "ATELIER20", discountPercent: 20, description: "20% Seasonal Privilege" },
  "VIP30": { code: "VIP30", discountPercent: 30, description: "30% Private Client Access" }
};

class ApiService {
  constructor() {
    this.useMock = true; // Flips to false when Express backend endpoints are live
    this.baseUrl = "/api";
  }

  // Emulates realistic network latency for smooth UI loader handling
  async delay(ms = 120) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch filtered and sorted catalog of products
   */
  async getProducts(filters = {}) {
    if (!this.useMock) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.category && filters.category !== "All") queryParams.set("category", filters.category);
        if (filters.searchQuery) queryParams.set("search", filters.searchQuery);
        if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
        if (filters.sortOption) queryParams.set("sort", filters.sortOption);
        const res = await fetch(`${this.baseUrl}/products?${queryParams.toString()}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Backend not yet reachable, falling back to client mock:", err);
      }
    }

    await this.delay(80);

    let list = [...MOCK_PRODUCTS];

    // Filter by Category
    if (filters.category && filters.category !== "All") {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by Search Query
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter by Size
    if (filters.sizes && filters.sizes.length > 0) {
      list = list.filter(p =>
        p.sizes.some(s => filters.sizes.includes(s.size) && s.stock > 0)
      );
    }

    // Filter by Max Price
    if (filters.maxPrice !== undefined) {
      list = list.filter(p => p.price <= filters.maxPrice);
    }

    // Filter by In-Stock Only
    if (filters.inStockOnly) {
      list = list.filter(p => p.sizes.some(s => s.stock > 0));
    }

    // Filter by Colors
    if (filters.colors && filters.colors.length > 0) {
      list = list.filter(p =>
        p.colors.some(c => filters.colors.some(fc => c.name.toLowerCase().includes(fc.toLowerCase())))
      );
    }

    // Sort
    switch (filters.sortOption) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        // Featured default
        break;
    }

    return list;
  }

  /**
   * Fetch single product by ID
   */
  async getProductById(id) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/products/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Backend not yet reachable, falling back:", err);
      }
    }

    await this.delay(50);
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  }

  /**
   * Validate promo coupon
   */
  async validateCoupon(code) {
    await this.delay(100);
    const upper = (code || "").trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      return { success: true, coupon: VALID_COUPONS[upper] };
    }
    return { success: false, message: "Invalid or expired promo code." };
  }

  /**
   * Submit Order
   */
  async submitOrder(orderPayload) {
    if (!this.useMock) {
      try {
        const res = await fetch(`${this.baseUrl}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Backend not reachable for order submission, simulating local confirmation:", err);
      }
    }

    await this.delay(350);

    // Simulate order creation
    const orderId = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const trackingNumber = "ATL-" + Math.floor(100000000 + Math.random() * 900000000);

    return {
      success: true,
      order: {
        orderId,
        trackingNumber,
        createdAt: new Date().toISOString(),
        ...orderPayload,
        status: "Confirmed",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric"
        })
      }
    };
  }
}

export const api = new ApiService();
