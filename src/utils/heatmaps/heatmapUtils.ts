import { HourlyDataWithRatio } from '@/utils/types/poolData';
import { ProcessedHeatmapData, BaseCellData } from '@/utils/types/heatmapTypes';
import { DAYS, HOURS } from '@/constants/time';
import { isCzechHoliday } from '@/utils/date/czechHolidays';

const isClosedHour = (hour: number, day: string, date: string | undefined): boolean => {
  // Weekend hours check
  const isWeekend = day === 'Saturday' || day === 'Sunday';
  const isEarlyHour = hour <= 7;
  const isLateHour = hour >= 21;
  
  // Holiday check
  const isHoliday = date ? isCzechHoliday(date).isHoliday : false;
  
  return (isWeekend || isHoliday) && (isEarlyHour || isLateHour);
};

type TranslationFunction = (key: string, options?: { [key: string]: string | number }) => string;

export const getLegendItems = (t: TranslationFunction) => [
  { color: 'bg-gray-100 border border-gray-300', label: t('heatmaps:common.legend.labels.empty') },
  { color: 'bg-green-100', label: t('heatmaps:common.legend.labels.veryLow') },
  { color: 'bg-green-300', label: t('heatmaps:common.legend.labels.low') },
  { color: 'bg-yellow-300', label: t('heatmaps:common.legend.labels.medium') },
  { color: 'bg-orange-400', label: t('heatmaps:common.legend.labels.high') },
  { color: 'bg-red-500', label: t('heatmaps:common.legend.labels.veryHigh') }
];

export const getColorForUtilization = (rate: number): string => {
  if (rate === 0) return 'bg-gray-100';
  if (rate < 25) return 'bg-green-100';
  if (rate < 33) return 'bg-green-300';
  if (rate < 42) return 'bg-yellow-300';
  if (rate < 52) return 'bg-orange-400';
  return 'bg-red-500';
};

export const processHeatmapData = (
  data: HourlyDataWithRatio[],
  days: string[] = DAYS
): ProcessedHeatmapData => {
  const utilizationMap: Record<string, Record<number, number>> = {};
  const ratioMap: Record<string, Record<number, HourlyOccupancySummary['ratio']>> = {};
  
  // Initialize with empty data
  days.forEach(day => {
    utilizationMap[day] = {};
    ratioMap[day] = {};
    HOURS.forEach(hour => {
      utilizationMap[day][hour] = 0;
      ratioMap[day][hour] = undefined;
    });
  });
  
  // Fill in the data we have
  data.forEach(item => {
    if (utilizationMap[item.day] && HOURS.includes(item.hour)) {
      utilizationMap[item.day][item.hour] = item.utilizationRate;
      if ('ratio' in item) {
        ratioMap[item.day][item.hour] = item.ratio;
      }
    }
  });

  return { utilizationMap, ratioMap };
};

export const getCellData = (
  day: string,
  hour: number,
  utilizationMap: Record<string, Record<number, number>>,
  tooltipTranslationKey: string,
  t: TranslationFunction
): BaseCellData => {
  const utilization = utilizationMap[day][hour];
  
  return {
    color: getColorForUtilization(utilization),
    displayText: utilization > 0 ? `${utilization}%` : '',
    title: t(tooltipTranslationKey, {
      day: t(`common:days.${day.toLowerCase()}`),
      hour,
      utilization
    })
  };
};

export const getTodayTomorrowCellData = (
  day: string,
  hour: number,
  utilizationMap: Record<string, Record<number, number>>,
  ratioMap: Record<string, Record<number, HourlyDataWithRatio['ratio']>>,
  data: HourlyDataWithRatio[],
  tooltipTranslationKey: string,
  t: TranslationFunction,
  dayLabels: Record<string, string>
): ExtendedCellData => {
  const utilization = utilizationMap[day][hour];
  const date = dayLabels[day];
  const ratio = isClosedHour(hour, day, date) ? undefined : ratioMap[day][hour];
  const hourData = data.find(item => item.day === day && item.hour === hour);
  const rawOccupancyColor = getColorForUtilization(hourData?.maxOccupancy || 0);
  
  let rawOccupancyDisplayText = '';
  if (hourData) {
    if (hourData.minOccupancy === hourData.maxOccupancy) {
      rawOccupancyDisplayText = hourData.minOccupancy > 0 ? `${hourData.minOccupancy}` : '';
    } else if (hourData.minOccupancy > 0 || hourData.maxOccupancy > 0) {
      rawOccupancyDisplayText = `${hourData.minOccupancy}-${hourData.maxOccupancy}`;
    }
  }
  
  return {
    color: getColorForUtilization(utilization),
    displayText: utilization > 0 ? `${utilization}%` : '',
    rawOccupancyColor,
    rawOccupancyDisplayText,
    title: t(tooltipTranslationKey, {
      day: t(`common:days.${day.toLowerCase()}`),
      hour,
      utilization
    }),
    ...(ratio && {
      openedLanes: {
        text: `${ratio.current}/${ratio.total}`,
        fillRatio: ratio.fillRatio
      }
    })
  };
};