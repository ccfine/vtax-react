import React, { createElement } from 'react';
import { Button } from 'antd';
import config from './typeConfig';
import './index.less';

export default ({ className='exception', linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404';
  return (
    <div className={className} {...rest}>
      <div className='imgBlock'>
        <div
          className='imgEle'
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className='content'>
        <h1>{title || config[pageType].title}</h1>
        <div className='desc'>{desc || config[pageType].desc}</div>
        <div className='actions'>
          {actions ||
            createElement(
              linkElement,
              {
                to: '/web',
                href: '/web',
              },
              <Button type="primary">返回首页</Button>
            )}
        </div>
      </div>
    </div>
  );
};
