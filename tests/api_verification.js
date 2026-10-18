// Farzi RestaurantOS - Comprehensive Automated Verification Suite
import http from 'http';

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let testOrderNumber = '';
let testDishId = 0;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    ...(options.body ? { body: JSON.stringify(options.body) } : {})
  };

  const res = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   FARZI RESTAURANTOS — VERIFICATION SUITE');
  console.log('======================================================\n');

  // Test 1: Health Check
  console.log('▶ [Test 1] Health Check');
  const health = await request('/api/health');
  assert(health.status === 200, 'Health endpoint returns HTTP 200');
  assert(health.data?.status === 'ONLINE', 'Service status is ONLINE');

  // Test 2: Authentication Security & Rate Limiting
  console.log('\n▶ [Test 2] Authentication & Provisioned Admin Login');
  const badLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'admin@restaurantos.com', password: 'WrongPassword123' }
  });
  assert(badLogin.status === 401, 'Bad credentials correctly rejected with HTTP 401');

  const goodLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'admin@restaurantos.com', password: 'SecureAdminPass@2026' }
  });
  assert(goodLogin.status === 200, 'Provisioned administrator login succeeds');
  assert(!!goodLogin.data?.data?.token, 'JWT bearer token received in auth response');
  assert(goodLogin.data?.data?.user?.role === 'ADMIN', 'Administrator has role ADMIN');
  authToken = goodLogin.data.data.token;

  // Test 3: Session Verification
  console.log('\n▶ [Test 3] Session Verification (/api/auth/me)');
  const me = await request('/api/auth/me', { token: authToken });
  assert(me.status === 200, 'Authenticated /api/auth/me returns HTTP 200');
  assert(me.data?.data?.email === 'admin@restaurantos.com', 'Current user matches provisioned admin');

  // Test 4: Role-Based Access Control (RBAC)
  console.log('\n▶ [Test 4] RBAC Protection');
  const unauthMenu = await request('/api/admin/menu');
  assert(unauthMenu.status === 401, 'Protected /api/admin/menu without token returns 401');

  const badTokenMenu = await request('/api/admin/menu', { token: 'invalid.jwt.token' });
  assert(badTokenMenu.status === 401, 'Protected /api/admin/menu with corrupted token returns 401');

  // Test 5: Public Menu Catalog
  console.log('\n▶ [Test 5] Public Menu & Dish Detail');
  const menu = await request('/api/public/menu');
  assert(menu.status === 200, 'Public menu loaded with HTTP 200');
  assert(Array.isArray(menu.data?.data) && menu.data.data.length > 0, 'Menu contains dishes');
  const firstDish = menu.data.data[0];
  assert(typeof firstDish.price === 'number', 'Dish price is numeric');

  const dishDetail = await request(`/api/public/menu/${firstDish.id}`);
  assert(dishDetail.status === 200, `Single dish detail loaded for ID ${firstDish.id}`);
  assert(dishDetail.data?.data?.name === firstDish.name, 'Dish name matches catalog record');

  // Test 6: Ordering Security & Server-Authoritative Billing
  console.log('\n▶ [Test 6] Order Submission Validations & Pricing Authority');
  
  // Rejection 6a: Invalid Table Station
  const badTableOrder = await request('/api/public/orders', {
    method: 'POST',
    body: {
      tableNumber: 'INVALID_TABLE_999',
      items: [{ menuItemId: firstDish.id, quantity: 1 }]
    }
  });
  assert(badTableOrder.status === 400, 'Order on unconfigured table station rejected with HTTP 400');

  // Rejection 6b: Empty items array
  const emptyOrder = await request('/api/public/orders', {
    method: 'POST',
    body: { tableNumber: 'T01', items: [] }
  });
  assert(emptyOrder.status === 400, 'Empty items order rejected with HTTP 400');

  // Rejection 6c: Invalid quantity
  const badQtyOrder = await request('/api/public/orders', {
    method: 'POST',
    body: { tableNumber: 'T01', items: [{ menuItemId: firstDish.id, quantity: 0 }] }
  });
  assert(badQtyOrder.status === 400, 'Zero quantity item rejected with HTTP 400');

  // Security test 6d: Price tampering attempt
  // Client attempts to pay ₹1 for a ₹495 dish
  const idempotencyKey = `test-order-${Date.now()}`;
  const validOrder = await request('/api/public/orders', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: {
      tableNumber: 'T02',
      customerName: 'Test Dining Guest',
      items: [
        {
          menuItemId: firstDish.id,
          quantity: 2,
          price: 1 // Manipulated price by malicious client
        }
      ]
    }
  });
  assert(validOrder.status === 201, 'Valid order submitted successfully with HTTP 201');
  const orderData = validOrder.data.data;
  testOrderNumber = orderData.orderNumber;
  
  // Verify server ignored client's manipulated price (₹1) and used server's actual price
  const expectedSubtotal = Number((firstDish.price * 2).toFixed(2));
  assert(orderData.subtotal === expectedSubtotal, `Server authoritative price enforced: Subtotal ₹${orderData.subtotal} matches expected ₹${expectedSubtotal} (tampered client price ignored)`);
  assert(orderData.tax > 0, `Tax computed dynamically: ₹${orderData.tax}`);
  assert(orderData.total === Number((orderData.subtotal + orderData.tax).toFixed(2)), 'Final total arithmetic matches subtotal + tax');

  // Test 7: Order Idempotency
  console.log('\n▶ [Test 7] Order Idempotency Handling');
  const duplicateOrder = await request('/api/public/orders', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: {
      tableNumber: 'T02',
      items: [{ menuItemId: firstDish.id, quantity: 2 }]
    }
  });
  assert(duplicateOrder.status === 200, 'Duplicate submission with same idempotency key returns HTTP 200');
  assert(duplicateOrder.data?.data?.orderNumber === testOrderNumber, 'Idempotent response returns existing order without creating duplicate');

  // Test 8: Order Tracking
  console.log('\n▶ [Test 8] Order Tracking via Order Number');
  const trackedOrder = await request(`/api/public/orders/${testOrderNumber}`);
  assert(trackedOrder.status === 200, 'Order successfully tracked by order number');
  assert(trackedOrder.data?.data?.tableNumber === 'T02', 'Tracked order matches table station');

  // Test 9: Table Occupancy State Synchronization
  console.log('\n▶ [Test 9] Table State Synchronization');
  const tablesAfterOrder = await request('/api/public/tables');
  const tableT02 = tablesAfterOrder.data.data.find(t => t.tableNumber === 'T02');
  assert(tableT02.status === 'OCCUPIED', 'Table T02 transitioned to OCCUPIED on order placement');

  // Admin completes order -> Table should transition back to AVAILABLE
  const completeOrder = await request(`/api/admin/orders/${orderData.id}/status`, {
    method: 'PUT',
    token: authToken,
    body: { status: 'COMPLETED' }
  });
  assert(completeOrder.status === 200, 'Order status updated to COMPLETED by admin');

  const tablesAfterComplete = await request('/api/public/tables');
  const tableT02Freed = tablesAfterComplete.data.data.find(t => t.tableNumber === 'T02');
  assert(tableT02Freed.status === 'AVAILABLE', 'Table T02 automatically freed (AVAILABLE) upon order completion');

  // Test 10: Reservation Validation & Handling
  console.log('\n▶ [Test 10] Reservation Strict Validations & State Handling');
  
  // Rejection: past date
  const pastRes = await request('/api/public/reservations', {
    method: 'POST',
    body: {
      name: 'Dr. Kabir Roy',
      email: 'kabir@hospital.com',
      phone: '+91 98111 22233',
      reservationDate: '2020-01-01',
      reservationTime: '19:30',
      guests: 4
    }
  });
  assert(pastRes.status === 400, 'Past reservation date rejected with HTTP 400');

  // Rejection: invalid email
  const badEmailRes = await request('/api/public/reservations', {
    method: 'POST',
    body: {
      name: 'Dr. Kabir Roy',
      email: 'not-an-email',
      phone: '+91 98111 22233',
      reservationDate: '2026-12-25',
      reservationTime: '19:30',
      guests: 4
    }
  });
  assert(badEmailRes.status === 400, 'Malformed email address rejected with HTTP 400');

  // Valid reservation
  const validRes = await request('/api/public/reservations', {
    method: 'POST',
    body: {
      name: 'Dr. Kabir Roy',
      email: 'kabir@royhospital.com',
      phone: '+91 98111 22233',
      reservationDate: '2026-12-25',
      reservationTime: '20:00',
      guests: 4,
      specialRequest: 'Window table with tasting menu'
    }
  });
  assert(validRes.status === 201, 'Valid reservation accepted with HTTP 201');
  assert(validRes.data?.data?.status === 'PENDING', 'New reservation created in PENDING state');
  const resId = validRes.data.data.id;

  // Admin updates reservation
  const updateRes = await request(`/api/admin/reservations/${resId}`, {
    method: 'PUT',
    token: authToken,
    body: { status: 'CONFIRMED', tableNumber: 'T07', adminNote: 'Chef notified of VIP tasting' }
  });
  assert(updateRes.status === 200, 'Admin confirmed reservation and assigned table T07');
  assert(updateRes.data?.data?.status === 'CONFIRMED', 'Reservation status updated to CONFIRMED');

  // Test 11: Admin Menu CRUD Workflow
  console.log('\n▶ [Test 11] Menu Item Management Workflow (CRUD)');
  const createDish = await request('/api/admin/menu', {
    method: 'POST',
    token: authToken,
    body: {
      name: 'Liquid Nitrogen Malai Kulfi',
      categoryId: 5,
      price: 525,
      description: 'Artisanal saffron kulfi frozen live table-side with nitrogen smoke',
      spiceLevel: 'NONE',
      isVeg: true,
      isChefSpecial: true
    }
  });
  assert(createDish.status === 201, 'Admin created new specialty dish (HTTP 201)');
  testDishId = createDish.data.data.id;

  // Verify public menu now includes this dish
  const verifyMenu = await request('/api/public/menu');
  const foundDish = verifyMenu.data.data.find(d => d.id === testDishId);
  assert(foundDish && foundDish.name === 'Liquid Nitrogen Malai Kulfi', 'New dish immediately visible on public menu');

  // Update dish
  const updateDish = await request(`/api/admin/menu/${testDishId}`, {
    method: 'PUT',
    token: authToken,
    body: { price: 575 }
  });
  assert(updateDish.status === 200, 'Admin updated dish price to ₹575');
  assert(updateDish.data?.data?.price === 575, 'Dish price updated in response');

  // Delete dish
  const deleteDish = await request(`/api/admin/menu/${testDishId}`, {
    method: 'DELETE',
    token: authToken
  });
  assert(deleteDish.status === 200, 'Admin deleted test dish');

  // Test 12: Public Contact Message & Admin Review
  console.log('\n▶ [Test 12] Customer Contact Inquiries');
  const contact = await request('/api/public/contact', {
    method: 'POST',
    body: {
      name: 'Meera Rajput',
      email: 'meera@rajputmedia.com',
      subject: 'Private Terrace Gala Booking',
      message: 'Looking to reserve the entire terrace garden for 35 guests next Friday.'
    }
  });
  assert(contact.status === 201, 'Contact inquiry submitted successfully with HTTP 201');

  const adminContacts = await request('/api/admin/contact', { token: authToken });
  assert(adminContacts.status === 200, 'Admin retrieved contact inquiries');
  const foundMsg = adminContacts.data.data.find(m => m.email === 'meera@rajputmedia.com');
  assert(!!foundMsg, 'Customer inquiry found in admin inquiries store');

  // Test 13: Admin Settings & Dynamic Tax Rate Update
  console.log('\n▶ [Test 13] Settings Update & Dynamic Tax');
  const updateSettings = await request('/api/admin/settings', {
    method: 'PUT',
    token: authToken,
    body: { taxPercentage: 12.0 }
  });
  assert(updateSettings.status === 200, 'Settings updated with 12% tax rate');
  assert(updateSettings.data?.data?.taxPercentage === 12, 'Tax rate saved as 12% in settings');

  // Reset tax back to 5% standard
  await request('/api/admin/settings', {
    method: 'PUT',
    token: authToken,
    body: { taxPercentage: 5.0 }
  });

  console.log('\n======================================================');
  console.log('   ALL 13 ACCEPTANCE TESTS PASSED SUCCESSFULLY! ✓');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ Test suite aborted with unexpected error:', err);
  process.exit(1);
});
