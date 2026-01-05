/**
 * @file DragItemContainer.js
 * @description
 * @author liushun
 * @created 2025/12/20 13:22
 * @lastModified 2025/12/20 13:22
 */

import React, {useRef} from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'


const DragItemContainer = (props) => {
	
	const {x, y,  childrenHeight, childrenWidth, onDragStart, onDragMove, onDragEnd} = props;
	const [zIndex, setZIndex] = React.useState(0);
	
	const itemScaleAnime = useRef(new Animated.Value(1)).current;
	
	const isDragging = useRef(false);
	//长按手势处理
	const longPress = Gesture.LongPress().onStart((e)=>{
		itemScaleAnime.setValue(1.1)
		setZIndex(1000);
		onDragStart?.(e);
		isDragging.current = true;
	}).minDuration(500).enabled(true);
	
	//处理滑动和抬起手势
	const pan = Gesture.Pan().onUpdate((e) => {
		if(isDragging.current){
			onDragMove?.(e);
		}
	}).onTouchesUp((e)=>{ //停止拖拽
		if(isDragging.current){
			isDragging.current = false;
			itemScaleAnime.setValue(1)
			setZIndex(0);
			onDragEnd?.(e);
		}
	}).activateAfterLongPress(505).enabled(true);
	
	//手势合并
	const composed = Gesture.Simultaneous(longPress, pan);
	
	
	return (
		<GestureDetector gesture={composed}>
			<Animated.View style={[
				styles.container,
				{zIndex},
				{top: y, left: x},
				{width: childrenWidth, height: childrenHeight},
				{transform: [{ scale: itemScaleAnime }],}
			]}>
				{props.children}
			</Animated.View>
		</GestureDetector>
	)
}

export default DragItemContainer;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
	}
})