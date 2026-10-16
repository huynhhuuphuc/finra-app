import React from 'react';
import { useIntl } from 'umi';

export interface MetricItemData {
  labelKey: string;
  value: string | number | undefined;
  className?: string;
  formatter?: (value: string | number) => string;
}

export interface MetricCardProps {
  title: string;
  metrics: MetricItemData[];
  className?: string;
}

const MetricItem: React.FC<MetricItemData> = ({
  labelKey,
  value,
  className,
  formatter,
}) => {
  const intl = useIntl();

  const displayValue =
    value !== undefined && value !== null
      ? formatter
        ? formatter(value)
        : value
      : '—';

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-sm text-gray-500">
        {intl.formatMessage({ id: labelKey })}
      </div>
      <div className={`font-bold ${className || ''}`}>{displayValue}</div>
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metrics,
  className = '',
}) => {
  const intl = useIntl();

  return (
    <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
      <div className="text-lg font-semibold mb-2">
        {intl.formatMessage({ id: title })}
      </div>
      <div className="space-y-0">
        {metrics.map((metric, index) => (
          <MetricItem key={`${metric.labelKey}-${index}`} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default MetricCard;
