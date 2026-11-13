import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      deliveryAddress,
      deliveryInstructions,
      pickupTime,
      paymentMethod,
      items,
      promoCode,
      notes,
    } = body;

    // Validation
    if (!customerName || !customerEmail || !customerPhone || !orderType || !items || !items.length) {
      return NextResponse.json(
        { error: 'Missing required order fields (customer name, email, phone, order type, items).' },
        { status: 400 }
      );
    }

    if (orderType === 'DELIVERY' && !deliveryAddress) {
      return NextResponse.json(
        { error: 'Delivery address is required for delivery orders.' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    let subtotal = 0;
    const formattedItems = items.map((item: any) => {
      const unitPrice = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10) || 1;
      const totalPrice = Math.round(unitPrice * quantity * 100) / 100;
      subtotal += totalPrice;

      return {
        menuItemId: item.menuItemId || null,
        name: item.name,
        isCustom: Boolean(item.isCustom),
        size: item.customDetails?.size || null,
        crust: item.customDetails?.crust || null,
        sauce: item.customDetails?.sauce || null,
        cheese: item.customDetails?.cheese || null,
        toppings: item.customDetails?.toppings ? JSON.stringify(item.customDetails.toppings) : null,
        quantity,
        unitPrice,
        totalPrice,
        itemNotes: item.itemNotes || null,
      };
    });

    subtotal = Math.round(subtotal * 100) / 100;

    // Promo code validation
    let discount = 0;
    let appliedCode = null;

    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase();
      const promoRecord = await prisma.promoCode.findUnique({
        where: { code: cleanCode },
      });

      if (promoRecord && promoRecord.isActive && subtotal >= promoRecord.minOrder) {
        appliedCode = promoRecord.code;
        if (promoRecord.discountPercent > 0) {
          discount = (subtotal * promoRecord.discountPercent) / 100;
        } else if (promoRecord.discountAmount > 0) {
          discount = promoRecord.discountAmount;
        }
        discount = Math.min(Math.round(discount * 100) / 100, subtotal);
      }
    }

    // Delivery fee
    let deliveryFee = 0;
    if (orderType === 'DELIVERY') {
      deliveryFee = subtotal >= 25.0 ? 0 : 3.99;
    }

    // Tax (8% on discounted subtotal)
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.08 * 100) / 100;

    // Grand total
    const total = Math.max(0, Math.round((taxable + deliveryFee + tax) * 100) / 100);

    // Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        orderType,
        deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : null,
        deliveryInstructions: deliveryInstructions || null,
        pickupTime: orderType === 'PICKUP' ? (pickupTime || 'ASAP (20-25 mins)') : null,
        status: 'RECEIVED',
        paymentMethod: paymentMethod || 'CARD',
        paymentStatus: 'PAID',
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        promoCode: appliedCode,
        notes: notes || null,
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      order: newOrder,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json(
      { error: 'Failed to place order', details: error.message },
      { status: 500 }
    );
  }
}

