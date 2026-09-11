package com.sentinelcore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.sentinelcore.entity.Asset;

public interface AssetRepository
        extends JpaRepository<Asset, Long>,
                JpaSpecificationExecutor<Asset> {

    List<Asset> findByStatus(String status);

    List<Asset> findByAssetType(String assetType);
}