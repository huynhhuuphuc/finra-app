import { theme } from 'antd';
import React from 'react';

export interface ProfileFieldProps {
  label: string;
  value: string | number | undefined;
  className?: string;
}

export interface ProfileSectionProps {
  title: string;
  fields: ProfileFieldData[];
  className?: string;
  grid?: number;
}

const GRID_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export interface ProfileFieldData {
  labelKey: string;
  value: string | number | undefined;
  formatter?: (value: string) => string;
}
const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  className,
}) => {
  const { token } = theme.useToken();
  return (
    <div className={className}>
      <div
        className="text-sm font-normal"
        style={{ color: token.colorTextTertiary }}
      >
        {label}
      </div>
      <div
        className="font-medium mt-1 min-h-[1.5rem] break-words"
        style={{ color: token.colorText }}
      >
        {value || '—'}
      </div>
    </div>
  );
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  fields,
  className,
  grid = 1,
}) => {
  const mdCols = GRID_COLS[grid] ?? 'md:grid-cols-1';
  const { token } = theme.useToken();

  return (
    <div className={className}>
      <h3
        className="font-bold text-xl mb-4"
        style={{ color: token.colorText }}
      >
        {title}
      </h3>
      <div className={`grid grid-cols-1 ${mdCols} gap-4`}>
        {fields.map((field, index) => (
          <ProfileField
            key={`${field.labelKey}-${index}`}
            label={field.labelKey}
            value={
              field.formatter
                ? field.formatter(String(field.value || ''))
                : field.value
            }
            className={
              fields.length % 2 !== 0 && index === fields.length - 1
                ? 'md:col-span-2'
                : ''
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
