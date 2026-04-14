# ComeCabos 🌊
**Marketplace de comida local para Los Cabos, BCS**

---

## Descripción
ComeCabos conecta restaurantes locales de San José del Cabo y Cabo San Lucas con clientes y turistas. Modelo similar a Uber Eats pero local, con comisiones más bajas y enfoque en negocios de la comunidad.

---

## Stack tecnológico
- **Frontend:** HTML5, CSS3, JavaScript vanilla (sin frameworks)
- **Fuentes:** Google Fonts — Playfair Display + DM Sans
- **Pagos:** MercadoPago Checkout Pro (pendiente de configurar)
- **Pedidos fallback:** WhatsApp API (wa.me)
- **Deploy:** Vercel (recomendado) o cualquier hosting estático

---

## Estructura del proyecto

```
comecabos/
├── index.html              # Página principal — listado de restaurantes
├── pages/
│   └── ktrina.html         # Página de La K-Trina (template de restaurante)
├── css/
│   └── global.css          # Estilos globales compartidos (variables, nav, footer)
├── js/
│   ├── cart.js             # Lógica del carrito de compras
│   └── mercadopago.js      # Integración MercadoPago
├── assets/
│   └── (logos, imágenes de restaurantes)
├── vercel.json             # Configuración de rutas para Vercel
└── README.md               # Este archivo
```

---

## Configuración antes de deploy

### 1. MercadoPago
Abre `js/mercadopago.js` y reemplaza:
```js
const MP_PUBLIC_KEY = "TU_PUBLIC_KEY_AQUI";
```
Para obtener tu Public Key:
1. Crea cuenta en mercadopago.com.mx
2. Ve a Tu negocio → Herramientas para devs → Credenciales
3. Copia tu **Public Key** de producción

### 2. WhatsApp
En `js/cart.js` reemplaza:
```js
const WHATSAPP_NUMBER = "526241234567"; // ← tu número con código de país
```

### 3. Dominio personalizado (Vercel)
En el dashboard de Vercel:
- Settings → Domains → Add → `comecabos.mx`
- Vercel te da los registros DNS a configurar en tu registrador

---

## Cómo agregar un nuevo restaurante

1. Duplica `pages/ktrina.html` → renómbralo ej. `pages/mariscos-capitan.html`
2. Edita el array `menuData` con los platillos del nuevo restaurante
3. Agrega una tarjeta en `index.html` apuntando a la nueva página:
```html
<div class="rest-card" onclick="window.location.href='pages/mariscos-capitan.html'">
  ...
</div>
```

---

## Modelo de negocio

| Fuente | Detalle | Estimado |
|--------|---------|----------|
| Comisión por pedido | 8–10% del ticket | Variable |
| Suscripción restaurante | $299–$599 MXN/mes | Fijo |
| Lugar destacado | $500–$800 MXN/mes | Fijo |

**Meta mes 1:** 10 restaurantes × $299 = $2,990 MXN fijos + comisiones

---

## Deploy en Vercel

```bash
# Si usas Vercel CLI
npm i -g vercel
cd comecabos
vercel

# O simplemente arrastra la carpeta en vercel.com/new
```

---

## Restaurantes activos

| Restaurante | Archivo | Estado |
|-------------|---------|--------|
| La K-Trina | `pages/ktrina.html` | ✅ Activo |
| (siguiente) | `pages/...` | 🔜 Próximamente |

---

## Contacto del proyecto
- **Dueño:** ComeCabos
- **Ubicación:** San José del Cabo, BCS, México
- **WhatsApp negocios:** +52 624 XXX XXXX

---

*Versión 1.0 — Abril 2025*
