interface PoolTypeConfig {
  customName?: string;
  url: string;
  pattern: string;
  maximumCapacity: number;
  totalLanes?: number;
  weekdaysOpeningHours: string;
  weekendOpeningHours: string;
  collectStats: boolean;
  viewStats: boolean;
  temporarilyClosed?: string;
  data: {
    occupancy: {
      raw: string;
      overall: string;
      weekly: string;
    };
    capacity?: {
      raw: string;
      forecast?: string;
    };
  };
}

export interface PoolConfig {
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  insidePool?: PoolTypeConfig;
  outsidePool?: Omit<PoolTypeConfig, 'totalLanes'>;
}
