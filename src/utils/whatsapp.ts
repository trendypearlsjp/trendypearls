import type { Product } from '../types/product';

const DEFAULT_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '15551234567';

export function buildWhatsAppOrderUrl(
  product: Product,
  quantity = 1,
  customerNote = '',
  targetPhone = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');

  const formattedPrice = `$${(product.price * quantity).toFixed(2)}`;
  const unitPrice = `$${product.price.toFixed(2)}`;

  let text = `🛍️ *NEW ORDER INQUIRY*\n`;
  text += `------------------------------\n`;
  text += `📌 *Product:* ${product.name}\n`;
  text += `🏷️ *SKU:* ${product.sku}\n`;
  text += `💵 *Price:* ${unitPrice} ${quantity > 1 ? `x ${quantity} = ${formattedPrice}` : ''}\n`;
  text += `📦 *Availability:* ${product.stockStatus.toUpperCase().replace('_', ' ')}\n`;
  text += `📸 *Image Link:* ${product.imageUrl}\n`;

  if (customerNote.trim()) {
    text += `\n💬 *Customer Note/Size:* ${customerNote.trim()}\n`;
  }

  text += `------------------------------\n`;
  text += `Hello! I would like to place an order for this item. Please confirm availability and payment details. Thank you!`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
