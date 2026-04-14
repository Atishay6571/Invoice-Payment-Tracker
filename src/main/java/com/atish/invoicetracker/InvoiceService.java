package com.atish.invoicetracker;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoice(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + id));
    }

    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    public List<Invoice> getInvoiceByVendorId(Long id) {
        return invoiceRepository.findByVendorId(id);
    }
    public List<Invoice> getInvoiceByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }

    public Invoice updateInvoice(Long id, Invoice updatedInvoice) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException("Invoice not found with id: " + id));

        invoice.setInvoiceNumber(updatedInvoice.getInvoiceNumber());
        invoice.setStatus(updatedInvoice.getStatus());
        invoice.setAmount(updatedInvoice.getAmount());
        invoice.setDescription(updatedInvoice.getDescription());
        invoice.setVendor(updatedInvoice.getVendor());
        invoice.setDueDate(updatedInvoice.getDueDate());
        return invoiceRepository.save(invoice);
    }
    public Invoice approveInvoice(Long id) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if (invoice.isPresent()) {
            Invoice invoice1 = invoice.get();
            if (invoice1.getStatus()!=InvoiceStatus.PENDING) {
                throw new InvalidInvoiceStateException("Invoice cannot be approved. Current Status: "+invoice1.getStatus());
            } else {
                invoice1.setStatus(InvoiceStatus.APPROVED);
                return invoiceRepository.save(invoice1);
            }
        } else {
            throw new InvoiceNotFoundException("Invoice with id " + id + " not found");
        }
    }
    public Invoice rejectInvoice(Long id) {
        Optional<Invoice> invoice = invoiceRepository.findById(id);
        if (invoice.isPresent()) {
            Invoice invoice1 = invoice.get();
            if (!invoice1.getStatus().equals(InvoiceStatus.PENDING)) {
                throw new InvalidInvoiceStateException("Invoice cannot be rejected. Current Status: "+invoice1.getStatus());
            } else {
                invoice1.setStatus(InvoiceStatus.REJECTED);
                return invoiceRepository.save(invoice1);
            }
        } else {
            throw new InvoiceNotFoundException("Invoice with id " + id + " not found");
        }
    }
    public List<Invoice> filterByDate(LocalDate startDate, LocalDate endDate) {
        return invoiceRepository.findByDueDateBetween(startDate, endDate);
    }
    public List<Invoice> filterByAmount(double start, double end) {
        return invoiceRepository.findByAmountBetween(start,end);
    }
}

