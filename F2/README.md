### jQuery实现轮播
***
####效果图
![enter image description here](http://chuantu.biz/t5/165/1502265627x1822611311.png)
***
#### 功能介绍
*  自动播放（自动轮播速度为3s/张）
*  轮播图始终保持在页面顶端
*  底部导航栏，可以定位到某张图片
*  鼠标移到图片上时会显示向前向后翻的指引图标，可以翻页
*  图片有淡入淡出的效果
*  轮播图可以随窗口大小改变，并且保持长宽比不变
*  **触摸滑动，兼容移动端**，用网页直接打开没有效果，需要借助Chrome的工具，模拟移动端，可以实现触屏滚动的特效，以下为测试环境截图![enter image description here](http://chuantu.biz/t5/165/1502265243x1910895695.png)
***
####  实现过程
##### 环境准备
* 在ubuntu中下载安装node和npm ，进而更快捷的安装less
* 下载jquery所需的文件
##### 具体操作
* 学习代码使用规范，掌握常用代码的书写格式
* 先编写.html,将整体放在一个box中，方便使其整体适应窗口，二级div slider中分成三部分：图片列表，导航div块，翻页div块
* 使用 ```setInterval（）``` 和 ```clearInterval()``` 来控制轮播的开始和停止
*  用jquery来实现页面的各项功能，利用.addclass使得图片和页标可以同步翻页
```javascript
/** 
 * 实现翻页
 */
function play(preIndex, currentIndex) { 
    $('.slider-panel').eq(preIndex).fadeOut(500).parent().children().eq(currentIndex).fadeIn(1000); //遍历方式，淡入淡出
    $('.slider-item').removeClass('slider-item-selected'); //使得页标和图片的改变同步
    $('.slider-item').eq(currentIndex).addClass('slider-item-selected'); 
}  
```
* 增加```<a>``` 标签来实现前后翻页块
* 控制元素大小的时候大多应用百分比定义的方式，其中设置slider大小的时候，应用`vw`单位来实现长宽比例固定并可以随窗口大小变化
```css
.slider {
  position: absolute;
  width: 100vw;
  height: 46vw;
  margin: 0;
  padding: 0;
}
```
* 触摸滑动，应用原生js `touch`事件实现，学习过程中接触了`javascript swipe`插件和`Swiper`插件,效果还不是很理想但收获颇多。
***
#### 待学习
* 用less语言所写的代码有些冗杂
* 在学习触摸滑动时用到了原生js并且代码块过于复杂，其中代码有和jquery写的代码小部分功能重复，代码待完善
* 在Chrome中的移动端模拟器中圆圈导航块位置有些偏离图片底端，圆圈不能跟着图片一起缩小放大
