package com.atish.invoicetracker;

public class VendorNotFoundException extends RuntimeException {
    VendorNotFoundException(String message) {
        super(message);
    }
}
