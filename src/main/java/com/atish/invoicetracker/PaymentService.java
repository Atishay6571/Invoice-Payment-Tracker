package com.atish.invoicetracker;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    public PaymentService(PaymentRepository paymentRepository, InvoiceRepository invoiceRepository) {
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public List<Payment> getAllPayments(){
        return  paymentRepository.findAll();
    }
    public Payment findById(Long id) {
        return paymentRepository.findById(id).orElseThrow(()->new PaymentNotFoundException("Payment not found with id: " + id));
    }
    public List<Payment> findByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }
    public Payment create(Payment payment) {
        Optional<Invoice> invoiceOpt =  invoiceRepository.findById(payment.getInvoice().getId());
        if(invoiceOpt.isPresent()){
            Invoice invoice = invoiceOpt.get();
            if (invoice.getStatus() == InvoiceStatus.APPROVED || invoice.getStatus() == InvoiceStatus.PARTIALLY_PAID) {
                List<Payment> payments = paymentRepository.findByInvoiceId(payment.getInvoice().getId());
                double sum=0;
                for( Payment payment1 : payments){
                    sum+=payment1.getPaymentAmount();
                }
                if (sum+payment.getPaymentAmount()>=invoice.getAmount()){
                    invoice.setStatus(InvoiceStatus.PAID);
                }
                else {
                    invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);

                }
                invoiceRepository.save(invoice);
                return paymentRepository.save(payment);
            }
            else{
                throw new InvalidInvoiceStateException("Invoice cannot be PAID. Current Status: "+invoice.getStatus());
            }
        }
        throw new InvoiceNotFoundException("Invoice not found");
    }
    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }
    public Payment updatePayement(Long id, Payment updatedPayment) {
        Optional<Payment> existing = paymentRepository.findById(id);

        if (existing.isPresent()) {


            Payment payment = existing.get();
            payment.setInvoice(updatedPayment.getInvoice());
            payment.setPaymentAmount(updatedPayment.getPaymentAmount());
            payment.setPaymentDate(updatedPayment.getPaymentDate());
            payment.setPaymentType(updatedPayment.getPaymentType());
            payment.setTransactionId(updatedPayment.getTransactionId());

            return paymentRepository.save(payment);
        }
        throw  new PaymentNotFoundException("Payment not found with id: " + id);
    }
}
