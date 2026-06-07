import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const PRECONFIGURED_USERS = [
  { email: 'customer@freshbite.com', password: 'password', role: 'customer', name: 'Emily Rose', coins: 150, inviteCode: 'FRESH-EMILY-42' },
  { email: 'admin@freshbite.com', password: 'password', role: 'admin', name: 'Kitchen Admin', coins: 0, inviteCode: 'FRESH-ADMIN-10' },
  { email: 'delivery@freshbite.com', password: 'password', role: 'delivery', name: 'Alex Rider (Rider)', coins: 0, inviteCode: 'FRESH-ALEX-83' }
];

const DEFAULT_MENU_ITEMS = [
  {
    id: '1',
    name: 'Gourmet Veggie Burger',
    description: 'A savory plant-based patty topped with fresh avocado, organic lettuce, heirloom tomato, and our signature herb aioli on a toasted brioche bun.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    category: 'Burgers',
    rating: 4.8,
    veg: true,
    prepTime: '15 min',
    ingredients: { "Brioche Bun": 1, "Veggie Patty": 1, "Avocado": 1 }
  },
  {
    id: '2',
    name: 'Margherita Basil Pizza',
    description: 'Authentic thin crust topped with premium San Marzano tomato sauce, fresh buffalo mozzarella, extra virgin olive oil, and organic sweet basil.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=60',
    category: 'Pizzas',
    rating: 4.9,
    veg: true,
    prepTime: '20 min',
    ingredients: { "Pizza Dough": 1, "Mozzarella": 1, "Organic Tomato": 2 }
  },
  {
    id: '3',
    name: 'Organic Avocado Salad',
    description: 'Crisp organic kale, baby spinach, hass avocado, cucumber, cherry tomatoes, toasted pumpkin seeds, tossed in a light zesty lemon vinaigrette.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    category: 'Salads',
    rating: 4.7,
    veg: true,
    prepTime: '10 min',
    ingredients: { "Avocado": 1, "Salad Greens": 1, "Organic Tomato": 1 }
  },
  {
    id: '4',
    name: 'Spicy Pepperoni Pizza',
    description: 'Artisanal sourdough crust loaded with cured Italian pepperoni, spicy honey drizzle, mozzarella, and dynamic red pepper flakes.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
    category: 'Pizzas',
    rating: 4.8,
    veg: false,
    prepTime: '20 min',
    ingredients: { "Pizza Dough": 1, "Mozzarella": 1, "Cured Pepperoni": 1 }
  },
  {
    id: '5',
    name: 'Strawberry Bliss Cheesecake',
    description: 'Rich and creamy New York style cheesecake served on a buttery graham cracker crust, finished with a luscious fresh strawberry glaze.',
    price: 149,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    rating: 4.9,
    veg: true,
    prepTime: '8 min',
    ingredients: { "Cheese Cream": 1, "Strawberry Glaze": 1 }
  },
  {
    id: '6',
    name: 'Fresh Mint Mojito',
    description: 'A refreshing muddled mocktail with fresh mint leaves, lime wedges, pure cane sugar, carbonated water, and crushed ice.',
    price: 99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
    category: 'Beverages',
    rating: 4.6,
    veg: true,
    prepTime: '5 min',
    ingredients: { "Fresh Mint": 1, "Lime & Soda": 1 }
  },
  {
    id: '7',
    name: 'Crispy Truffle Fries',
    description: 'Golden, hand-cut russet potatoes tossed in white truffle oil, grated parmesan cheese, and fresh rosemary, served with garlic dipping sauce.',
    price: 129,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
    category: 'Salads',
    rating: 4.7,
    veg: true,
    prepTime: '12 min',
    ingredients: { "Russet Potatoes": 1, "Truffle Oil": 1 }
  },
  {
    id: '8',
    name: 'Chocolate Molten Lava Cake',
    description: 'Decadent dark chocolate cake with a warm flowing liquid chocolate center, served with a scoop of organic vanilla bean gelato.',
    price: 179,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
    category: 'Desserts',
    rating: 4.9,
    veg: true,
    prepTime: '10 min',
    ingredients: { "Chocolate Molten": 1, "Vanilla Gelato": 1 }
  },
  {
    id: '9',
    name: 'Royal Hyderabadi Biryani',
    description: 'A royal blend of fragrant organic basmati rice, tender farm-reared chicken, and a rich medley of hand-ground spices cooked slow in traditional dum style.',
    price: 349,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60',
    category: 'Biryanis',
    rating: 4.9,
    veg: false,
    prepTime: '25 min',
    ingredients: { "Basmati Rice": 1, "Farm Chicken": 1, "Biryani Spices": 1 }
  },
  {
    id: '10',
    name: 'Organic Jackfruit Dum Biryani',
    description: 'Fragrant basmati rice layered with tender raw jackfruit chunks, fresh mint, caramelized onions, and signature organic spices cooked dum style.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
    category: 'Biryanis',
    rating: 4.8,
    veg: true,
    prepTime: '20 min',
    ingredients: { "Basmati Rice": 1, "Raw Jackfruit": 1, "Biryani Spices": 1 }
  },
  {
    id: '11',
    name: 'Premium Organic North Thali',
    description: 'A wholesome meal of organic paneer butter masala, yellow dal tadka, fresh cumin pulao, butter roti, cucumber raita, and sweet gulab jamun.',
    price: 279,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60',
    category: 'Meals',
    rating: 4.9,
    veg: true,
    prepTime: '18 min',
    ingredients: { "Basmati Rice": 1, "Organic Paneer": 1, "Whole Wheat Flour": 1 }
  },
  {
    id: '12',
    name: 'South Indian Deluxe Meals',
    description: 'Traditional healthy platter featuring organic ponni rice, aromatic sambar, rasam, freshly grated coconut avial, pathiri, papadum, and sweet payasam.',
    price: 229,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60',
    category: 'Meals',
    rating: 4.8,
    veg: true,
    prepTime: '15 min',
    ingredients: { "Ponni Rice": 1, "Coconut & Veggies": 1, "Sambar Lentils": 1 }
  }
];

