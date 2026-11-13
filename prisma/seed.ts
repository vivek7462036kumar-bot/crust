import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Crust & Ember database...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.customIngredient.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactInquiry.deleteMany();

  // 1. Menu Items
  const menuItems = [
    {
      name: 'The Ember Margherita',
      slug: 'ember-margherita',
      description: 'San Marzano D.O.P. tomato sauce, creamy buffalo mozzarella, fragrant wild basil, cold-pressed Sicilian EVOO, and flaky sea salt on charred artisan crust.',
      price: 16.0,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGETARIAN,CHEF_SPECIAL',
      inStock: true,
      isFeatured: true,
      baseSize: '12 inch',
    },
    {
      name: 'Truffle & Wild Forest Mushroom',
      slug: 'truffle-wild-mushroom',
      description: 'Velvety truffle cream base, roasted cremini & shiitake mushrooms, smoked mozzarella, fresh thyme, and a drizzle of hot wildflower honey.',
      price: 21.0,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGETARIAN,CHEF_SPECIAL',
      inStock: true,
      isFeatured: true,
      baseSize: '12 inch',
    },
    {
      name: 'Calabrian Fiery Salami',
      slug: 'calabrian-fiery-salami',
      description: 'House tomato sauce, spicy artisan soppressata, crumbled \'nduja sausage, pickled red chilies, fresh fior di latte, and spicy hot honey drizzle.',
      price: 20.0,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      badges: 'SPICY,CHEF_SPECIAL',
      inStock: true,
      isFeatured: true,
      baseSize: '12 inch',
    },
    {
      name: 'Prosciutto & Burrata Bianca',
      slug: 'prosciutto-burrata-bianca',
      description: 'Roasted garlic white sauce, aged Prosciutto di Parma, whole melted torn burrata, baby arugula, and 24-month aged Parmigiano Reggiano shaving.',
      price: 23.0,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      badges: 'CHEF_SPECIAL',
      inStock: true,
      isFeatured: true,
      baseSize: '12 inch',
    },
    {
      name: 'Sweet Fennel Sausage & Bell Pepper',
      slug: 'sweet-fennel-sausage',
      description: 'Smoky slow-cooked tomato base, house-ground heritage pork fennel sausage, fire-roasted sweet bell peppers, caramelized onions, and fontina cheese.',
      price: 19.0,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
      badges: '',
      inStock: true,
      isFeatured: false,
      baseSize: '12 inch',
    },
    {
      name: 'Smoky BBQ Wood-Roasted Pollo',
      slug: 'smoky-bbq-pollo',
      description: 'Smoky bourbon barbecue reduction, wood-oven charred tender chicken breast, red onion crisps, cilantro sprigs, and smoked Wisconsin gouda blend.',
      price: 19.5,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      badges: '',
      inStock: true,
      isFeatured: false,
      baseSize: '12 inch',
    },
    {
      name: 'Vegan Garden Rustica',
      slug: 'vegan-garden-rustica',
      description: 'Organic San Marzano sauce, artisanal cultured cashew mozzarella, marinated artichoke hearts, roasted baby garlic cloves, broccolini, and basil oil.',
      price: 18.0,
      category: 'PIZZA',
      imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGAN,VEGETARIAN',
      inStock: true,
      isFeatured: false,
      baseSize: '12 inch',
    },
    // SIDES
    {
      name: 'Cast-Iron Truffle Garlic Knots',
      slug: 'truffle-garlic-knots',
      description: 'Hand-tied artisan dough knots baked in cast iron, tossed in roasted garlic herb butter, grated Pecorino Romano, and served with warm San Marzano dip.',
      price: 9.0,
      category: 'SIDE',
      imageUrl: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGETARIAN',
      inStock: true,
      isFeatured: true,
      baseSize: '6 pieces',
    },
    {
      name: 'Campanian Burrata & Heirloom Caprese',
      slug: 'burrata-caprese',
      description: 'Whole creamy 250g burrata ball, marinated baby heirloom tomatoes, basil pesto infusion, 12-year aged Modena balsamic reduction, and warm focaccia toasts.',
      price: 13.0,
      category: 'SIDE',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGETARIAN',
      inStock: true,
      isFeatured: false,
      baseSize: 'Plate',
    },
    {
      name: 'Wood-Fired Calabrian Chili Wings',
      slug: 'calabrian-chili-wings',
      description: 'Wood-fired crispy chicken wings tossed in fermented Calabrian hot chili glaze, served with house gorgonzola dip and pickled celery.',
      price: 14.5,
      category: 'SIDE',
      imageUrl: 'https://images.unsplash.com/photo-1527477378370-dca75e9f899e?auto=format&fit=crop&w=800&q=80',
      badges: 'SPICY',
      inStock: true,
      isFeatured: false,
      baseSize: '8 pieces',
    },
    // DRINKS
    {
      name: 'San Pellegrino Sparkling Blood Orange',
      slug: 'san-pellegrino-aranciata-rossa',
      description: 'Imported sparkling Italian citrus beverage crafted with sun-ripened Sicilian blood oranges.',
      price: 4.5,
      category: 'DRINK',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGAN',
      inStock: true,
      isFeatured: false,
      baseSize: '330ml Can',
    },
    {
      name: 'San Pellegrino Sparkling Natural Mineral Water',
      slug: 'san-pellegrino-water',
      description: 'Luminous sparkling Italian mineral water from the natural springs of Val Brembana.',
      price: 5.5,
      category: 'DRINK',
      imageUrl: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGAN',
      inStock: true,
      isFeatured: false,
      baseSize: '750ml Glass Bottle',
    },
    // DESSERTS
    {
      name: 'Wood-Fired Nutella & Hazelnut Calzone',
      slug: 'nutella-calzone',
      description: 'Folded hearth crust stuffed with molten warm Nutella, toasted crushed Piedmont hazelnuts, powdered sugar dusting, and a scoop of sweet cream gelato.',
      price: 11.0,
      category: 'DESSERT',
      imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGETARIAN',
      inStock: true,
      isFeatured: true,
      baseSize: 'Serves 2',
    },
    {
      name: 'Traditional Veneto Tiramisu',
      slug: 'traditional-tiramisu',
      description: 'Light espresso-drenched ladyfinger biscuits, whipped mascarpone zabaglione, dusted with bitter Dutch cocoa powder.',
      price: 9.5,
      category: 'DESSERT',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      badges: 'VEGETARIAN',
      inStock: true,
      isFeatured: false,
      baseSize: 'Individual',
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  // 2. Custom Pizza Builder Ingredients
  const ingredients = [
    // Sizes
    { name: '10" Personal', category: 'SIZE', price: 11.0, multiplier: 0.8, isDefault: false, inStock: true },
    { name: '12" Medium', category: 'SIZE', price: 14.0, multiplier: 1.0, isDefault: true, inStock: true },
    { name: '14" Large', category: 'SIZE', price: 18.0, multiplier: 1.3, isDefault: false, inStock: true },
    { name: '16" Party / Family', category: 'SIZE', price: 22.0, multiplier: 1.6, isDefault: false, inStock: true },

    // Crusts
    { name: 'Classic Wood-Fired Hand-Tossed', category: 'CRUST', price: 0.0, multiplier: 1.0, isDefault: true, inStock: true },
    { name: 'Thin & Crispy Roman Style', category: 'CRUST', price: 0.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Fontina & Herb Stuffed Crust', category: 'CRUST', price: 3.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Gluten-Free Artisan Cauliflower Crust', category: 'CRUST', price: 4.0, multiplier: 1.0, isDefault: false, inStock: true },

    // Sauces
    { name: 'San Marzano D.O.P. Tomato', category: 'SAUCE', price: 0.0, multiplier: 1.0, isDefault: true, inStock: true },
    { name: 'Creamy Black Truffle Alfredo', category: 'SAUCE', price: 2.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Smoky Bourbon BBQ', category: 'SAUCE', price: 1.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Fresh Basil & Pine Nut Pesto', category: 'SAUCE', price: 1.5, multiplier: 1.0, isDefault: false, inStock: true },

    // Cheeses
    { name: 'Fior di Latte Mozzarella', category: 'CHEESE', price: 0.0, multiplier: 1.0, isDefault: true, inStock: true },
    { name: 'Double Layer Mozzarella', category: 'CHEESE', price: 2.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Smoked Provolone & Fontina Blend', category: 'CHEESE', price: 2.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Artisan Cashew Vegan Mozzarella', category: 'CHEESE', price: 2.5, multiplier: 1.0, isDefault: false, inStock: true },

    // Toppings - Meats
    { name: 'Artisan Pepperoni', category: 'TOPPING_MEAT', price: 2.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Spicy Calabrian Soppressata', category: 'TOPPING_MEAT', price: 2.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Sweet Italian Fennel Sausage', category: 'TOPPING_MEAT', price: 2.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Wood-Roasted Chicken Breast', category: 'TOPPING_MEAT', price: 2.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Smoked Crispy Bacon Lardons', category: 'TOPPING_MEAT', price: 2.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Prosciutto di Parma (Post-Bake)', category: 'TOPPING_MEAT', price: 3.5, multiplier: 1.0, isDefault: false, inStock: true },

    // Toppings - Veggies
    { name: 'Wood-Roasted Forest Mushrooms', category: 'TOPPING_VEG', price: 1.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Caramelized Sweet Vidalia Onions', category: 'TOPPING_VEG', price: 1.25, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Fire-Roasted Sweet Bell Peppers', category: 'TOPPING_VEG', price: 1.25, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Kalamata Black Olives', category: 'TOPPING_VEG', price: 1.25, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Pickled Fiery Jalapeños', category: 'TOPPING_VEG', price: 1.0, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Marinated Artichoke Hearts', category: 'TOPPING_VEG', price: 1.75, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Roasted Garlic Cloves', category: 'TOPPING_VEG', price: 1.25, multiplier: 1.0, isDefault: false, inStock: true },

    // Toppings - Finishes
    { name: 'Hot Wildflower Honey Drizzle', category: 'TOPPING_FINISH', price: 1.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'White Truffle Infused EVOO', category: 'TOPPING_FINISH', price: 1.75, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Fresh Arugula & Lemon Zest', category: 'TOPPING_FINISH', price: 1.25, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Aged Parmigiano Reggiano Shavings', category: 'TOPPING_FINISH', price: 1.5, multiplier: 1.0, isDefault: false, inStock: true },
    { name: 'Fresh Garden Sweet Basil', category: 'TOPPING_FINISH', price: 0.75, multiplier: 1.0, isDefault: false, inStock: true },
  ];

  for (const ing of ingredients) {
    await prisma.customIngredient.create({ data: ing });
  }

  // 3. Promo Codes
  const promoCodes = [
    {
      code: 'EMBER20',
      discountPercent: 20.0,
      discountAmount: 0.0,
      minOrder: 15.0,
      description: '20% off your entire wood-fired feast',
      isActive: true,
    },
    {
      code: 'FREEDRINK',
      discountPercent: 0.0,
      discountAmount: 4.5,
      minOrder: 20.0,
      description: 'Complimentary San Pellegrino drink ($4.50 off)',
      isActive: true,
    },
    {
      code: 'EMBERSOCIETY15',
      discountPercent: 15.0,
      discountAmount: 0.0,
      minOrder: 10.0,
      description: 'VIP Ember Society 15% Welcome Discount',
      isActive: true,
    },
    {
      code: 'WELCOME10',
      discountPercent: 10.0,
      discountAmount: 0.0,
      minOrder: 10.0,
      description: '10% off for first-time pizza lovers',
      isActive: true,
    },
  ];

  for (const promo of promoCodes) {
    await prisma.promoCode.create({ data: promo });
  }

  // 4. Sample Existing Order for Admin Board Preview
  const sampleOrder = await prisma.order.create({
    data: {
      id: 'ORD-7821',
      customerName: 'Marco Rossi',
      customerEmail: 'marco.rossi@example.com',
      customerPhone: '+1 (555) 234-8901',
      orderType: 'DELIVERY',
      deliveryAddress: '742 Evergreen Terrace, Apt 4B',
      deliveryInstructions: 'Ring buzzer #4, leave by door',
      status: 'BAKING',
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      subtotal: 37.0,
      discount: 7.4,
      deliveryFee: 0.0, // Free delivery over $25
      tax: 2.37,
      total: 31.97,
      promoCode: 'EMBER20',
      notes: 'Extra crispy on the crust please!',
      items: {
        create: [
          {
            name: 'The Ember Margherita',
            isCustom: false,
            size: '12 inch',
            quantity: 1,
            unitPrice: 16.0,
            totalPrice: 16.0,
          },
          {
            name: 'Truffle & Wild Forest Mushroom',
            isCustom: false,
            size: '12 inch',
            quantity: 1,
            unitPrice: 21.0,
            totalPrice: 21.0,
          },
        ],
      },
    },
  });

  // 5. Sample Confirmed Table Reservation
  await prisma.reservation.create({
    data: {
      id: 'RES-8921',
      customerName: 'Sofia Bellini',
      customerEmail: 'sofia.bellini@example.com',
      customerPhone: '+1 (555) 902-1144',
      date: 'Tonight',
      timeSlot: '7:30 PM',
      partySize: 4,
      seatingArea: 'HEARTH_SIDE',
      notes: 'Anniversary celebration dinner! Would love a view of the pizza peel.',
      status: 'CONFIRMED',
    },
  });

  console.log(`Seeding finished successfully. Created sample order ${sampleOrder.id} and reservation RES-8921`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
