package com.atish.invoicetracker;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final InvoiceRepository invoiceRepository;

    public VendorService(VendorRepository vendorRepository, InvoiceRepository invoiceRepository) {
        this.vendorRepository = vendorRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }
    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new VendorNotFoundException("Vendor not found with id: " + id));
    }
    /*public Vendor getVendorById(Long id) {
        if(vendorRepository.findById(id)!=null) {
            return vendorRepository.findById(id);
        }
        else{
            throw new VendorNotFoundException("Vendor not found");
        }
    }*/

    public Vendor createVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }
//check implementation of delete vendor
    public void deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id).orElseThrow(()->new VendorNotFoundException("Vendor not found"));
        List<Invoice> invoices = invoiceRepository.findByVendorId(vendor.getId());
        if(!invoices.isEmpty()){
            throw new VendorHasInvoicesException("Vendor has "+invoices.size()+" pending invoices");
        }
        vendorRepository.deleteById(id);
    }
    //below code must be understood in depth
    public Vendor updateVendor(Long id, Vendor updatedVendor) {
        Optional<Vendor> existing = vendorRepository.findById(id);

        if (existing.isPresent()) {
            Vendor vendor = existing.get();
            vendor.setName(updatedVendor.getName());
            vendor.setEmail(updatedVendor.getEmail());
            vendor.setPhone(updatedVendor.getPhone());
            vendor.setAddress(updatedVendor.getAddress());
            vendor.setBankName(updatedVendor.getBankName());
            vendor.setAccountNumber(updatedVendor.getAccountNumber());
            vendor.setIfscCode(updatedVendor.getIfscCode());
            vendor.setStatus(updatedVendor.getStatus());
            return vendorRepository.save(vendor);
        }

        return null;
    }
    public List<Vendor> searchVendorByName(String name){
        return vendorRepository.findByNameContainingIgnoreCase(name);
    }
}