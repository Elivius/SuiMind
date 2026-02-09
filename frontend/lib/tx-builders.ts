/*
 * Transaction Builders
 * Pure functions to construct Transaction objects for reuse across hooks.
 */

import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from './config';

interface TransferParams {
    sender: string;
    recipient: string;
    amountMist: number;
    paymentRequestId?: string;
}

interface CreatePaymentRequestParams {
    sender: string;
    recipient: string;
    amountMist: number;
    code: string;
    expirationTimestamp: number;
}

interface RejectRequestParams {
    requestId: string;
}

interface DeleteNotificationParams {
    objectId: string;
    type: 'paid' | 'reject';
}

/**
 * Build a SUI transfer transaction.
 */
export function buildTransferTx({ sender, recipient, amountMist, paymentRequestId }: TransferParams): Transaction {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [amountMist]);
    tx.transferObjects([coin], recipient);
    tx.setSender(sender);

    if (paymentRequestId) {
        tx.moveCall({
            target: `${PACKAGE_ID}::request::settle_payment_request`,
            arguments: [tx.object(paymentRequestId)],
        });
    }

    return tx;
}

/**
 * Build a payment request creation transaction.
 */
export function buildCreatePaymentRequestTx({ sender, recipient, amountMist, code, expirationTimestamp }: CreatePaymentRequestParams): Transaction {
    const tx = new Transaction();
    tx.setSender(sender);
    tx.moveCall({
        target: `${PACKAGE_ID}::request::create_payment_request`,
        arguments: [
            tx.pure.address(recipient),
            tx.pure.u64(amountMist),
            tx.pure.string(code),
            tx.pure.u64(expirationTimestamp),
        ],
    });
    return tx;
}

/**
 * Build a request rejection transaction.
 */
export function buildRejectRequestTx({ requestId }: RejectRequestParams): Transaction {
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::request::reject_request`,
        arguments: [tx.object(requestId)],
    });
    return tx;
}

/**
 * Build a delete notification transaction.
 */
export function buildDeleteNotificationTx({ objectId, type }: DeleteNotificationParams): Transaction {
    const tx = new Transaction();
    const func = type === 'paid' ? 'delete_paid' : 'delete_reject';
    tx.moveCall({
        target: `${PACKAGE_ID}::request::${func}`,
        arguments: [tx.object(objectId)],
    });
    return tx;
}
