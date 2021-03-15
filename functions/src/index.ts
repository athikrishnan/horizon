import * as admin from 'firebase-admin';
admin.initializeApp();

// supplier
// const onSupplierCreate = require('./supplier/on-supplier-update.function');
// exports.onSupplierUpdate = onSupplierUpdate.onSupplierUpdate;

// item
// const onItemUpdate = require('./item/on-item-update.function');
// exports.onItemUpdate = onItemUpdate.onItemUpdate;

// pack
// const onPackUpdate = require('./pack/on-pack-update.function');
// exports.onPackUpdate = onPackUpdate.onPackUpdate;

// customer
const onCustomerCreate = require('./customer/on-customer-create.function');
exports.onCustomerCreate = onCustomerCreate.onCustomerCreate;