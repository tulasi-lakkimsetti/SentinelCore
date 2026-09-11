package com.sentinelcore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.service.AssetService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/assets")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService assetService;

    @GetMapping
    public List<AssetDTO> getAsset() {
        return assetService.getAllAssets();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public AssetDTO createAsset(@RequestBody AssetDTO dto) {
        return assetService.createAsset(dto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Asset>> searchAssets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {

        List<Asset> assets =
                assetService.searchAndFilter(
                        search,
                        status
                );

        return ResponseEntity.ok(assets);
    }
}