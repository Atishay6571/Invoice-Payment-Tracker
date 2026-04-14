package com.atish.invoicetracker;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByVendorId(Long vendorId);
    List<Invoice> findByStatus(InvoiceStatus status);
    List<Invoice> findByDueDateBetween(LocalDate fromDate, LocalDate toDate);
    List<Invoice> findByAmountBetween(double start,double end);
}