/**
 * @file TestDragSort.js
 * @description 
 * @author liushun
 * @created 2025/12/24 15:51
 * @lastModified 2025/12/24 15:51
 */

import {Dimensions, ScrollView, Text, View} from "react-native";
import DragSortView from "./lib/DragSortView";
import React, {useRef} from "react";

const windowWidth = Dimensions.get("window").width;

const TestDragSort = () => {
	
	const renderOneItem = (item, index) => {
		return(
			<View style={{width: windowWidth, height: 50, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'}}>
				<Text>{item}</Text>
			</View>
		)
	}
	
	return(
		<DragSortView
			column={1}
			childrenWidth={windowWidth}
			childrenHeight={50}
			renderItem={renderOneItem}
			rowSpace={10}
			dataSource={['1','2','3','4','5','6','7','8','9','10','11','12', '13','14','15','16','17','18']}
			onDragEnd={(from, to, data)=>{
				console.log(from, to, data)
			}}
		/>
	)
}

export default TestDragSort;