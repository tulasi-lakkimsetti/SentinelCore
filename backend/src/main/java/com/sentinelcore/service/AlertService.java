package com.sentinelcore.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sentinelcore.dto.AlertDTO;
import com.sentinelcore.entity.Alert;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AlertRepository;
import com.sentinelcore.repository.AssetRepository;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final AssetRepository assetRepository;

    public AlertService(
            AlertRepository alertRepository,
            AssetRepository assetRepository) {

        this.alertRepository = alertRepository;
        this.assetRepository = assetRepository;
    }

    // Create Alert
    public AlertDTO createAlert(AlertDTO dto) {

        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found with id: " + dto.getAssetId()));

        Alert alert = new Alert();

        alert.setAsset(asset);

        alert.setSeverity(
                Alert.Severity.valueOf(dto.getSeverity())
        );

        alert.setMessage(dto.getMessage());

        alert.setStatus(Alert.AlertStatus.OPEN);

        alert.setCreatedAt(LocalDateTime.now());

        return toDTO(alertRepository.save(alert));
    }

    // Get Open Alerts
    public List<AlertDTO> getOpenAlerts() {

        return alertRepository
                .findByStatus(Alert.AlertStatus.OPEN)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get Alert History
    public List<AlertDTO> getAlertHistory() {

        return alertRepository
                .findByStatusOrderByResolvedAtDesc(
                        Alert.AlertStatus.RESOLVED
                )
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Resolve Alert
    public AlertDTO resolveAlert(Long id) {

        Alert alert = alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alert not found with id: " + id));

        alert.setStatus(Alert.AlertStatus.RESOLVED);

        alert.setResolvedAt(LocalDateTime.now());

        return toDTO(alertRepository.save(alert));
    }

    // Convert Entity to DTO
    private AlertDTO toDTO(Alert alert) {

        return new AlertDTO(
                alert.getId(),
                alert.getAsset().getId(),
                alert.getSeverity().name(),
                alert.getMessage(),
                alert.getStatus().name(),
                alert.getCreatedAt() != null
                        ? alert.getCreatedAt().toString()
                        : null,
                alert.getResolvedAt() != null
                        ? alert.getResolvedAt().toString()
                        : null
        );
    }
}