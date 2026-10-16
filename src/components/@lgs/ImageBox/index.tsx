import { Image } from 'antd';
import { memo } from 'react';
import './index.less';
export default memo(function ImageBox({
  width = 100,
  height = 100,
  src,
  spacing = 4,
  caption = '',
  desc = '',
  preview = true,
}: {
  width?: string | number;
  height?: string | number;
  spacing?: number;
  src: string;
  caption?: string;
  desc?: string;
  preview?: boolean;
  name?: string;
}) {
  return (
    <div className="lg-image-box" style={{ width }}>
      <div className="content" style={{ width, height, padding: spacing }}>
        <Image
          width={'100%'}
          height={'100%'}
          src={src}
          preview={preview}
          style={{ objectFit: 'cover' }}
        />
      </div>
      {caption ? <div className="caption">{caption}</div> : null}
      {desc ? <div className="desc">{desc}</div> : null}
    </div>
  );
});
