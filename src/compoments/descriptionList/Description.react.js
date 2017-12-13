/**
 * author       : liuliyuan
 * createTime   : 2017/12/12 12:06
 * description  :
 */
import React from 'react';
import classNames from 'classnames';
import { Col } from 'antd';
import styles from './index.less';
import responsive from './responsive.react';

const Description = ({ term, column, className, children, ...restProps }) => {
    const clsString = classNames(styles.description, className);
    return (
        <Col className={clsString} {...responsive[column]} {...restProps}>
            {term && <div className={styles.term}>{term}</div>}
            {children && <div className={styles.detail}>{children}</div>}
        </Col>
    );
};

export default Description;