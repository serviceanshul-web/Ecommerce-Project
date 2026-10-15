// Express Orders API Routes
const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * POST /api/orders
 * Submit an order from checkout pipeline
 */
router.post('/', async (req, res) => {
  try {
    const { customer, deliveryOption, paymentMethod, items, pricing } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing customer details or empty cart items' });
    }

    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const trackingNumber = 'ATL-' + Math.floor(100000000 + Math.random() * 900000000);
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    // Insert Order
    await db.runAsync(`
      INSERT INTO orders (
        order_id, tracking_number, customer_name, customer_email, customer_phone,
        customer_address, customer_city, customer_postal_code, customer_country,
        delivery_option, payment_method, subtotal, discount, shipping, tax, total,
        status, estimated_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId,
      trackingNumber,
      customer.fullName || 'Valued Client',
      customer.email || '',
      customer.phone || '',
      customer.address || '',
      customer.city || '',
      customer.postalCode || '',
      customer.country || 'United States',
      deliveryOption || 'standard',
      paymentMethod || 'card',
      pricing?.subtotal || 0,
      pricing?.discount || 0,
      pricing?.shipping || 0,
      pricing?.tax || 0,
      pricing?.total || 0,
      'Confirmed',
      estimatedDelivery
    ]);

    // Insert Order Items
    const itemStmt = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, name, price, selected_color, selected_size, quantity, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      itemStmt.run(
        orderId,
        item.productId,
        item.name,
        item.price,
        item.selectedColor,
        item.selectedSize,
        item.quantity,
        item.image
      );
    }
    itemStmt.finalize();

    // Construct response object
    const createdOrder = {
      orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
      customer,
      deliveryOption,
      paymentMethod,
      items,
      pricing,
      status: 'Confirmed',
      estimatedDelivery
    };

    res.status(201).json({ success: true, order: createdOrder });
  } catch (err) {
    console.error('Error in POST /api/orders:', err);
    res.status(500).json({ error: 'Failed to complete order submission' });
  }
});

/**
 * GET /api/orders
 * Retrieve order history
 */
router.get('/', async (req, res) => {
  try {
    const orders = await db.allAsync('SELECT * FROM orders ORDER BY created_at DESC');

    // Attach items to each order
    const populated = await Promise.all(orders.map(async (o) => {
      const items = await db.allAsync('SELECT * FROM order_items WHERE order_id = ?', [o.order_id]);
      return {
        orderId: o.order_id,
        trackingNumber: o.tracking_number,
        createdAt: o.created_at,
        status: o.status,
        estimatedDelivery: o.estimated_delivery,
        deliveryOption: o.delivery_option,
        paymentMethod: o.payment_method,
        customer: {
          fullName: o.customer_name,
          email: o.customer_email,
          phone: o.customer_phone,
          address: o.customer_address,
          city: o.customer_city,
          postalCode: o.customer_postal_code,
          country: o.customer_country
        },
        items: items.map(i => ({
          productId: i.product_id,
          name: i.name,
          price: i.price,
          selectedColor: i.selected_color,
          selectedSize: i.selected_size,
          quantity: i.quantity,
          image: i.image
        })),
        pricing: {
          subtotal: o.subtotal,
          discount: o.discount,
          shipping: o.shipping,
          tax: o.tax,
          total: o.total
        }
      };
    }));

    res.json(populated);
  } catch (err) {
    console.error('Error in GET /api/orders:', err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

/**
 * GET /api/orders/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const o = await db.getAsync('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
    if (!o) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await db.allAsync('SELECT * FROM order_items WHERE order_id = ?', [o.order_id]);
    res.json({
      orderId: o.order_id,
      trackingNumber: o.tracking_number,
      createdAt: o.created_at,
      status: o.status,
      estimatedDelivery: o.estimated_delivery,
      customer: {
        fullName: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
        address: o.customer_address,
        city: o.customer_city,
        country: o.customer_country
      },
      items,
      pricing: {
        subtotal: o.subtotal,
        discount: o.discount,
        shipping: o.shipping,
        tax: o.tax,
        total: o.total
      }
    });
  } catch (err) {
    console.error('Error in GET /api/orders/:id:', err);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

module.exports = router;
