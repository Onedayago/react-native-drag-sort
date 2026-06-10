/**
 * @file DragListView.js
 * @description 可拖拽排序的列表视图组件
 * @author liushun
 * @created 2026/6/10 15:42
 * @lastModified 2026/6/10 15:42
 */

import {ScrollView, View} from "react-native";
import {useRef} from "react";
import DragSortView from "./DragSortView";

/**
 * 可拖拽排序的列表视图组件
 * 这是一个包装组件，提供了垂直滚动功能，内部使用 DragSortableView 实现拖拽排序
 * 
 * @param {Object} props - 组件属性
 * @param {Function} props.renderItem - 渲染列表项的函数，接收 (item, index) 参数
 * @param {Array} props.dataSource - 数据源数组
 * @param {number} props.rowSpace - 行间距，默认为 0
 * @param {number} props.childrenWidth - 子项宽度，默认为 50
 * @param {number} props.childrenHeight - 子项高度，默认为 50
 * @param {Function} props.onDragEnd - 拖拽结束回调函数，接收 (fromIndex, toIndex) 参数
 * @returns {JSX.Element} 拖拽排序列表组件
 */
const DragListView = (props) => {
	
	const {renderItem, dataSource = [], rowSpace = 0, childrenWidth = 50, childrenHeight = 50, onDragEnd } = props
	
	const scrollViewRef = useRef(null); // 最外层 ScrollView 引用，用于控制滚动
	
	const scrollYRef = useRef(0); // 已经滚动的距离，用于计算拖拽位置
	
	const pageViewHeightRef = useRef(0); // 页面展示视图大小，用于计算可见区域
	
	
	return(
		<View onLayout={(e)=>{
			// 获取容器视图的高度，用于计算可见区域
			pageViewHeightRef.current = Math.floor(e.nativeEvent.layout.height);
		}}>
			<ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				ref={scrollViewRef}
				scrollEventThrottle={16}
				onScroll={(e)=>{
					// 监听滚动事件，更新当前滚动位置
					scrollYRef.current = Math.ceil(e.nativeEvent.contentOffset.y);
				}}
			>
				{/* 使用 DragSortView 实现拖拽排序功能 */}
				<DragSortView
					scrollViewHeightRef={pageViewHeightRef}
					scrollYRef={scrollYRef}
					scrollViewRef={scrollViewRef}
					renderItem={renderItem}
					dataSource={dataSource}
					column={1} // 列表视图固定为单列
					rowSpace={rowSpace}
					childrenWidth={childrenWidth}
					childrenHeight={childrenHeight}
					onDragEnd={onDragEnd}
				/>
			</ScrollView>
		</View>
	)
	
}


export default DragListView;