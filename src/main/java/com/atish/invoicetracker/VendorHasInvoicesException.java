package com.atish.invoicetracker;

public class VendorHasInvoicesException extends RuntimeException{
    VendorHasInvoicesException(String message){
        super(message);
    }
}
