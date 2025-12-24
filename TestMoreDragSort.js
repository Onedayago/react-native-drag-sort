/**
 * @file testMoreDragSort.js
 * @description
 * @author liushun
 * @created 2025/12/24 15:49
 * @lastModified 2025/12/24 15:49
 */


/**
 * @file TestDrag.js
 * @description
 * @author liushun
 * @created 2025/12/24 15:17
 * @lastModified 2025/12/24 15:17
 */
import {Dimensions, ScrollView, Text, View} from "react-native";
import DragSortView from "./lib/DragSortView";
import React, {useRef} from "react";

const windowWidth = Dimensions.get("window").width;

const TestMoreDragSort = () => {
	
	const scrollViewRef = useRef(null); //最外层 scrollView
	
	const scrollYRef = useRef(0); //已经滚动的距离
	
	const scrollViewHeightRef = useRef(0); //页面展示视图大小
	
	const renderOneItem = (item, index) => {
		return(
			<View style={{width: windowWidth, height: 50, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'}}>
				<Text>{item}</Text>
			</View>
		)
	}
	
	const renderTwoItem = (item, index) => {
		return(
			<View style={{width: (windowWidth - 10)/2, height: 50, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}>
				<Text>{item}</Text>
			</View>
		)
	}
	
	return(
		<View onLayout={(e)=>{
			scrollViewHeightRef.current = e.nativeEvent.layout.height;
		}}>
			<ScrollView
				bounces={false}
				scrollEventThrottle={16}
				ref={scrollViewRef}
				onScroll={(e)=>{
					scrollYRef.current = e.nativeEvent.contentOffset.y;
				}}
			>
				<DragSortView
					scrollYRef={scrollYRef}
					scrollViewRef={scrollViewRef}
					scrollViewHeightRef={scrollViewHeightRef}
					column={1}
					childrenWidth={windowWidth}
					childrenHeight={50}
					renderItem={renderOneItem}
					rowSpace={10}
					dataSource={['1','2','3','4','5','6','7','8','9','10','11','12', '13','14','15','16','17','18']}
				/>
				<DragSortView
					scrollYRef={scrollYRef}
					scrollViewRef={scrollViewRef}
					scrollViewHeightRef={scrollViewHeightRef}
					column={2}
					childrenWidth={(windowWidth - 10)/2}
					childrenHeight={50}
					renderItem={renderTwoItem}
					rowSpace={10}
					columnSpace={10}
					dataSource={['1','2','3','4','5','6','7','8','9','10','11','12', '13','14','15','16','17','18']}
				/>
			</ScrollView>
		</View>
	
	)
}

export default TestMoreDragSort;