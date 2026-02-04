export const PACKAGE_ID = "0x3d0082057e44918b7607d5d8972e783b439dc9a7193c591aeeca34dd40f61810";
export const MODULE_NAME = "request";
export const TARGETS = {  
    CREATE: `${PACKAGE_ID}::${MODULE_NAME}::create_payment_request`,
    SETTLE: `${PACKAGE_ID}::${MODULE_NAME}::settle_payment_request`,
    REJECT: `${PACKAGE_ID}::${MODULE_NAME}::reject_request`,
};