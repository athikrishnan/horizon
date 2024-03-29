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

// completed invoice
const onCompletedInvoiceCreate = require('./invoice/on-completed-invoice-create.function');
exports.onCompletedInvoiceCreate = onCompletedInvoiceCreate.onCompletedInvoiceCreate;

// invoice payment
const onInvoicePaymentCreate = require('./invoice/on-invoice-payment-create.function');
exports.onInvoicePaymentCreate = onInvoicePaymentCreate.onInvoicePaymentCreate;

// proforma
const onProformaCreate = require('./proforma/on-proforma-create.function');
exports.onProformaCreate = onProformaCreate.onProformaCreate;

// product
const onProductCreate = require('./product/on-product-create.function');
exports.onProductCreate = onProductCreate.onProductCreate;

// stock change
const onStockChangeCreate = require('./stockChange/on-stack-change-create.function');
exports.onStockChangeCreate = onStockChangeCreate.onStockChangeCreate;

// purchase
const onPurchaseCreate = require('./purchase/on-purchase-create.function');
exports.onPurchaseCreate = onPurchaseCreate.onPurchaseCreate;

// completed purchase
const onCompletedPurchaseCreate = require('./purchase/on-completed-purchase-create.function');
exports.onCompletedPurchaseCreate = onCompletedPurchaseCreate.onCompletedPurchaseCreate;

// sale return
const onSaleReturnCreate = require('./sale-return/on-sale-return-create.function');
exports.onSaleReturnCreate = onSaleReturnCreate.onSaleReturnCreate;

// completed sale return
const onCompletedSaleReturnCreate = require('./sale-return/on-completed-sale-return-create.function');
exports.onCompletedSaleReturnCreate = onCompletedSaleReturnCreate.onCompletedSaleReturnCreate;

// quote
const onQuoteCreate = require('./quote/on-quote-create.function');
exports.onQuoteCreate = onQuoteCreate.onQuoteCreate;