package com.sentinelcore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssetDTO {

    private Long id;
    private String assetName;
    private String assetType;
    private String ipAddress;
    private String status;

    private double cpuUsage;
    private double memoryUsage;
    private double diskUsage;
    private double networkUsage;
}