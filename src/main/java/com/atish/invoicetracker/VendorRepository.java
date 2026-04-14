package com.atish.invoicetracker;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    public List<Vendor> findByNameContainingIgnoreCase(String query);
}