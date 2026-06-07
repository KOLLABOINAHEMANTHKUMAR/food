import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const PRECONFIGURED_USERS = [
  { email: 'customer@freshbite.com', password: 'password', role: 'customer', name: 'Emily Rose' },
  { email: 'admin@freshbite.com', password: 'password', role: 'admin', name: 'Kitchen Admin' },
  { email: 'delivery@freshbite.com', password: 'password', role: 'delivery', name: 'Alex Rider (Rider)' }
];

const DEFAULT_MENU_ITEMS = [
  {
    id: '1',
    name: 'Gourmet Veggie Burger',
    description: 'A savory plant-based patty topped with fresh avocado, organic lettuce, heirloom tomato, and our signature herb aioli on a toasted brioche bun.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    category: 'Burgers',
    rating: 4.8,
    veg: true,
    prepTime: '15 min',
  },
  {
    id: '2',
    name: 'Margherita Basil Pizza',
    description: 'Authentic thin crust topped with premium San Marzano tomato sauce, fresh buffalo mozzarella, extra virgin olive oil, and organic sweet basil.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=60',
    category: 'Pizzas',
    rating: 4.9,
    veg: true,
    prepTime: '20 min',
  },
  {
    id: '3',
    name: 'Organic Avocado Salad',
    description: 'Crisp organic kale, baby spinach, hass avocado, cucumber, cherry tomatoes, toasted pumpkin seeds, tossed in a light zesty lemon vinaigrette.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    category: 'Salads',
    rating: 4.7,
    veg: true,
    prepTime: '10 min',
  },
  {
    id: '4',
    name: 'Spicy Pepperoni Pizza',
    description: 'Artisanal sourdough crust loaded with cured Italian pepperoni, spicy honey drizzle, mozzarella, and dynamic red pepper flakes.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
    category: 'Pizzas',
    rating: 4.8,
    veg: false,
    prepTime: '20 min',
  },
  {
    id: '5',
    name: 'Strawberry Bliss Cheesecake',
    description: 'Rich and creamy New York style cheesecake served on a buttery graham cracker crust, finished with a luscious fresh strawberry glaze.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    rating: 4.9,
    veg: true,
    prepTime: '8 min',
  },
  {
    id: '6',
    name: 'Fresh Mint Mojito',
    description: 'A refreshing muddled mocktail with fresh mint leaves, lime wedges, pure cane sugar, carbonated water, and crushed ice.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
    category: 'Beverages',
    rating: 4.6,
    veg: true,
    prepTime: '5 min',
  },
  {
    id: '7',
    name: 'Crispy Truffle Fries',
    description: 'Golden, hand-cut russet potatoes tossed in white truffle oil, grated parmesan cheese, and fresh rosemary, served with garlic dipping sauce.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
    category: 'Salads',
    rating: 4.7,
    veg: true,
    prepTime: '12 min',
  },
  {
    id: '8',
    name: 'Chocolate Molten Lava Cake',
    description: 'Decadent dark chocolate cake with a warm flowing liquid chocolate center, served with a scoop of organic vanilla bean gelato.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    rating: 4.9,
    veg: true,
    prepTime: '10 min',
  }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-8942',
    customerInfo: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1 (555) 019-2834',
      address: '742 Evergreen Terrace, Springfield',
      paymentMethod: 'Credit Card'
    },
    items: [
      {
        id: '1',
        name: 'Gourmet Veggie Burger',
        price: 12.99,
        quantity: 2,
        selectedOptions: { size: 'Medium', extras: ['Extra Aioli'] }
      },
      {
        id: '6',
        name: 'Fresh Mint Mojito',
        price: 5.50,
        quantity: 1,
        selectedOptions: { size: 'Regular', extras: [] }
      }
    ],
    subtotal: 31.48,
    tax: 5.67,
    total: 37.15,
    status: 'Delivered',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'ORD-7721',
    customerInfo: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 043-9821',
      address: '100 Baker Street, London',
      paymentMethod: 'Cash on Delivery'
    },
    items: [
      {
        id: '2',
        name: 'Margherita Basil Pizza',
        price: 14.50,
        quantity: 1,
        selectedOptions: { size: 'Large', extras: ['Extra Cheese'] }
      }
    ],
    subtotal: 14.50,
    tax: 2.61,
    total: 17.11,
    status: 'Out for Delivery', // Set to Out for Delivery so the new delivery agent dashboard can view it immediately!
    timestamp: new Date(Date.now() - 600000 * 3).toISOString(), // 30 mins ago
  }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('food_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('food_menu_items');
    return saved ? JSON.parse(saved) : DEFAULT_MENU_ITEMS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('food_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('food_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('food_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('food_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('food_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('food_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('food_orders', JSON.stringify(orders));
  }, [orders]);

  // Auth Functions
  const login = (email, password) => {
    const matched = PRECONFIGURED_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (matched) {
      const userInfo = { email: matched.email, role: matched.role, name: matched.name };
      setUser(userInfo);
      return { success: true, user: userInfo };
    }
    return { success: false, message: 'Invalid credentials. Check quick keys.' };
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  // Cart Management
  const addToCart = (item, quantity = 1, selectedOptions = { size: 'Medium', extras: [] }) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedOptions.size === selectedOptions.size &&
          JSON.stringify(cartItem.selectedOptions.extras) === JSON.stringify(selectedOptions.extras)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, {
          cartId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          veg: item.veg,
          quantity,
          selectedOptions
        }];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Menu Management (CRUD)
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      rating: parseFloat((4.0 + Math.random()).toFixed(1)),
      prepTime: item.prepTime || '15 min'
    };
    setMenuItems((prevItems) => [newItem, ...prevItems]);
  };

  const editMenuItem = (id, updatedItem) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Orders Management
  const placeOrder = (customerInfo, subtotal, tax, total) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerInfo,
      items: [...cart],
      subtotal,
      tax,
      total,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        menuItems,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        placeOrder,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
