
![1](https://github.com/user-attachments/assets/622e6699-875f-4441-a067-9554e47091cc)

# react-native-drag-sort

一个功能强大的 React Native 拖拽排序组件库，支持单列和多列布局，提供流畅的拖拽体验和自动滚动功能。

## 功能特性

- ✅ **长按拖拽**：长按 500ms 后开始拖拽，提供视觉反馈（缩放效果）
- ✅ **单列/多列布局**：支持自定义列数，灵活布局
- ✅ **自动滚动**：拖拽到边缘时自动触发外层 ScrollView 滚动
- ✅ **流畅动画**：使用 Animated API 实现平滑的位置切换动画
- ✅ **ScrollView 联动**：支持与外层 ScrollView 无缝集成
- ✅ **自定义间距**：支持设置行间距和列间距
- ✅ **性能优化**：使用 memo 和 lodash 进行性能优化

## 安装

### 前置依赖

本组件依赖 `react-native-gesture-handler` `lodash`，请先安装：

```bash
npm install react-native-gesture-handler
npm install lodash
# 或
yarn add react-native-gesture-handler
yarn add lodash
```

### iOS 安装

```bash
cd ios && pod install && cd ..
```

### 使用组件

```bash
# 将组件文件复制到你的项目中，或通过 npm link 等方式引入
```

## 使用方法

### 基础用法（单列）

```javascript
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import DragSortView from './lib/DragSortView';

const windowWidth = Dimensions.get('window').width;

const MyComponent = () => {
  const [data, setData] = React.useState(['1', '2', '3', '4', '5']);

  const renderItem = (item, index) => {
    return (
      <View style={{
        width: windowWidth,
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <DragSortView
      column={1}
      childrenWidth={windowWidth}
      childrenHeight={50}
      renderItem={renderItem}
      rowSpace={10}
      dataSource={data}
      onDragEnd={(from, to, newData) => {
        console.log('从位置', from, '移动到位置', to);
        setData(newData);
      }}
    />
  );
};
```

### 多列布局

```javascript
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import DragSortView from './lib/DragSortView';

const windowWidth = Dimensions.get('window').width;

const MyComponent = () => {
  const [data, setData] = React.useState(['1', '2', '3', '4', '5', '6']);

  const renderItem = (item, index) => {
    return (
      <View style={{
        width: (windowWidth - 10) / 2,
        height: 50,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <DragSortView
      column={2}
      childrenWidth={(windowWidth - 10) / 2}
      childrenHeight={50}
      renderItem={renderItem}
      rowSpace={10}
      columnSpace={10}
      dataSource={data}
      onDragEnd={(from, to, newData) => {
        setData(newData);
      }}
    />
  );
};
```

### 与 ScrollView 集成

在 ScrollView 中使用时，需要提供三个 ref 来支持自动滚动功能。你可以在同一个 ScrollView 中放置多个 DragSortView：

```javascript
import React, { useRef } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import DragSortView from './lib/DragSortView';

const windowWidth = Dimensions.get('window').width;

const MyComponent = () => {
  const scrollViewRef = useRef(null); // 最外层 scrollView
  const scrollYRef = useRef(0); // 已经滚动的距离
  const scrollViewHeightRef = useRef(0); // 页面展示视图大小

  const renderOneItem = (item, index) => {
    return (
      <View style={{
        width: windowWidth,
        height: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>{item}</Text>
      </View>
    );
  };

  const renderTwoItem = (item, index) => {
    return (
      <View style={{
        width: (windowWidth - 10) / 2,
        height: 50,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <View
      onLayout={(e) => {
        scrollViewHeightRef.current = e.nativeEvent.layout.height;
      }}
    >
      <ScrollView
        bounces={false}
        scrollEventThrottle={16}
        ref={scrollViewRef}
        onScroll={(e) => {
          scrollYRef.current = e.nativeEvent.contentOffset.y;
        }}
      >
        {/* 单列拖拽列表 */}
        <DragSortView
          scrollYRef={scrollYRef}
          scrollViewRef={scrollViewRef}
          scrollViewHeightRef={scrollViewHeightRef}
          column={1}
          childrenWidth={windowWidth}
          childrenHeight={50}
          renderItem={renderOneItem}
          rowSpace={10}
          dataSource={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
        />
        
        {/* 多列拖拽列表 */}
        <DragSortView
          scrollYRef={scrollYRef}
          scrollViewRef={scrollViewRef}
          scrollViewHeightRef={scrollViewHeightRef}
          column={2}
          childrenWidth={(windowWidth - 10) / 2}
          childrenHeight={50}
          renderItem={renderTwoItem}
          rowSpace={10}
          columnSpace={10}
          dataSource={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
        />
      </ScrollView>
    </View>
  );
};
```

## API 文档

### DragSortView Props

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `dataSource` | `Array` | ✅ | - | 数据源数组 |
| `renderItem` | `Function(item, index)` | ✅ | - | 渲染每个列表项的函数 |
| `childrenWidth` | `Number` | ✅ | - | 子元素宽度 |
| `childrenHeight` | `Number` | ✅ | - | 子元素高度 |
| `column` | `Number` | ❌ | `1` | 列数 |
| `rowSpace` | `Number` | ❌ | `0` | 行间距 |
| `columnSpace` | `Number` | ❌ | `0` | 列间距 |
| `keyStr` | `String` | ❌ | - | 作为列表 key 的关键字（用于优化渲染） |
| `onDragStart` | `Function()` | ❌ | - | 拖拽开始回调 |
| `onDragEnd` | `Function(from, to, newData)` | ❌ | - | 拖拽结束回调，参数：原始索引、新索引、新数据数组 |
| `parentYRef` | `Ref<Number>` | ❌ | - | 如果当前拖拽视图在一个容器中，则需要这个容器在 scrollView 的 y 位置 |
| `scrollYRef` | `Ref<Number>` | ❌ | - | 外层 ScrollView 滚动距离的 ref |
| `scrollViewRef` | `Ref<ScrollView>` | ❌ | - | 外层 ScrollView 的 ref |
| `scrollViewHeightRef` | `Ref<Number>` | ❌ | - | 外层 ScrollView 视图高度的 ref |
| `triggerTop` | `Number` | ❌ | `200` | 距离页面顶部多少距离触发自动向上滚动 |
| `triggerBottom` | `Number` | ❌ | `屏幕高度 - 200` | 距离页面顶部多少距离触发自动向下滚动 |

### onDragEnd 回调参数

- `from` (Number): 拖拽元素的原始索引位置
- `to` (Number): 拖拽元素的新索引位置
- `newData` (Array): 重新排序后的新数据数组

## 注意事项

1. **手势库依赖**：确保已正确安装和配置 `react-native-gesture-handler`，并在应用入口处导入：
   ```javascript
   import 'react-native-gesture-handler';
   ```

2. **ScrollView 集成**：如果需要在 ScrollView 中使用，必须提供 `scrollYRef`、`scrollViewRef` 和 `scrollViewHeightRef` 三个 ref，否则自动滚动功能将无法正常工作。

3. **性能优化**：组件内部使用 `memo` 进行优化，但建议为 `dataSource` 中的每个对象提供唯一的 `keyStr` 属性以进一步提升性能。

4. **平台差异**：
   - iOS 和 Android 的滚动速度和距离有细微差异（iOS: 10ms/2px, Android: 20ms/5px）
   - 可通过修改 `DragSortView.js` 中的 `TIME` 和 `DISTANCE` 常量进行调整

5. **长按时间**：默认长按 500ms 后开始拖拽，可通过修改 `DragItemContainer.js` 中的 `minDuration` 和 `activateAfterLongPress` 进行调整。

## 示例项目

项目包含两个测试文件，展示了不同的使用场景：

- `TestDragSort.js`：基础单列拖拽示例
- `TestMoreDragSort.js`：ScrollView 集成和多列布局示例

## 许可证

ISC

## 作者

liushun