const DEFAULT_INVENTORY = {
  "Brioche Bun": 15,
  "Veggie Patty": 12,
  "Pizza Dough": 10,
  "Mozzarella": 15,
  "Organic Tomato": 20,
  "Cured Pepperoni": 8,
  "Cheese Cream": 8,
  "Strawberry Glaze": 6,
  "Fresh Mint": 25,
  "Lime & Soda": 30,
  "Russet Potatoes": 20,
  "Truffle Oil": 10,
  "Chocolate Molten": 8,
  "Vanilla Gelato": 12,
  "Avocado": 4,  // Low stock avocado to demonstrate restock warnings!
  "Salad Greens": 15,
  "Basmati Rice": 20,
  "Farm Chicken": 15,
  "Biryani Spices": 25,
  "Raw Jackfruit": 12,
  "Organic Paneer": 15,
  "Whole Wheat Flour": 20,
  "Ponni Rice": 20,
  "Coconut & Veggies": 18,
  "Sambar Lentils": 22
};

const DEFAULT_COUPONS = [
  { code: 'FRESH50', discount: 50, minOrder: 100 },
  { code: 'ORGANIC30', discount: 30, minOrder: 200 },
  { code: 'WELCOME100', discount: 10, minOrder: 150 }
];

const DEFAULT_ORDERS = [
  {
    id: 'ORD-8942',
    customerInfo: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+91 9876543210',
      address: 'Plot 23, Sector 15, Vashi, Navi Mumbai',
      paymentMethod: 'Credit Card'
    },
    items: [
      {
        id: '1',
        name: 'Gourmet Veggie Burger',
        price: 249,
        quantity: 2,
        selectedOptions: { size: 'Medium', extras: ['Extra Aioli'] }
      }
    ],
    subtotal: 498,
    tax: 49.8,
    total: 547.8,
    status: 'Delivered',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

const DEFAULT_FEED_POSTS = [
  {
    id: 'post-1',
    author: 'Emily Rose',
    dishId: '1',
    dishName: 'Gourmet Veggie Burger',
    rating: 5,
    comment: 'Literally the best plant-based burger in Navi Mumbai! Super juicy and fresh avocados.',
    likes: 8,
    likedByUser: false,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'post-2',
    author: 'Devid K.',
    dishId: '3',
    dishName: 'Organic Avocado Salad',
    rating: 4,
    comment: 'The lemon dressing was extremely refreshing. Perfectly crisp kale leaves!',
    likes: 4,
    likedByUser: false,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('food_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('food_registered_users');
    return saved ? JSON.parse(saved) : PRECONFIGURED_USERS;
  });

  // Items / Inventory
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('food_menu_items');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.some(item => item.id === '9')) {
        return [...parsed, ...DEFAULT_MENU_ITEMS.filter(d => !parsed.some(p => p.id === d.id))];
      }
      return parsed;
    }
    return DEFAULT_MENU_ITEMS;
  });
 
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('food_inventory');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_INVENTORY, ...parsed };
    }
    return DEFAULT_INVENTORY;
  });

  // Coupons
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('food_coupons');
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  });

  // Shopping / Groups
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('food_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [groupCart, setGroupCart] = useState(() => {
    const saved = localStorage.getItem('food_group_cart');
    return saved ? JSON.parse(saved) : { active: false, code: '', members: [], items: [] };
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('food_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // Social feed
  const [feedPosts, setFeedPosts] = useState(() => {
    const saved = localStorage.getItem('food_feed_posts');
    return saved ? JSON.parse(saved) : DEFAULT_FEED_POSTS;
  });

  // Toasts / Notifications stack
  const [notifications, setNotifications] = useState([]);

  // Floating Chatbot dialogs
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hi there! 🍏 I am your organic FreshBite Assistant. Ask me about your active orders or menu ingredients!' }
  ]);

  const [dietPreference, setDietPreference] = useState(() => {
    return localStorage.getItem('food_diet_preference') || 'None';
  });

  const [autoRestockEnabled, setAutoRestockEnabled] = useState(() => {
    return localStorage.getItem('food_auto_restock') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('food_diet_preference', dietPreference);
  }, [dietPreference]);

  useEffect(() => {
    localStorage.setItem('food_auto_restock', autoRestockEnabled ? 'true' : 'false');
  }, [autoRestockEnabled]);

  // Keep localStorage synced
  useEffect(() => {
    if (user) {
      localStorage.setItem('food_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('food_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('food_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('food_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('food_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('food_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('food_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('food_group_cart', JSON.stringify(groupCart));
  }, [groupCart]);

  useEffect(() => {
    localStorage.setItem('food_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('food_feed_posts', JSON.stringify(feedPosts));
  }, [feedPosts]);

  // Toast notifications helpers
  const triggerToast = (message, type = 'info') => {
    const newToast = { id: Date.now().toString(), message, type };
    setNotifications((prev) => [...prev, newToast]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  };

  // Auth Actions
  const login = (email, password) => {
    const matched = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (matched) {
      setUser(matched);
      triggerToast(`Welcome back, ${matched.name}!`, 'success');
      
      // Check if this user has any unread gifted order notifications waiting for them!
      const unreadGift = orders.find(o => o.giftRecipientEmail?.toLowerCase() === email.toLowerCase() && o.status === 'Pending');
      if (unreadGift) {
        setTimeout(() => {
          triggerToast(`🎉 Gift received! John sent you a gifted package ORD-${unreadGift.id.split('-')[1]}!`, 'success');
        }, 1500);
      }

      return { success: true, user: matched };
    }
    return { success: false, message: 'Invalid credentials.' };
  };

  const registerUser = (name, email, password, role, refCode = '') => {
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Email address already registered.' };
    }

    let startCoins = 100; // Registration reward
    let referrerMatch = null;

    if (refCode.trim()) {
      referrerMatch = registeredUsers.find(
        (u) => u.inviteCode?.toLowerCase() === refCode.trim().toLowerCase()
      );
    }

    const newUserInviteCode = `FRESH-${name.split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newUser = {
      name,
      email,
      password,
      role,
      coins: referrerMatch ? startCoins + 100 : startCoins, // Bonus if referred
      inviteCode: newUserInviteCode
    };

    setRegisteredUsers((prev) => {
      const updated = prev.map((u) => {
        if (referrerMatch && u.email === referrerMatch.email) {
          triggerToast(`Referral Success! Placed 100 coins into ${u.name}'s wallet.`, 'success');
          return { ...u, coins: u.coins + 100 };
        }
        return u;
      });
      return [...updated, newUser];
    });

    if (referrerMatch) {
      triggerToast(`Referral applied! You and your friend earned 🪙100 coins.`, 'success');
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setGroupCart({ active: false, code: '', members: [], items: [] });
    triggerToast('Logged out successfully.');
  };

  // Spend Coins / update wallets
  const deductCoins = (email, count) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, coins: Math.max(0, u.coins - count) } : u))
    );
    setUser((prev) => (prev && prev.email === email ? { ...prev, coins: Math.max(0, prev.coins - count) } : prev));
  };

  const addCoins = (email, count) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email === email ? { ...u, coins: u.coins + count } : u))
    );
    setUser((prev) => (prev && prev.email === email ? { ...prev, coins: prev.coins + count } : prev));
  };

  // Cart logic
  const addToCart = (item, quantity = 1, selectedOptions = { size: 'Medium', extras: [] }) => {
    // Check ingredient limits
    const sizeModifiers = { 'Small': -1, 'Medium': 0, 'Large': 1 };
    const requiredIng = item.ingredients || {};
    
    // Validate if stocks are depleted
    let outOfStock = false;
    Object.entries(requiredIng).forEach(([ingName, reqQty]) => {
      const avail = inventory[ingName] || 0;
      if (avail < reqQty * quantity) {
        outOfStock = true;
      }
    });

    if (outOfStock) {
      triggerToast(`Unable to add: low ingredient stock for ${item.name}!`, 'error');
      return;
    }

    if (groupCart.active) {
      // Add to collaborative group cart
      setGroupCart((prev) => {
        const existingItemIndex = prev.items.findIndex(
          (cartItem) =>
            cartItem.id === item.id &&
            cartItem.member === user.name &&
            cartItem.selectedOptions.size === selectedOptions.size &&
            JSON.stringify(cartItem.selectedOptions.extras) === JSON.stringify(selectedOptions.extras)
        );

        if (existingItemIndex > -1) {
          const newItems = [...prev.items];
          newItems[existingItemIndex].quantity += quantity;
          return { ...prev, items: newItems };
        } else {
          return {
            ...prev,
            items: [
              ...prev.items,
              {
                cartId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                veg: item.veg,
                quantity,
                selectedOptions,
                member: user.name,
                note: ''
              }
            ]
          };
        }
      });
      triggerToast(`Added ${item.name} to Group Order!`);
    } else {
      // Standard personal cart
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
      triggerToast(`Added ${item.name} to cart.`);
    }
  };

  const removeFromCart = (cartId) => {
    if (groupCart.active) {
      setGroupCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.cartId !== cartId)
      }));
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
    }
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    if (groupCart.active) {
      setGroupCart((prev) => ({
        ...prev,
        items: prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
      }));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
      );
    }
  };

  // Group Ordering Activators
  const startGroupOrder = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setGroupCart({
      active: true,
      code: pin,
      members: [user.name],
      items: []
    });
    triggerToast(`Group cart initialized: PIN ${pin}`, 'success');
  };

  const joinGroupOrder = (pin) => {
    // Simply joins mock session
    setGroupCart((prev) => {
      const alreadyIn = prev.members.includes(user.name);
      return {
        active: true,
        code: pin,
        members: alreadyIn ? prev.members : [...prev.members, user.name],
        items: prev.items
      };
    });
    triggerToast(`Joined group session ${pin}!`, 'success');
  };

  const leaveGroupOrder = () => {
    setGroupCart({ active: false, code: '', members: [], items: [] });
    triggerToast('Group cart session abandoned.');
  };

  // Menu CRUD
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      rating: 4.8,
      prepTime: item.prepTime || '15 min',
      ingredients: item.ingredients || { "Pizza Dough": 1, "Mozzarella": 1 }
    };
    setMenuItems((prevItems) => [newItem, ...prevItems]);
    triggerToast(`New menu dish "${item.name}" registered.`, 'success');
  };

  const editMenuItem = (id, updatedItem) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
    triggerToast('Dish details updated.');
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    triggerToast('Dish deleted from catalog.', 'warning');
  };

  // Restocking Inventory
  const restockIngredient = (name, amount = 10) => {
    setInventory((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + amount
    }));
    triggerToast(`Restocked ${name} by +${amount} units.`, 'success');
  };

  // Coupon Campaigns
  const addPromoCampaign = (code, discount, minOrder) => {
    const isExist = coupons.some(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (isExist) {
      return { success: false, message: 'Promo code already exists!' };
    }
    const newCoupon = { code: code.toUpperCase(), discount, minOrder };
    setCoupons((prev) => [...prev, newCoupon]);
    triggerToast(`Campaign launched: Code ${code.toUpperCase()}!`, 'success');
    return { success: true };
  };

  // Place Orders
  const placeOrder = (customerInfo, subtotal, tax, total, coinsRedeemed = 0, giftRecipientEmail = '', customItems = null) => {
    // Deduct inventory ingredients
    const itemsList = customItems || (groupCart.active ? groupCart.items : cart);
    const updatedInventory = { ...inventory };

    itemsList.forEach((cartItem) => {
      const menuItem = menuItems.find(m => m.id === cartItem.id);
      if (menuItem && menuItem.ingredients) {
        Object.entries(menuItem.ingredients).forEach(([ingName, reqQty]) => {
          if (updatedInventory[ingName] !== undefined) {
            updatedInventory[ingName] = Math.max(0, updatedInventory[ingName] - (reqQty * cartItem.quantity));
          }
        });
      }
    });

    // Auto restock logic if enabled
    if (autoRestockEnabled) {
      Object.entries(updatedInventory).forEach(([ingName, stockCount]) => {
        if (stockCount < 3) {
          updatedInventory[ingName] = stockCount + 15;
          setTimeout(() => {
            triggerToast(`🚨 Auto-Stock Trigger: ${ingName} hit threshold. Restocked +15 units!`, 'success');
          }, 1500);
        }
      });
    }

    setInventory(updatedInventory);

    // Build order object
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerInfo,
      items: [...itemsList],
      subtotal,
      tax,
      total,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      giftRecipientEmail: giftRecipientEmail.trim()
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    // Update wallet reward coins (10% of total)
    const earnedCoins = Math.round(total * 0.10);
    
    if (user) {
      if (coinsRedeemed > 0) {
        deductCoins(user.email, coinsRedeemed);
      }
      addCoins(user.email, earnedCoins);
      triggerToast(`Order confirmed! Placed +${earnedCoins} Loyalty coins in your wallet.`, 'success');
    }

    // Clear session carts
    if (groupCart.active) {
      setGroupCart({ active: false, code: '', members: [], items: [] });
    } else {
      setCart([]);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          // Trigger notifications as status changes
          if (status === 'Preparing') {
            triggerToast(`🍳 Chef has accepted order ${orderId} and started preparing!`, 'success');
          } else if (status === 'Out for Delivery') {
            triggerToast(`🛵 Rider Alex Rider picked up order ${orderId} & is on the way!`, 'success');
          } else if (status === 'Delivered') {
            triggerToast(`🎉 Order ${orderId} delivered! Enjoy your meal.`, 'success');
          }
          return { ...order, status };
        }
        return order;
      })
    );
  };

  // Social reviews
  const likeFeedPost = (postId) => {
    setFeedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser
            }
          : post
      )
    );
  };

  const addFeedPost = (dishId, dishName, rating, comment) => {
    const newPost = {
      id: `post-${Date.now()}`,
      author: user?.name || 'Anonymous User',
      dishId,
      dishName,
      rating,
      comment,
      likes: 0,
      likedByUser: false,
      timestamp: new Date().toISOString()
    };
    setFeedPosts((prev) => [newPost, ...prev]);
    triggerToast('Review published to Community Feed!', 'success');
  };

  const updateGroupCartItemNote = (cartId, note) => {
    setGroupCart((prev) => {
      if (!prev.active) return prev;
      const updatedItems = prev.items.map((item) =>
        item.cartId === cartId ? { ...item, note } : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        registerUser,
        logout,
        deductCoins,
        addCoins,
        menuItems,
        inventory,
        restockIngredient,
        coupons,
        addPromoCampaign,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        groupCart,
        startGroupOrder,
        joinGroupOrder,
        leaveGroupOrder,
        orders,
        placeOrder,
        updateOrderStatus,
        feedPosts,
        likeFeedPost,
        addFeedPost,
        notifications,
        triggerToast,
        chatMessages,
        setChatMessages,
        dietPreference,
        setDietPreference,
        autoRestockEnabled,
        setAutoRestockEnabled,
        updateGroupCartItemNote
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
