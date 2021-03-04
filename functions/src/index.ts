import * as admin from 'firebase-admin';
admin.initializeApp();

// supplier
const onSupplierUpdate = require('./supplier/on-supplier-update.function');
exports.onSupplierUpdate = onSupplierUpdate.onSupplierUpdate;

// item
const onItemUpdate = require('./item/on-item-update.function');
exports.onItemUpdate = onItemUpdate.onItemUpdate;


// pack
const onPackUpdate = require('./pack/on-pack-update.function');
exports.onPackUpdate = onPackUpdate.onPackUpdate;