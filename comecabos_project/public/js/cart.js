/**
 * ComeCabos — Cart Logic
 * Maneja el carrito de compras en las páginas de restaurantes
 *
 * USO:
 * 1. Define window.MENU_DATA con los platillos del restaurante
 * 2. Define window.RESTAURANT_NAME con el nombre del restaurante
 * 3. Incluye este script al final del body
 */

// ============================================
// CONFIGURACIÓN — EDITAR ANTES DE PRODUCCIÓN
// ============================================
const WHATSAPP_NUMBER = "526241234567"; // ← Reemplaza con tu número real
const DELIVERY_FEE = 50;               // Costo de envío en MXN

// ============================================
// ESTADO DEL CARRITO
// ============================================
let cart = {};

// ============================================
// RENDERIZAR SECCIONES DEL MENÚ
// ============================================
function renderSection(sectionId, items) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  el.innerHTML = items.map(item => `
    <div class="menu-item">
      <div class="item-left">
        <div class="item-name">${item.name}</div>
        ${item.desc ? `<div class="item-desc">${item.desc}</div>` : ''}
      </div>
      <div class="item-price">$${item.price}</div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty('${item.id}',-1,${item.price},'${item.name.replace(/'/g,"\\'")}')">−</button>
        <span class="qty-num" id="qty-${item.id}">0</span>
        <button class="qty-btn plus" onclick="changeQty('${item.id}',1,${item.price},'${item.name.replace(/'/g,"\\'")}')">+</button>
      </div>
    </div>
  `).join('');
}

// ============================================
// CAMBIAR CANTIDAD
// ============================================
function changeQty(id, delta, price, name) {
  if (!cart[id]) cart[id] = { qty: 0, price, name };
  cart[id].qty = Math.max(0, cart[id].qty + delta);
  if (cart[id].qty === 0) delete cart[id];

  const el = document.getElementById('qty-' + id);
  if (el) el.textContent = cart[id]?.qty || 0;

  updateCartUI();
}

// ============================================
// CÁLCULOS
// ============================================
function getSubtotal() {
  return Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
}

function getCount() {
  return Object.values(cart).reduce((s, i) => s + i.qty, 0);
}

// ============================================
// ACTUALIZAR UI
// ============================================
function updateCartUI() {
  const subtotal = getSubtotal();
  const count = getCount();
  const total = subtotal + DELIVERY_FEE;

  // Desktop
  const dc = document.getElementById('cart-content-desktop');
  if (dc) dc.innerHTML = buildCartHTML(subtotal, count);

  // FAB móvil
  const fab = document.getElementById('cart-fab');
  if (fab) {
    fab.style.display = count > 0 ? 'block' : 'none';
    const fabTotal = document.getElementById('fab-total');
    if (fabTotal) fabTotal.textContent = total.toLocaleString('es-MX');
  }
}

// ============================================
// CONSTRUIR HTML DEL CARRITO
// ============================================
function buildCartHTML(subtotal, count) {
  if (count === 0) {
    return '<div class="cart-empty">Agrega platillos para empezar</div>';
  }

  const itemsHTML = Object.entries(cart).map(([id, { name, price, qty }]) => `
    <div class="cart-line">
      <span>${name} ×${qty}</span>
      <span style="color:var(--accent)">$${(price * qty).toLocaleString('es-MX')}</span>
    </div>
  `).join('');

  return `
    ${itemsHTML}
    <div class="cart-totals">
      <div class="cart-row">
        <span class="label">Subtotal</span>
        <span>$${subtotal.toLocaleString('es-MX')}</span>
      </div>
      <div class="cart-row">
        <span class="label">Envío</span>
        <span>$${DELIVERY_FEE}</span>
      </div>
      <div class="cart-row total">
        <span class="label">Total</span>
        <span style="color:var(--accent)">$${(subtotal + DELIVERY_FEE).toLocaleString('es-MX')}</span>
      </div>
    </div>
    <div style="margin-top:16px;">
      <input class="input-field" id="addr" placeholder="📍 Dirección de entrega" />
      <input class="input-field" id="phone" placeholder="📱 Tu WhatsApp" />
      <button class="pay-btn" onclick="checkout()">Pagar con MercadoPago →</button>
      <div class="secure-note">🔒 Pago seguro · Tarjeta, OXXO o transferencia</div>
    </div>
  `;
}

// ============================================
// MODAL MÓVIL
// ============================================
function openModal() {
  const subtotal = getSubtotal();
  const count = getCount();
  const el = document.getElementById('cart-content-mobile');
  if (el) el.innerHTML = buildCartHTML(subtotal, count);
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.style.display = 'none';
}

// ============================================
// CHECKOUT — WhatsApp + MercadoPago
// ============================================
function checkout() {
  const addr = (document.getElementById('addr')?.value || '').trim();
  const phone = (document.getElementById('phone')?.value || '').trim();

  if (!addr) { alert('Por favor ingresa tu dirección de entrega'); return; }
  if (!phone) { alert('Por favor ingresa tu número de WhatsApp'); return; }

  const subtotal = getSubtotal();
  const total = subtotal + DELIVERY_FEE;
  const restaurant = window.RESTAURANT_NAME || 'ComeCabos';

  // Construir mensaje para WhatsApp
  const itemsList = Object.values(cart)
    .map(i => `• ${i.name} ×${i.qty} = $${(i.price * i.qty).toLocaleString('es-MX')}`)
    .join('%0A');

  const msg = [
    `🌮 *Nuevo pedido - ${restaurant}*`,
    ``,
    itemsList,
    ``,
    `📍 Dirección: ${addr}`,
    `📱 WhatsApp cliente: ${phone}`,
    ``,
    `💰 Subtotal: $${subtotal.toLocaleString('es-MX')}`,
    `🛵 Envío: $${DELIVERY_FEE}`,
    `✅ *Total: $${total.toLocaleString('es-MX')} MXN*`,
  ].join('%0A');

  // TODO: Reemplazar con MercadoPago Checkout Pro cuando esté configurado
  // Ver js/mercadopago.js para la integración
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');

  // Limpiar
  closeModal();
  cart = {};

  // Re-renderizar menú
  if (window.MENU_DATA) {
    Object.keys(window.MENU_DATA).forEach(sec =>
      renderSection(sec, window.MENU_DATA[sec])
    );
  }
  updateCartUI();

  alert('¡Pedido enviado! Te contactaremos por WhatsApp para confirmar y procesar el pago.');
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.MENU_DATA) {
    Object.keys(window.MENU_DATA).forEach(sec =>
      renderSection(sec, window.MENU_DATA[sec])
    );
  }
  updateCartUI();
});
