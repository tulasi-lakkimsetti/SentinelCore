package com.sentinelcore.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AssetRepository;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final AssetRepository assetRepository;

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {

        List<Asset> assets = assetRepository.findAll();

        long totalAssets = assets.size();

        long onlineAssets = assets.stream()
                .filter(asset ->
                        asset.getStatus() == Asset.AssetStatus.ONLINE)
                .count();

        long warningAssets = assets.stream()
                .filter(asset ->
                        asset.getStatus() == Asset.AssetStatus.WARNING)
                .count();

        long criticalAssets = assets.stream()
                .filter(asset ->
                        asset.getStatus() == Asset.AssetStatus.CRITICAL)
                .count();

        double avgCpuUsage = assets.stream()
                .mapToDouble(Asset::getCpuUsage)
                .average()
                .orElse(0.0);

        double avgMemoryUsage = assets.stream()
                .mapToDouble(Asset::getMemoryUsage)
                .average()
                .orElse(0.0);

        Map<String, Object> summary = new HashMap<>();

        summary.put("totalAssets", totalAssets);
        summary.put("onlineAssets", onlineAssets);
        summary.put("warningAssets", warningAssets);
        summary.put("criticalAssets", criticalAssets);
        summary.put("avgCpuUsage", avgCpuUsage);
        summary.put("avgMemoryUsage", avgMemoryUsage);
        summary.put("uptimePercentage", 99.99);

        return summary;
    }
}