module transaction::request {
    use sui::event;
    use std::string::String;

    // --- Structs ---

    public struct PaymentRequestCreated has copy, drop {
        request_id: ID,
        requester: address,
        recipient: address,
        amount: u64,
        request_code: String,
        expiration: u64,
    }

    public struct PaymentRequest has key, store {
        id: UID,
        requester: address,
        recipient: address,
        amount: u64,
        request_code: String,
        expiration: u64,
    }


    public struct RejectedPayment has key, store {
        id: UID,
        original_request_id: ID,
        rejected_by: address,
        amount: u64,
        request_code: String,
    }

    public struct PaidNotification has key, store {
        id: UID,
        amount: u64,
        paid_by: address,
        request_code: String,
    }

    // --- Functions ---

    public fun create_payment_request(
        recipient: address,
        amount: u64,
        request_code: String,
        expiration: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let id_ = object::new(ctx);
        let inner_id = object::uid_to_inner(&id_);

        let request = PaymentRequest {
            id: id_,
            requester: sender,
            recipient,
            amount,
            request_code,
            expiration,
        };

        event::emit(PaymentRequestCreated {
            request_id: inner_id,
            requester: sender,
            recipient,
            amount,
            request_code,
            expiration,
        });

        transfer::public_transfer(request, recipient);
    }

    public fun settle_payment_request(
        request: PaymentRequest,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(tx_context::sender(ctx) == request.recipient, 0);
        let PaymentRequest {
            id,
            requester,
            recipient: _,
            amount,
            request_code,
            expiration: _,
        } = request;

        let notification = PaidNotification {
            id: object::new(ctx),
            amount,
            paid_by: sender,
            request_code,
        };
        
        transfer::public_transfer(notification, requester);
        object::delete(id);
    }

    public fun reject_request(request: PaymentRequest, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        assert!(sender == request.recipient, 0);

        let PaymentRequest { 
            id, 
            requester, 
            recipient: _, 
            amount, 
            request_code, 
            expiration: _ 
        } = request;

        let original_id = object::uid_to_inner(&id);

        let rejected_obj = RejectedPayment {
            id: object::new(ctx),
            original_request_id: original_id,
            rejected_by: sender,
            amount,
            request_code,
        };

        object::delete(id);

        transfer::public_transfer(rejected_obj, requester);
    }

    public fun delete_paid(noti: PaidNotification){
        let PaidNotification { 
            id, 
            amount: _, 
            paid_by: _, 
            request_code: _ 
        } = noti;
        object::delete(id);
    }

    public fun delete_reject(rej: RejectedPayment){
        let RejectedPayment { 
            id, 
            original_request_id: _, 
            rejected_by: _, 
            amount: _, 
            request_code: _ 
        } = rej;
        object::delete(id);
    }
}
