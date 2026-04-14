/**
 * ComeCabos — MercadoPago Integration
 *
 * INSTRUCCIONES PARA EL PROGRAMADOR:
 * ====================================
 * 1. Crear cuenta en mercadopago.com.mx
 * 2. Ir a: Tu negocio → Herramientas para devs → Credenciales
 * 3. Copiar Public Key de PRODUCCIÓN y pegarla abajo
 * 4. Implementar el backend para crear preferencias (ver sección BACKEND)
 * 5. Reemplazar la función checkout() en cart.js para llamar al backend
 *
 * DOCUMENTACIÓN OFICIAL:
 * https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/landing
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const MP_PUBLIC_KEY = "TU_PUBLIC_KEY_AQUI"; // ← Reemplazar con tu Public Key real

// ============================================
// INICIALIZAR SDK
// ============================================
// Agregar este script en el <head> de cada página de restaurante:
// <script src="https://sdk.mercadopago.com/js/v2"></script>

let mp = null;

function initMercadoPago() {
  if (typeof MercadoPago !== 'undefined') {
    mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-MX' });
    console.log('MercadoPago inicializado');
  } else {
    console.warn('SDK de MercadoPago no cargado');
  }
}

// ============================================
// CREAR PREFERENCIA DE PAGO
// ============================================
/**
 * IMPORTANTE: Esto requiere un backend (Node.js, PHP, etc.)
 * porque no puedes usar tu Access Token en el frontend.
 *
 * Ejemplo de backend en Node.js (Express):
 *
 * const { MercadoPagoConfig, Preference } = require('mercadopago');
 * const client = new MercadoPagoConfig({ accessToken: 'TU_ACCESS_TOKEN' });
 *
 * app.post('/api/crear-pago', async (req, res) => {
 *   const { items, payer } = req.body;
 *   const preference = new Preference(client);
 *   const result = await preference.create({
 *     body: {
 *       items,
 *       payer,
 *       back_urls: {
 *         success: 'https://comecabos.mx/pago-exitoso',
 *         failure: 'https://comecabos.mx/pago-fallido',
 *       },
 *       auto_return: 'approved',
 *       notification_url: 'https://comecabos.mx/api/webhook',
 *     }
 *   });
 *   res.json({ id: result.id });
 * });
 */

async function createPaymentPreference(cartItems, customerData) {
  // Formatea items para MercadoPago
  const items = Object.values(cartItems).map(item => ({
    id: item.id || item.name,
    title: item.name,
    quantity: item.qty,
    unit_price: item.price,
    currency_id: 'MXN',
  }));

  // Agrega costo de envío como item
  items.push({
    id: 'envio',
    title: 'Costo de envío',
    quantity: 1,
    unit_price: 50,
    currency_id: 'MXN',
  });

  // Llama a tu backend para crear la preferencia
  // REEMPLAZA esta URL con tu endpoint real
  const response = await fetch('/api/crear-pago', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      payer: {
        phone: { number: customerData.phone },
      },
      metadata: {
        delivery_address: customerData.address,
        restaurant: customerData.restaurant,
      },
    }),
  });

  const data = await response.json();
  return data.id; // preference ID
}

// ============================================
// ABRIR CHECKOUT DE MERCADOPAGO
// ============================================
async function openMercadoPagoCheckout(cartItems, customerData) {
  try {
    const preferenceId = await createPaymentPreference(cartItems, customerData);

    // Redirige al checkout de MercadoPago
    window.location.href = `https://www.mercadopago.com.mx/checkout/v1/redirect?preference-id=${preferenceId}`;

  } catch (error) {
    console.error('Error al crear pago:', error);
    alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
  }
}

// ============================================
// WEBHOOK — Confirmar pagos (backend)
// ============================================
/**
 * Cuando MercadoPago confirma un pago, manda un POST a tu webhook.
 * Implementar en el backend para:
 * 1. Verificar el pago con la API de MP
 * 2. Notificar al restaurante (WhatsApp/email)
 * 3. Guardar el pedido en la base de datos
 *
 * app.post('/api/webhook', async (req, res) => {
 *   const { type, data } = req.body;
 *   if (type === 'payment') {
 *     const payment = await mp.payment.findById(data.id);
 *     if (payment.status === 'approved') {
 *       // Notificar al restaurante
 *       // Guardar pedido
 *     }
 *   }
 *   res.sendStatus(200);
 * });
 */

// Init al cargar
document.addEventListener('DOMContentLoaded', initMercadoPago);
