import * as admin from 'firebase-admin';
admin.initializeApp();

// auth
const onAuthCreate = require('./auth/on-auth-create.function');
exports.onAuthCreate = onAuthCreate.onAuthCreate;

// supplier
const onSupplierCreate = require('./supplier/on-supplier-create.function');
exports.onSupplierCreate = onSupplierCreate.onSupplierCreate;

// customer
const onCustomerCreate = require('./customer/on-customer-create.function');
exports.onCustomerCreate = onCustomerCreate.onCustomerCreate;

// invoice
const onInvoiceCreate = require('./invoice/on-invoice-create.function');
exports.onInvoiceCreate = onInvoiceCreate.onInvoiceCreate;

// product
const onProductCreate = require('./product/on-product-create.function');
exports.onProductCreate = onProductCreate.onProductCreate;

// purchase
const onPurchaseCreate = require('./purchase/on-purchase-create.function');
exports.onPurchaseCreate = onPurchaseCreate.onPurchaseCreate;

// quote
const onQuoteCreate = require('./quote/on-quote-create.function');
exports.onQuoteCreate = onQuoteCreate.onQuoteCreate;