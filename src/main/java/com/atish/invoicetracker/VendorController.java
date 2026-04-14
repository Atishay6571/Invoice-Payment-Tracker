package com.atish.invoicetracker;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@Valid
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public List<Vendor> getAllVendors() {
        return vendorService.getAllVendors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        Vendor vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(vendor);
    }

    @PostMapping
    public Vendor createVendor(@Valid @RequestBody Vendor vendor) {
        return vendorService.createVendor(vendor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @Valid @RequestBody Vendor vendor) {
            Vendor v1= vendorService.updateVendor(id,vendor);
            if (v1==null){
                return ResponseEntity.notFound().build();
            }
            else{
                return ResponseEntity.ok(v1);
            }
        }

    @GetMapping("/search")
    public ResponseEntity<List<Vendor>> searchVendorsByName(@RequestParam String name){
        return ResponseEntity.ok(vendorService.searchVendorByName(name));

    }
}