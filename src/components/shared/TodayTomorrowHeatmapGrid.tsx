import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExtendedHeatmapGridProps } from '@/utils/types/heatmapTypes';
import { isCzechHoliday } from '@/utils/date/czechHolidays';
import HolidayWarning from './HolidayWarning';

const TodayTomorrowHeatmapGrid: React.FC<ExtendedHeatmapGridProps> = ({ 
  days, 
  hours, 
  getCellData, 
  dayLabels
}) => {
  const { t } = useTranslation('common');
  
  const subtitles = [
    t('heatmaps:todayTomorrow.daySubtitle.occupancy'),
    t('heatmaps:todayTomorrow.daySubtitle.lanes'),
    t('heatmaps:todayTomorrow.daySubtitle.raw')
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Hours header row */}
        <div className="flex">
          <div className="w-24 flex-shrink-0" />
          {hours.map(hour => (
            <div key={hour} className="w-12 text-center text-xs font-medium text-gray-600">
              {hour}:00
            </div>
          ))}
          <div className="w-48 flex-shrink-0" />
        </div>

        {/* Days rows */}
        {days.map((day) => (
          <div key={day} className={`flex`}>
            <div className="w-24 py-2 flex-shrink-0 font-medium text-gray-700">
              <div>{t(`days.${day.toLowerCase()}`)}</div>
              {dayLabels && (
                <div className="flex items-center gap-1">
                  <div className="text-xs text-gray-500">{dayLabels[day]}</div>
                  <HolidayWarning 
                    isHoliday={isCzechHoliday(dayLabels[day]).isHoliday}
                    showBelow={days.indexOf(day) === 0}
                  />
                </div>
              )}
            </div>
            {hours.map(hour => {
              const { color, displayText, title, openedLanes, rawOccupancyDisplayText } = getCellData(day, hour);
              return (
                <div key={`${day}-${hour}`} className="w-12">
                  { days.indexOf(day) > 0 && 
                    (<div className="w-12 text-center text-xs font-medium text-gray-600">
                      {hour}:00
                    </div>
                  )}
                  <div
                    className={`h-12 border border-gray-200 ${color} hover:opacity-80 transition-opacity flex items-center justify-center`}
                    title={title}
                  >
                    <span className="text-xs font-medium text-gray-700">{displayText}</span>
                  </div>
                  {openedLanes && (
                    <div className="h-12 border border-gray-200 relative flex items-center justify-center">
                      <div 
                        className="absolute bottom-0 bg-blue-400"
                        style={{ 
                          height: `${openedLanes.fillRatio * 100}%`,
                          width: '100%'
                        }}
                      />
                      <span className="text-xs font-medium text-gray-700 z-10">{openedLanes.text}</span>
                    </div>
                  )}
                  {days.indexOf(day) === 0 && (
                    <div
                      className={`h-12 border border-gray-200 hover:opacity-80 transition-opacity flex items-center justify-center`}
                    >
                      <span className="text-xs font-medium text-gray-700">{rawOccupancyDisplayText}</span>
                    </div>
                  )}
                  <div className="mb-8"></div>
                </div>
              );
            })}
            <div className="w-58 flex-shrink-0 font-normal text-gray-500 pl-4 mt-2">
              <div className="h-12 flex items-center">{subtitles[0]}</div>
              <div className="h-12 flex items-center">{subtitles[1]}</div>
              {days.indexOf(day) === 0 && (
                <div className="h-12 flex items-center">{subtitles[2]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTomorrowHeatmapGrid;