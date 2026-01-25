module smart_contracts::transfer {
    use sui::coin::Coin;
    use sui::tx_context::TxContext;

    // Send coin — just return it to caller; actual transfer handled by frontend
    public fun send_coin<T: copy + drop + store>(
        coin: Coin<T>,
        _ctx: &mut TxContext
    ): Coin<T> {
        coin
    }

    // Request coin — returns coin to caller
    public fun request_coin<T: copy + drop + store>(
        coin: Coin<T>,
        _ctx: &mut TxContext
    ): Coin<T> {
        coin
    }
}
