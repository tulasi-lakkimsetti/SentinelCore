package com.sentinelcore.repository;

import org.springframework.data.jpa.domain.Specification;

import com.sentinelcore.entity.Asset;

public class AssetSpecification {

    public static Specification<Asset> searchAssets(
            String search,
            String status) {

        return (root, query, criteriaBuilder) -> {

            Specification<Asset> specification = null;

            // Search by asset name
            if (search != null && !search.isBlank()) {

                specification = Specification.where(
                        (root1, query1, cb) ->
                                cb.like(
                                        cb.lower(root1.get("assetName")),
                                        "%" + search.toLowerCase() + "%"
                                )
                );
            }

            // Filter by status
            if (status != null && !status.isBlank()) {

                Specification<Asset> statusSpec =
                        (root1, query1, cb) ->
                                cb.equal(
                                        root1.get("status"),
                                        Asset.AssetStatus.valueOf(
                                                status.toUpperCase()
                                        )
                                );

                specification = specification == null
                        ? statusSpec
                        : specification.and(statusSpec);
            }

            return specification == null
                    ? criteriaBuilder.conjunction()
                    : specification.toPredicate(
                            root,
                            query,
                            criteriaBuilder
                    );
        };
    }
}