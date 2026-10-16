import { Select } from 'antd';
import React from 'react';

const PageSizeSelect = React.forwardRef<
  any,
  React.ComponentProps<typeof Select>
>((props, ref) => <Select {...props} ref={ref} showSearch={false} />);

PageSizeSelect.displayName = 'PageSizeSelect';

export default PageSizeSelect;
