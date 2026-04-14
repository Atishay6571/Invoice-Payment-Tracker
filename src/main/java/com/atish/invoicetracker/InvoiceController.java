package com.atish.invoicetracker;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService service;
    public InvoiceController(InvoiceService service) {
        this.service = service;
    }
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return service.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        Invoice invoice = service.getInvoice(id);
        return ResponseEntity.ok(invoice);
    }
    @GetMapping("/vendor/{vendorId}")
    public List<Invoice> getInvoiceByVendorId(@PathVariable Long vendorId) {
        return service.getInvoiceByVendorId(vendorId);
    }
    @GetMapping("/status/{status}")
    public List<Invoice> getInvoiceByStatus(@PathVariable InvoiceStatus status) {
        return service.getInvoiceByStatus(status);
    }

    @PostMapping
    public Invoice createInvoice(@Valid @RequestBody Invoice invoice) {
        return service.createInvoice(invoice);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id,@Valid @RequestBody Invoice invoice) {
        Invoice i1=service.updateInvoice(id, invoice);
        return ResponseEntity.ok(i1);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        service.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Invoice> approveInvoice(@PathVariable Long id) {
        Invoice invoice = service.approveInvoice(id);
        return ResponseEntity.ok(invoice);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Invoice> rejectInvoice(@PathVariable Long id) {
        Invoice invoice = service.rejectInvoice(id);
        return ResponseEntity.ok(invoice);
        }

    @GetMapping("/filter/date")
    public ResponseEntity<List<Invoice>> filterByDate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Invoice> invoices = service.filterByDate(startDate, endDate);
        return ResponseEntity.ok(invoices);
    }
    @GetMapping("/filter/amount")
    public ResponseEntity<List<Invoice>> filterByAmount(@RequestParam double start,@RequestParam double end) {
        List<Invoice> invoices = service.filterByAmount(start,end);
        return ResponseEntity.ok(invoices);
    }
}
