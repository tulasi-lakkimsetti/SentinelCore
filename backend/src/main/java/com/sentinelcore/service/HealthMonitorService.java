package com.sentinelcore.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.sentinelcore.dto.AlertDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AssetRepository;

@Service
public class HealthMonitorService {

    private final AssetRepository assetRepository;
    private final AlertService alertService;

    public HealthMonitorService(AssetRepository assetRepository,
                                 AlertService alertService) {
        this.assetRepository = assetRepository;
        this.alertService = alertService;
    }

    @Scheduled(fixedRate = 60000)
    public void checkAssetsHealth() {

        List<Asset> assets = assetRepository.findAll();

        for (Asset asset : assets) {

            if (asset.getCpuUsage() >= 90) {

                createAlert(asset, "CRITICAL",
                        "CPU usage is above 90%");

            } else if (asset.getMemoryUsage() >= 80) {

                createAlert(asset, "HIGH",
                        "Memory usage is above 80%");
            }
        }
    }

    private void createAlert(Asset asset,
                             String severity,
                             String message) {

        AlertDTO dto = new AlertDTO();

        dto.setAssetId(asset.getId());
        dto.setSeverity(severity);
        dto.setMessage(message);

        alertService.createAlert(dto);
    }
}