/**
 * @file DragSortView.js
 * @description
 * @author liushun
 * @created 2025/12/24 14:29
 * @lastModified 2025/12/24 14:29
 */


import React, {useState, useEffect, useRef, useMemo, useCallback, forwardRef, useImperativeHandle, memo} from 'react'
import { Animated, Dimensions, Easing, StyleSheet, View, Platform } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import DragItemContainer from "./DragItemContainer";
import _ from "lodash";

const TOP = 200; //上边距
const BOTTOM = Dimensions.get('screen').height - 200; //下边距

const TIME = Platform.OS === 'ios'?10:25; //每次滚动的时间间隔
const DISTANCE = Platform.OS === 'ios'?2:4; //每次滚动的距离

const MemoDragSortableView = (props, ref) => {
	
	const {
		keyStr, //作为列表key 的关键字
		dataSource, //数组数据
		childrenWidth, //子元素宽度
		childrenHeight, //子元素高度
		rowSpace = 0, //行间距
		columnSpace = 0, //列间距
		column = 1, //有几列
		onDragEnd, //拖拽结束
		onDragStart, //拖拽开始
		parentYRef, //如果当前拖拽视图在一个容器中，则需要这个容器在 scrollView 的 y 位置
		scrollYRef, //外层 scrollView 滚动的距离
		scrollViewRef, //外层 scrollView 的索引
		scrollViewHeightRef, //外层 scrollView 视图高度
		triggerTop = TOP, // 距离页面顶部小于多少距离触发外层滚动
		triggerBottom = BOTTOM, //距离页面顶部大于多少距离触发外层滚动
	} = props;
	
	const [dragSourceData, setDragSourceData] = React.useState([]);
	const [totalHeight, setTotalHeight] = React.useState(0);
	
	const scrollTimeRef = useRef(null); //外层 scrollView 自动滚动定时
	const yRef = useRef(null);
	const heightRef = useRef(null);
	
	//表示当前在拖拽的元素在原始数据的索引位置,特别注释元素在原始数据的索引是不变的，变的是元素对象中的索引值
	const dragCurrentRef = useRef(null);
	
	//拖拽元素上次拖拽的位置
	const lastDragY = useRef(0);
	
	const lastScrollYRef = useRef(0);
	
	//先构造拖拽所需数据, 由于改变位置是动画，所以不 setState 就可以改变位置
	useEffect(()=>{
		
		let arr = [];
		dataSource?.forEach((item, index)=>{
			const top = getTopByIndex(index);
			const left = getLeftByIndex(index);
			let obj = {
				x: new Animated.Value(left), //拖拽中的坐标
				y: new Animated.Value(top),
				changeIndex: index, //拖拽变化后的位置索引
				originIndex: index, //拖拽前的位置索引
				yValue: top, //这个值用来外部改变拖拽元素的位置
				value: item,
			}
			arr.push(obj);
		})
		setTotalHeight(getChildRealHeight()*Math.ceil(dataSource?.length/column));
		setDragSourceData(arr);
	},[dataSource, column])
	
	const getChildRealHeight = () => {
		return (rowSpace + childrenHeight)
	}
	
	//根据索引获取顶部距离
	const getTopByIndex = (index) => {
		return Math.floor(index / column) * getChildRealHeight();
	}
	
	const getChildRealWidth = () => {
		return (columnSpace + childrenWidth)
	}
	
	//根据索引获取左边距离
	const getLeftByIndex = (index) => {
		return index%column * getChildRealWidth();
	}
	
	const clearScrollInterval = () => {
		scrollTimeRef.current&&clearInterval(scrollTimeRef.current);
		scrollTimeRef.current = null;
	}
	
	const startScroll = (distance) => {
		if(!scrollTimeRef.current){
			clearScrollInterval();
			scrollTimeRef.current = setInterval(() => {
				//判断是否应该滚动，还是停止滚动
				if(Math.floor(scrollYRef?.current) <= Math.ceil(yRef.current + (parentYRef?parentYRef?.current:0)) && distance < 0){
					stopScroll();
					return;
				}
				
				if(Math.ceil(scrollYRef?.current) >= Math.floor((yRef.current +  (parentYRef?parentYRef?.current:0) + heightRef.current) - scrollViewHeightRef?.current) && distance > 0){
					stopScroll();
					return;
				}
				
				scrollViewRef?.current.scrollTo({
					y: scrollYRef?.current + distance,
					animated: false,
				})
				setDragOffSet(scrollYRef?.current - lastScrollYRef.current);
				lastScrollYRef.current = scrollYRef?.current;
			},TIME)
		}
	}
	
	const setDragOffSet = (distance) => {
		const dragItem = dragSourceData[dragCurrentRef.current];
		dragItem.yValue+=distance;
		dragItem.y.setValue(dragItem.yValue)
	}
	
	const stopScroll = () => {
		clearScrollInterval();
	}
	
	const isOutScrollView = () => {
		return scrollViewRef?.current && scrollViewHeightRef?.current && scrollYRef?.current >= 0;
	}
	
	const onTopReached = () => {
		//判断外层是否是滚动视图
		if(isOutScrollView()){
			startScroll(-DISTANCE)
		}
	}
	
	const onBottomReached = () => {
		if(isOutScrollView()){
			startScroll(DISTANCE)
		}
	}
	
	const onCentered = () => {
		if(isOutScrollView()){
			stopScroll();
		}
	}
	
	const dragStart = (index, e) => {
		lastScrollYRef.current = scrollYRef?.current; //这里先赋值下
		dragCurrentRef.current = index;
		lastDragY.current = e.absoluteY;
		onDragStart?.();
	}
	
	
	//改变策略，通过两次 absoluteY 的值来获取每次移动距离
	const dragMove = (index, e) => {
		
		if(e.absoluteY < triggerTop){
			onTopReached?.();
		}else if(e.absoluteY > triggerBottom){
			onBottomReached?.();
		}else {
			onCentered?.();
		}
		
		let dragData = dragSourceData[index];
		let moveY = (e.absoluteY - lastDragY.current)+dragData.yValue;
		let moveX = getLeftByIndex(dragData.originIndex);
		lastDragY.current = e.absoluteY;
		if(column > 1){
			moveX = e.translationX+getLeftByIndex(dragData.originIndex);
		}
		
		dragData.y.setValue(moveY);
		dragData.x.setValue(moveX);
		dragData.yValue = moveY;
		let dragIndex = dragData.changeIndex;
		
		//注意 targetIndex 不是拖拽索引，是在总数据的索引
		const targetIndex = dragSourceData.findIndex((item, i) => {
			if(i === index){
				return false;
			}
			const itemIndex = item.originIndex;
			const minY = getTopByIndex(itemIndex) ;
			const maxY = getTopByIndex(itemIndex) + getChildRealHeight();
			const minX = getLeftByIndex(itemIndex) ;
			const maxX = getLeftByIndex(itemIndex) + getChildRealWidth();
			
			const x = moveX + childrenWidth/2;
			const y = moveY + childrenHeight/2;
			if( x >= minX && x <= maxX && y >= minY && y <= maxY ){
				return true;
			}
		});
		
		const targetItem = dragSourceData[targetIndex];
		
		if(targetItem){  //多行拖拽交换要特殊处理下
			
			//这里不能直接改当前拖拽的元素到被拖拽索引
			const targetOriginIndex = targetItem.originIndex;
			//判断是后移动还是前移动
			if(dragIndex < targetItem.originIndex){  //往后移动
				for(let i = dragIndex+1; i <= targetItem.originIndex; i++){
					const item = dragSourceData.find(item => item.originIndex === i && item.changeIndex === i);
					if(item){
						item.changeIndex -=  1 ;
						item.originIndex -= 1;
						// item.y.setValue(getTopByIndex(item.changeIndex));
						// item.x.setValue(getLeftByIndex(item.changeIndex));
						item.yValue = getTopByIndex(item.changeIndex);
						Animated.parallel([
							Animated.timing(item.x, {
								toValue: getLeftByIndex(item.changeIndex),
								duration: 300,
								easing: Easing.ease,
								useNativeDriver: false,
							}),
							Animated.timing(item.y, {
								toValue: getTopByIndex(item.changeIndex),
								duration: 300,
								easing: Easing.ease,
								useNativeDriver: false,
							}),
						]).start();
					}
				}
			}else{
				for(let i = dragIndex -1; i >= targetItem.originIndex; i--){
					const item = dragSourceData.find(item => item.originIndex === i && item.changeIndex === i);
					
					if(item){
						
						item.changeIndex += 1 ;
						item.originIndex += 1;
						// item.y.setValue(getTopByIndex(item.changeIndex));
						// item.x.setValue(getLeftByIndex(item.changeIndex));
						item.yValue = getTopByIndex(item.changeIndex);
						Animated.parallel([
							Animated.timing(item.x, {
								toValue: getLeftByIndex(item.changeIndex),
								duration: 300,
								easing: Easing.ease,
								useNativeDriver: false,
							}),
							Animated.timing(item.y, {
								toValue: getTopByIndex(item.changeIndex),
								duration: 300,
								easing: Easing.ease,
								useNativeDriver: false,
							}),
						]).start();
					}
				}
			}
			dragData.changeIndex = targetOriginIndex;
		}
		
		
	}
	
	const dragEnd = (index, e) => {
		
		stopScroll();
		let dragData = dragSourceData[index];
		//计算索引变化，将变化后数据吐出去
		let arr = [];
		dragSourceData?.forEach((item) => {
			arr[item.changeIndex] = item.value;
		})
		onDragEnd?.(dragData.originIndex, dragData.changeIndex, arr);
		
		dragData.originIndex = dragData.changeIndex;
		dragData.x.setValue(getLeftByIndex(dragData.originIndex));
		dragData.y.setValue(getTopByIndex(dragData.originIndex));
		dragData.yValue = getTopByIndex(dragData.originIndex);
		
	}
	
	const renderItem = (item, index) => {
		return (
			<DragItemContainer
				key={keyStr?item?.value?.[keyStr]:index}
				x={item?.x}
				y={item?.y}
				childrenWidth={childrenWidth}
				childrenHeight={childrenHeight}
				onDragStart={(e)=>{
					dragStart(index, e);
				}}
				onDragMove={(e)=>{
					dragMove(index, e);
				}}
				onDragEnd={(e)=>{
					dragEnd(index, e);
				}}
			>
				{props?.renderItem?.(item.value, index)}
			</DragItemContainer>
		)
	}
	
	const renderList = () => {
		return(
			<View style={{height: totalHeight}}>
				{
					dragSourceData?.map((item, index) => {
						return  renderItem(item, index);
					})
				}
			</View>
		)
	}
	
	return(
		<View onLayout={(e)=>{
			yRef.current = e.nativeEvent.layout.y;
			heightRef.current = e.nativeEvent.layout.height;
		}}>
			<GestureHandlerRootView>
				{renderList()}
			</GestureHandlerRootView>
		</View>
	
	)
}

const DragSortableView = memo(MemoDragSortableView, (prevProps, nextProps)=>{
	prevProps = _.omitBy(prevProps, _.isFunction);
	nextProps = _.omitBy(nextProps, _.isFunction);
	return _.isEqual(prevProps, nextProps);
});

export default DragSortableView

const styles = StyleSheet.create({

})