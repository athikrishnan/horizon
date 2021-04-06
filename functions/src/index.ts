import * as admin from 'firebase-admin';
admin.initializeApp();

// customer
const onCustomerCreate = require('./customer/on-customer-create.function');
exports.onCustomerCreate = onCustomerCreate.onCustomerCreate;

// invoice
const onInvoiceCreate = require('./invoice/on-invoice-create.function');
exports.onInvoiceCreate = onInvoiceCreate.onInvoiceCreate;

// product
const onProductCreate = require('./product/on-product-create.function');
exports.onProductCreate = onProductCreate.onProductCreate;