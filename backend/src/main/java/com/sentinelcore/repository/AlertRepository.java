package com.sentinelcore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.entity.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByStatus(Alert.AlertStatus status);

    List<Alert> findByAssetId(Long assetId);

    boolean existsByAssetIdAndStatus(
            Long assetId,
            Alert.AlertStatus status
    );
}