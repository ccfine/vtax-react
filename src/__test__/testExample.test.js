/**
 * Created by liuliyuan on 2018/4/24.
 * 测试示例
 */
import React from 'react'
import {findDOMNode} from 'react-dom';
import {withRouter} from 'react-router-dom';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { accDiv } from 'utils'
import Message from 'modules/header/Message.react'

Enzyme.configure({ adapter: new Adapter() });

describe('测试', function () {
    it('测试除法函数', function () {
        expect(accDiv(100,100)).toEqual(1)
    });

    it('测试组件加载', function () {
        expect(shallow(<Message />)).toMatchSnapshot();
    });

});

describe('测试2', function () {

    let Messages = withRouter(Message);

    /*
     * 之后，我们可以:
     * 通过wrapper.state()拿到组件的state
     * 通过wrapper.instance()拿到组件实例，以此调用组件内的方法
     * 通过wrapper.find()找到组件内的子组件
     * 但是，无法通过wrapper.props()拿到组件的props
     */

    it("测试组件加载-1", function() {
        expect(shallow(<Messages />).contains(<div className="action" />)).toBe(true);
    });

    //测试该组件组外层的class
    it("测试组件加载-2", function() {
        //expect(shallow(<Messages />).is('.action')).toEqual(true);
        expect(shallow(<Messages />).is('.action')).toBe(true);
    });

    it("测试组件加载-3", function() {
        expect(shallow(<Messages />).find('.action').length).toBe(1);
    });

});



describe("测试2", function() {

    const Foo = () =><div className="foo" />;

    it("测试组件加载2-1", function() {
        expect(shallow(<Foo />).contains(<div className="foo" />)).toBe(true);
    });

    it("测试组件加载2-2", function() {
        expect(shallow(<Foo />).is('.foo')).toBe(true);
    });

    it("测试组件加载2-3", function() {
        expect(mount(<Foo />).find('.foo').length).toBe(1);
    });
});
