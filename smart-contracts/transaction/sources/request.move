module transaction::request {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::String;


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

    public entry fun create_payment_request(
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
        
        // Emit event for the indexer/dashboard to find
        event::emit(PaymentRequestCreated {
            request_id: inner_id,
            requester: sender,
            recipient,
            amount,
            request_code,
            expiration,
        });

        // This is the "Send" part: delivers the object to the recipient
        transfer::public_transfer(request, recipient);
    }

    public entry fun settle_payment_request(
        request: PaymentRequest, // Taking by value "consumes" the object
        ctx: &mut TxContext
    ) {
        // 1. Basic security: Ensure the person paying is the intended recipient
        // (Optional, but recommended)
        assert!(tx_context::sender(ctx) == request.recipient, 0);

        // 2. Unpack the object to get the UID
        let PaymentRequest {
            id,
            requester: _,
            recipient: _,
            amount: _,
            request_code: _,
            expiration: _,
        } = request;

        // 3. Delete the UID (this removes it from the blockchain)
        object::delete(id);
    }
}