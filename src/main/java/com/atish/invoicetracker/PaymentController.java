package com.atish.invoicetracker;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    @GetMapping
    public List<Payment> getPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Payment payment= paymentService.findById(id);
        return ResponseEntity.ok(payment);
    }

    @PostMapping
    public Payment createPayment(@Valid @RequestBody Payment payment) {
        return paymentService.create(payment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @Valid @RequestBody Payment payment) {
        Payment p1= paymentService.updatePayement(id,payment);
        if (p1 != null) {
            return ResponseEntity.ok(p1);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.delete(id);
        return ResponseEntity.noContent().build();

    }

    @GetMapping("/invoice/{id}")
    public List<Payment> getPaymentsByInvoiceId(@PathVariable Long id) {
        return paymentService.findByInvoiceId(id);
    }

}
