package com.atish.invoicetracker;

public class PaymentNotFoundException extends RuntimeException {
    PaymentNotFoundException(String message) {
        super(message);
    }
}
