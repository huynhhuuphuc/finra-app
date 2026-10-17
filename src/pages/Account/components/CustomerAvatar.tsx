import { getCustomerAvatar, type CustomerProfile } from '@/api/core/customer';
import { Avatar } from 'antd';

export default function CustomerAvatar({
  profile,
  size,
  shape,
}: {
  profile?: CustomerProfile;
  size: number;
  shape?: 'circle' | 'square';
}) {
  const initial =
    profile?.CUSTOMER_NAME?.trim().split(/\s+/).pop()?.charAt(0) || '?';
  return (
    <Avatar
      size={size}
      shape={shape}
      src={getCustomerAvatar(profile?.AVATAR_IMG)}
      style={{
        backgroundColor: '#b65ffc',
        fontSize: size / 2,
        fontWeight: 600,
      }}
    >
      {initial}
    </Avatar>
  );
}
