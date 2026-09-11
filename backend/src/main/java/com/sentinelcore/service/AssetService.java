package com.sentinelcore.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AssetRepository;
import com.sentinelcore.repository.AssetSpecification;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<AssetDTO> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AssetDTO getById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found with id: " + id));

        return toDTO(asset);
    }

    public AssetDTO createAsset(AssetDTO dto) {

        Asset asset = Asset.builder()
                .assetName(dto.getAssetName())
                .assetType(dto.getAssetType())
                .ipAddress(dto.getIpAddress())
                .cpuUsage(dto.getCpuUsage())
                .memoryUsage(dto.getMemoryUsage())
                .diskUsage(dto.getDiskUsage())
                .networkUsage(dto.getNetworkUsage())
                .status(Asset.AssetStatus.valueOf(dto.getStatus()))
                .build();

        return toDTO(assetRepository.save(asset));
    }

    public List<Asset> searchAndFilter(
            String search,
            String status) {

        Specification<Asset> specification =
                AssetSpecification.searchAssets(
                        search,
                        status
                );

        return assetRepository.findAll(specification);
    }

    private AssetDTO toDTO(Asset asset) {

        return new AssetDTO(
                asset.getId(),
                asset.getAssetName(),
                asset.getAssetType(),
                asset.getIpAddress(),
                asset.getStatus().name(),
                asset.getCpuUsage(),
                asset.getMemoryUsage(),
                asset.getDiskUsage(),
                asset.getNetworkUsage()
        );
    }
}