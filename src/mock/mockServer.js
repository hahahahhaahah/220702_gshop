/* 
使用mockjs提供mock数据接口
*/

import Mock from 'mockjs'
import data from './data.json'

// 一共提供三个接口
// 1.返回goods的接口   => 指定一个路径，返回的数据直接是data中的goods，不是随机的。       
// 为了使返回的数据与ajax请求的一致，将数据设置为一个队形，里面包含code和data数据                 
Mock.mock('/goods', { code: 0, data: data.goods });
// 2.返回ratings的接口
Mock.mock('/ratings', { code: 0, data: data.ratings });
// 3.返回信息的接口
Mock.mock('/info', { code: 0, data: data.info });

// 不需要暴露任何内容，只需要保证能执行即可
// 如何保证执行：在webpak打包的时候，根据入口文件加载所有的文件。通过main的入口文件，加载该文件即可执行