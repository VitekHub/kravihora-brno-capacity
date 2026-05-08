/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PoolType, POOL_TYPES } from '@/utils/types/poolTypes';
import { PoolConfig } from '@/utils/types/poolConfig';
import { usePrefetchPoolsData } from '@/utils/hooks/usePrefetchPoolsData';
import { DEFAULT_HEATMAP_HIGH_THRESHOLD } from '@/constants/pool';
import poolOccupancyConfig from '../../pool_occupancy_config.json';

interface PoolSelectorContextType {
  selectedPoolType: PoolType;
  setSelectedPoolType: (pool: PoolType) => void;
  selectedPool: PoolConfig;
  setSelectedPool: (pool: PoolConfig) => void;
  poolConfig: PoolConfig[];
  heatmapHighThreshold: number;
  setHeatmapHighThreshold: (threshold: number) => void;
  uniformHeatmapBarHeight: boolean;
  setUniformHeatmapBarHeight: (value: boolean) => void;
}

const PoolSelectorContext = createContext<PoolSelectorContextType | null>(null);

export const usePoolSelector = () => {
  const context = useContext(PoolSelectorContext);
  if (!context) {
    throw new Error('usePoolSelector must be used within a PoolSelectorProvider');
  }
  return context;
};

export const PoolSelectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPoolType, setSelectedPoolType] = useState<PoolType>(POOL_TYPES.INSIDE);
  const [selectedPool, setSelectedPool] = useState<PoolConfig>({} as PoolConfig);
  const [heatmapHighThreshold, setHeatmapHighThreshold] = useState<number>(DEFAULT_HEATMAP_HIGH_THRESHOLD);
  const [uniformHeatmapBarHeight, setUniformHeatmapBarHeight] = useState<boolean>(false);

  const poolConfig = poolOccupancyConfig as PoolConfig[];
  usePrefetchPoolsData(poolConfig);

  useEffect(() => {
    if (poolConfig && poolConfig.length > 0) {
      setSelectedPool(poolConfig[0]);
      setSelectedPoolType(poolConfig[0].insidePool?.viewStats ? POOL_TYPES.INSIDE : POOL_TYPES.OUTSIDE);
    }
  }, []);

  return (
      <PoolSelectorContext.Provider value={{ 
        selectedPoolType, 
        setSelectedPoolType,
        selectedPool,
        setSelectedPool,
        poolConfig,
        heatmapHighThreshold,
        setHeatmapHighThreshold,
        uniformHeatmapBarHeight,
        setUniformHeatmapBarHeight
      }}>
        {children}
      </PoolSelectorContext.Provider>
  );
};