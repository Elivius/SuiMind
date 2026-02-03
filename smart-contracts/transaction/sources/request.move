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

    public entry fun settle_payment_request(
        request: PaymentRequest, // Taking by value "consumes" the object
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == request.recipient, 0);

        let PaymentRequest {
            id,
            requester: _,
            recipient: _,
            amount: _,
            request_code: _,
            expiration: _,
        } = request;

        object::delete(id);
    }

    public entry fun reject_request(request: PaymentRequest) {
        let PaymentRequest { 
            id, 
            requester: _, 
            recipient: _, 
            amount: _, 
            request_code: _, 
            expiration: _ 
        } = request;

        object::delete(id);
    }
}