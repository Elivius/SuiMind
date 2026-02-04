export const PACKAGE_ID = "0x9fde5921ceb9ba13f4bfd073f8c7b31f48b5ad676a088a73132a48835a19a588";
export const MODULE_NAME = "request";
export const TARGETS = {  
    CREATE: `${PACKAGE_ID}::${MODULE_NAME}::create_payment_request`,
    SETTLE: `${PACKAGE_ID}::${MODULE_NAME}::settle_payment_request`,
    REJECT: `${PACKAGE_ID}::${MODULE_NAME}::reject_request`,
};