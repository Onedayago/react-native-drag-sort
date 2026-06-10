
![1](https://github.com/user-attachments/assets/622e6699-875f-4441-a067-9554e47091cc)

# react-native-drag-sort

一个功能强大的 React Native 拖拽排序组件库，支持单列和多列布局，提供流畅的拖拽体验和自动滚动功能。

## 功能特性

### 核心功能
- ✅ **长按拖拽**：长按 500ms 后开始拖拽，提供视觉反馈（缩放效果）
- ✅ **单列/多列布局**：支持自定义列数，灵活布局
- ✅ **自动滚动**：拖拽到边缘时自动触发外层 ScrollView 滚动
- ✅ **流畅动画**：使用 Animated API 实现平滑的位置切换动画
- ✅ **自定义间距**：支持设置行间距和列间距
- ✅ **性能优化**：使用 memo 和 lodash 进行性能优化

### DragListView 特有功能
- ✅ **内置 ScrollView**：无需额外配置，开箱即用的垂直滚动列表
- ✅ **简化 API**：参数更少，配置更简单
- ✅ **自动滚动联动**：自动处理拖拽与滚动的联动逻辑
- ✅ **单列优化**：针对列表视图优化的单列布局

## 安装

### 安装包

```bash
npm install react-native-drag-sort-list
# 或
yarn add react-native-drag-sort-list
```

### 前置依赖

本组件依赖 `react-native-gesture-handler` 和 `lodash`，这些依赖会自动安装。如果遇到问题，可以手动安装：

```bash
npm install react-native-gesture-handler lodash
# 或
yarn add react-native-gesture-handler lodash
```

### iOS 安装

```bash
cd ios && pod install && cd ..
```

## 使用方法

### 基础用法（单列）

```javascript
import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import DragSortView from 'react-native-drag-sort-list';

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
import DragSortView from 'react-native-drag-sort-list';

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
import DragSortView from 'react-native-drag-sort-list';

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

### 使用 DragListView（推荐用于简单列表）

如果你只需要一个简单的可拖拽排序列表，可以使用 `DragListView` 组件，它封装了 ScrollView 和拖拽逻辑，使用更简单：

```javascript
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DragListView from 'react-native-drag-sort-list/lib/DragListView';

const SimpleList = () => {
  const [data, setData] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);

  const renderItem = (item, index) => {
    return (
      <View style={{
        width: '100%',
        height: 80,
        backgroundColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 12,
        padding: 16
      }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
          {item}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>
          长按并拖动重新排序
        </Text>
      </View>
    );
  };

  return (
    <DragListView
      renderItem={renderItem}
      dataSource={data}
      rowSpace={10}
      childrenWidth={300}
      childrenHeight={80}
      onDragEnd={(fromIndex, toIndex) => {
        console.log(`从位置 ${fromIndex} 移动到位置 ${toIndex}`);
        // 手动更新数据
        const newData = [...data];
        const [movedItem] = newData.splice(fromIndex, 1);
        newData.splice(toIndex, 0, movedItem);
        setData(newData);
      }}
    />
  );
};
```

## DragListView 组件

`DragListView` 是一个包装组件，专门用于创建可拖拽排序的列表视图。它内部集成了 `ScrollView` 和 `DragSortableView`，简化了在垂直滚动列表中使用拖拽排序的配置。

### 基础用法

```javascript
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DragListView from 'react-native-drag-sort-list/lib/DragListView';

const MyListComponent = () => {
  const [data, setData] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);

  const renderItem = (item, index) => {
    return (
      <View style={{
        width: '100%',
        height: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 8
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item}</Text>
      </View>
    );
  };

  return (
    <DragListView
      renderItem={renderItem}
      dataSource={data}
      rowSpace={10}
      childrenWidth={300}
      childrenHeight={60}
      onDragEnd={(fromIndex, toIndex) => {
        console.log(`从位置 ${fromIndex} 移动到位置 ${toIndex}`);
        // 更新数据
        const newData = [...data];
        const [movedItem] = newData.splice(fromIndex, 1);
        newData.splice(toIndex, 0, movedItem);
        setData(newData);
      }}
    />
  );
};
```

### DragListView Props

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `renderItem` | `Function(item, index)` | ✅ | - | 渲染每个列表项的函数 |
| `dataSource` | `Array` | ✅ | `[]` | 数据源数组 |
| `rowSpace` | `Number` | ❌ | `0` | 行间距 |
| `childrenWidth` | `Number` | ❌ | `50` | 子项宽度 |
| `childrenHeight` | `Number` | ❌ | `50` | 子项高度 |
| `onDragEnd` | `Function(fromIndex, toIndex)` | ❌ | - | 拖拽结束回调函数 |

### 特性

1. **自动滚动支持**：内置 `ScrollView` 支持垂直滚动
2. **简化配置**：无需手动管理 `scrollYRef`、`scrollViewRef`、`scrollViewHeightRef`
3. **单列布局**：固定为单列布局，适合列表视图
4. **流畅体验**：自动处理滚动和拖拽的联动

### 与 DragSortView 的区别

| 特性 | DragListView | DragSortView |
|------|-------------|--------------|
| **滚动容器** | 内置 ScrollView | 需要外部提供 ScrollView |
| **布局** | 固定单列 | 支持单列和多列 |
| **配置复杂度** | 简单，参数少 | 复杂，需要更多 ref 配置 |
| **适用场景** | 垂直滚动列表 | 网格布局、自定义布局 |

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

### DragListView 使用建议

**何时使用 DragListView：**
- 需要简单的垂直滚动列表
- 不想手动管理 ScrollView 和拖拽组件的联动
- 快速原型开发，需要快速实现拖拽列表

**何时使用 DragSortView：**
- 需要网格布局（多列）
- 需要自定义布局和更复杂的滚动容器
- 需要在同一个 ScrollView 中放置多个拖拽区域
- 需要更细粒度的控制

## 许可证

ISC

## 作者

liushun

