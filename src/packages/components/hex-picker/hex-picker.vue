<!-- 选择器 -->
<template>
  <hex-popup
    :maskCloseAble="maskCloseAble"
    mode="bottom"
    :popup="false"
    v-model="popupValue"
    length="auto"
    :safeAreaInsetBottom="safeAreaInsetBottom"
    @close="close"
    :blur="blur"
    :border-radius="borderRadius"
    :closeable="closeable"
  >
    <view class="hex-datetime-picker">
      <view class="hex-picker-header" @touchmove.stop.prevent="">
        {{ title }}
      </view>
      <view class="hex-picker-body">
        <picker-view
          v-if="mode == 'time'"
          :value="valueArr"
          @change="change"
          class="hex-picker-view"
          @pickstart="pickstart"
          @pickend="pickend"
          indicator-style="height: 52px;fontSize: 36rpx;fontWeight: 600"
        >
          <picker-view-column v-if="!reset && params.year">
            <view
              class="hex-column-item"
              :class="{
                'active-column': index === valueArr[getParamsIndex('year')],
              }"
              v-for="(item, index) in years"
              :key="index"
            >
              {{ item }}
              <text v-if="showTimeTag">年</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.month">
            <view
              class="hex-column-item"
              :class="{
                'active-column': index === valueArr[getParamsIndex('month')],
              }"
              v-for="(item, index) in months"
              :key="index"
            >
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">月</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.day">
            <view
              class="hex-column-item"
              :class="{
                'active-column': index === valueArr[getParamsIndex('day')],
              }"
              v-for="(item, index) in days"
              :key="index"
            >
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">日</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.hour">
            <view
              class="hex-column-item"
              :class="{
                'active-column': index === valueArr[getParamsIndex('hour')],
              }"
              v-for="(item, index) in hours"
              :key="index"
            >
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">时</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.minute">
            <view
              class="hex-column-item"
              :class="{
                'active-column': index === valueArr[getParamsIndex('minute')],
              }"
              v-for="(item, index) in minutes"
              :key="index"
            >
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">分</text>
            </view>
          </picker-view-column>
          <picker-view-column v-if="!reset && params.second">
            <view
              class="hex-column-item"
              :class="{
                'active-column': index === valueArr[getParamsIndex('second')],
              }"
              v-for="(item, index) in seconds"
              :key="index"
            >
              {{ formatNumber(item) }}
              <text v-if="showTimeTag">秒</text>
            </view>
          </picker-view-column>
        </picker-view>
        <picker-view
          v-else-if="mode == 'selector'"
          :value="valueArr"
          @change="change"
          class="hex-picker-view"
          @pickstart="pickstart"
          @pickend="pickend"
        >
          <picker-view-column v-if="!reset">
            <view
              class="hex-column-item"
              v-for="(item, index) in range"
              :key="index"
            >
              <view class="hex-line-1">{{
                getItemValue(item, "selector")
              }}</view>
            </view>
          </picker-view-column>
        </picker-view>
        <picker-view
          v-else-if="mode == 'multiSelector'"
          :value="valueArr"
          @change="change"
          class="hex-picker-view"
          @pickstart="pickstart"
          @pickend="pickend"
        >
          <picker-view-column
            v-if="!reset"
            v-for="(item, index) in range"
            :key="index"
          >
            <view
              class="hex-column-item"
              v-for="(item1, index1) in item"
              :key="index1"
            >
              <view class="hex-line-1">{{
                getItemValue(item1, "multiSelector")
              }}</view>
            </view>
          </picker-view-column>
        </picker-view>
      </view>
      <view class="hex-picker-bottom">
        <hex-button @click="getResult('confirm')">确定</hex-button>
      </view>
    </view>
  </hex-popup>
</template>

<script>
/**
 * picker picker弹出选择器
 * @description 此选择器有两种弹出模式：一是时间模式，可以配置年，日，月，时，分，秒参数 二是地区模式，可以配置省，市，区参数
 * @tutorial https://www.uviewui.com/components/picker.html
 * @property {Object} params 需要显示的参数，见官网说明
 * @property {String} mode 模式选择，region-地区类型，time-时间类型（默认time）
 * @property {String Number} start-year 可选的开始年份，mode=time时有效（默认1950）
 * @property {String Number} end-year 可选的结束年份，mode=time时有效（默认2050）
 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区适配（默认false）
 * @property {Boolean} show-time-tag 时间模式时，是否显示后面的年月日中文提示
 * @property {String} cancel-color 取消按钮的颜色（默认#606266）
 * @property {String} confirm-color 确认按钮的颜色（默认#2979ff）
 * @property {String} default-time 默认选中的时间，mode=time时有效
 * @property {String} confirm-text 确认按钮的文字
 * @property {String} cancel-text 取消按钮的文字
 * @property {String} default-region 默认选中的地区，中文形式，mode=region时有效
 * @property {String} default-code 默认选中的地区，编号形式，mode=region时有效
 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
 * @property {String Number} z-index 弹出时的z-index值（默认1075）
 * @property {Array} default-selector 数组形式，其中每一项表示选择了range对应项中的第几个
 * @property {Array} range 自定义选择的数据，mode=selector或mode=multiSelector时有效
 * @property {String} range-key 当range参数的元素为对象时，指定Object中的哪个key的值作为选择器显示内容
 * @event {Function} confirm 点击确定按钮，返回当前选择的值
 * @event {Function} cancel 点击取消按钮，返回当前选择的值
 * @example <hex-picker v-model="show" mode="time"></hex-picker>
 */
export default {
  name: "hex-picker",
  emits: ["update:modelValue", "input", "confirm", "cancel"],
  props: {
    // 通过双向绑定控制组件的弹出与收起
    value: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    // picker中需要显示的参数
    params: {
      type: Object,
      default() {
        return {
          year: true,
          month: true,
          day: true,
          hour: false,
          minute: false,
          second: false,
          timestamp: false,
        };
      },
    },
    // 当mode=selector或者mode=multiSelector时，提供的数组
    range: {
      type: Array,
      default() {
        return [];
      },
    },
    // 当mode=selector或者mode=multiSelector时，提供的默认选中的下标
    defaultSelector: {
      type: Array,
      default() {
        return [0];
      },
    },
    // 当 range 是一个 Array＜Object＞ 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
    rangeKey: {
      type: String,
      default: "",
    },
    // 模式选择，region-地区类型，time-时间类型，selector-单列模式，multiSelector-多列模式
    mode: {
      type: String,
      default: "time",
    },
    borderRadius: {
      type: String,
      default: "40",
    },
    closeable: {
      type: Boolean,
      default: true,
    },
    // 年份开始时间
    startYear: {
      type: [String, Number],
      default: 1950,
    },
    // 年份结束时间
    endYear: {
      type: [String, Number],
      default: 2050,
    },
    // 默认显示的时间，2025-07-02 || 2025-07-02 13:01:00 || 2025/07/02
    defaultTime: {
      type: String,
      default: "",
    },
    // 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
    defaultRegion: {
      type: Array,
      default() {
        return [];
      },
    },
    // 时间模式时，是否显示后面的年月日中文提示
    showTimeTag: {
      type: Boolean,
      default: true,
    },
    // 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
    areaCode: {
      type: Array,
      default() {
        return [];
      },
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: true,
    },
    // 是否允许通过点击遮罩关闭Picker
    maskCloseAble: {
      type: Boolean,
      default: true,
    },
    // 弹出的z-index值
    zIndex: {
      type: [String, Number],
      default: 0,
    },
    // 顶部标题
    title: {
      type: String,
      default: "",
    },
    // 取消按钮的文字
    cancelText: {
      type: String,
      default: "取消",
    },
    // 确认按钮的文字
    confirmText: {
      type: String,
      default: "确认",
    },
    // 遮罩的模糊度
    blur: {
      type: [String, Number],
      default: 0,
    },
    // item height
    itemHeight: {
      type: String,
      default: "104",
    },
  },
  data() {
    return {
      popupValue: false,
      years: [],
      months: [],
      days: [],
      hours: [],
      minutes: [],
      seconds: [],
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      reset: false,
      startDate: "",
      endDate: "",
      valueArr: [],
      moving: false, // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
      defaultParamsArr: [],
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    valueCom() {
      // #ifndef VUE3
      return this.value;
      // #endif

      // #ifdef VUE3
      return this.modelValue;
      // #endif
    },
    propsChange() {
      // 引用这几个变量，是为了监听其变化
      return `${this.mode}-${this.defaultTime}-${this.startYear}-${this.endYear}-${this.defaultRegion}-${this.areaCode}`;
    },
    yearAndMonth() {
      return `${this.year}-${this.month}`;
    },
    uZIndex() {
      // 如果用户有传递z-index值，优先使用
      return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
    },
    indicatorStyle() {
      let style = {};
      style.height = this.itemHeight + "rpx";
      style.fontSize = "36rpx";
      style.fontWeight = "600";

      return style;
    },
  },
  watch: {
    propsChange() {
      this.reset = true;
      setTimeout(() => this.init(), 10);
    },
    // watch监听月份的变化，实时变更日的天数，因为不同月份，天数不一样
    // 一个月可能有30，31天，甚至闰年2月的29天，平年2月28天
    yearAndMonth(val) {
      if (this.params.year) this.setDays();
    },
    // 微信和QQ小程序由于一些奇怪的原因(故同时对所有平台均初始化一遍)，需要重新初始化才能显示正确的值
    valueCom(n) {
      if (n) {
        this.reset = true;
        setTimeout(() => this.init(), 10);
      }
      this.popupValue = n;
    },
  },
  methods: {
    // 标识滑动开始，只有微信小程序才有这样的事件
    pickstart() {
      // #ifdef MP-WEIXIN
      this.moving = true;
      // #endif
    },
    // 标识滑动结束
    pickend() {
      // #ifdef MP-WEIXIN
      this.moving = false;
      // #endif
    },
    // 对单列和多列形式的判断是否有传入变量的情况
    getItemValue(item, mode) {
      // 目前(2020-05-25)uni-app对微信小程序编译有错误，导致v-if为false中的内容也执行，错误导致
      // 单列模式或者多列模式中的getItemValue同时被执行，故在这里再加一层判断
      if (this.mode == mode) {
        return typeof item == "object" ? item[this.rangeKey] : item;
      }
    },
    // 小于10前面补0，用于月份，日期，时分秒等
    formatNumber(num) {
      return +num < 10 ? "0" + num : String(num);
    },
    // 生成递进的数组
    generateArray: function (start, end) {
      // 转为数值格式，否则用户给end-year等传递字符串值时，下面的end+1会导致字符串拼接，而不是相加
      start = Number(start);
      end = Number(end);
      end = end > start ? end : start;
      // 生成数组，获取其中的索引，并剪出来
      return [...Array(end + 1).keys()].slice(start);
    },
    getIndex: function (arr, val) {
      let index = arr.indexOf(val);
      // 如果index为-1(即找不到index值)，~(-1)=-(-1)-1=0，导致条件不成立
      return ~index ? index : 0;
    },
    //日期时间处理
    initTimeValue() {
      // 格式化时间，在IE浏览器(uni不存在此情况)，无法识别日期间的"-"间隔符号
      let fdate = this.defaultTime.replace(/\-/g, "/");
      fdate = fdate && fdate.indexOf("/") == -1 ? `2020/01/01 ${fdate}` : fdate;
      let time = null;
      if (fdate) time = new Date(fdate);
      else time = new Date();
      // 获取年日月时分秒
      this.year = time.getFullYear();
      this.month = Number(time.getMonth()) + 1;
      this.day = time.getDate();
      this.hour = time.getHours();
      this.minute = time.getMinutes();
      this.second = time.getSeconds();
    },
    getParamsIndex(key) {
      let index = this.defaultParamsArr.indexOf(key);
      return index;
    },
    init() {
      this.valueArr = [];
      this.defaultParamsArr = [];
      this.reset = false;
      let obj = this.params;
      let arr = Object.keys(obj).map(function (i) {
        if (obj[i]) {
          return i;
        } else {
          return 0;
        }
      });
      arr.forEach((e) => {
        if (e) {
          this.defaultParamsArr.push(e);
        }
      });
      if (this.mode == "time") {
        this.initTimeValue();
        if (this.params.year) {
          this.valueArr.push(0);
          this.setYears();
        }
        if (this.params.month) {
          this.valueArr.push(0);
          this.setMonths();
        }
        if (this.params.day) {
          this.valueArr.push(0);
          this.setDays();
        }
        if (this.params.hour) {
          this.valueArr.push(0);
          this.setHours();
        }
        if (this.params.minute) {
          this.valueArr.push(0);
          this.setMinutes();
        }
        if (this.params.second) {
          this.valueArr.push(0);
          this.setSeconds();
        }
      } else if (this.mode == "selector") {
        this.valueArr = this.defaultSelector;
      } else if (this.mode == "multiSelector") {
        this.valueArr = this.defaultSelector;
        this.multiSelectorValue = this.defaultSelector;
      }
      this.$forceUpdate();
    },
    // 设置picker的某一列值
    setYears() {
      // 获取年份集合
      this.years = this.generateArray(this.startYear, this.endYear);
      // 设置this.valueArr某一项的值，是为了让picker预选中某一个值
      this.valueArr.splice(
        this.valueArr.length - 1,
        1,
        this.getIndex(this.years, this.year)
      );
    },
    setMonths() {
      this.months = this.generateArray(1, 12);
      this.valueArr.splice(
        this.valueArr.length - 1,
        1,
        this.getIndex(this.months, this.month)
      );
    },
    setDays() {
      let totalDays = new Date(this.year, this.month, 0).getDate();
      this.days = this.generateArray(1, totalDays);
      let index = 0;
      // 这里不能使用类似setMonths()中的this.valueArr.splice(this.valueArr.length - 1, xxx)做法
      // 因为this.month和this.year变化时，会触发watch中的this.setDays()，导致this.valueArr.length计算有误
      if (this.params.year && this.params.month) index = 2;
      else if (this.params.month) index = 1;
      else if (this.params.year) index = 1;
      else index = 0;
      // 当月份变化时，会导致日期的天数也会变化，如果原来选的天数大于变化后的天数，则重置为变化后的最大值
      // 比如原来选中3月31日，调整为2月后，日期变为最大29，这时如果day值继续为31显然不合理，于是将其置为29(picker-column从1开始)
      if (this.day > this.days.length) this.day = this.days.length;
      this.valueArr.splice(index, 1, this.getIndex(this.days, this.day));
    },
    setHours() {
      this.hours = this.generateArray(0, 23);
      this.valueArr.splice(
        this.valueArr.length - 1,
        1,
        this.getIndex(this.hours, this.hour)
      );
    },
    setMinutes() {
      this.minutes = this.generateArray(0, 59);
      this.valueArr.splice(
        this.valueArr.length - 1,
        1,
        this.getIndex(this.minutes, this.minute)
      );
    },
    setSeconds() {
      this.seconds = this.generateArray(0, 59);
      this.valueArr.splice(
        this.valueArr.length - 1,
        1,
        this.getIndex(this.seconds, this.second)
      );
    },

    close() {
      this.$emit("input", false);
      this.$emit("update:modelValue", false);
    },
    // 用户更改picker的列选项
    change(e) {
      this.valueArr = e.detail.value;
      let i = 0;
      if (this.mode == "time") {
        // 这里使用i++，是因为this.valueArr数组的长度是不确定长度的，它根据this.params的值来配置长度
        // 进入if规则，i会加1，保证了能获取准确的值
        if (this.params.year) this.year = this.years[this.valueArr[i++]];
        if (this.params.month) this.month = this.months[this.valueArr[i++]];
        if (this.params.day) this.day = this.days[this.valueArr[i++]];
        if (this.params.hour) this.hour = this.hours[this.valueArr[i++]];
        if (this.params.minute) this.minute = this.minutes[this.valueArr[i++]];
        if (this.params.second) this.second = this.seconds[this.valueArr[i++]];
      } else if (this.mode == "multiSelector") {
        let index = null;
        // 对比前后两个数组，寻找变更的是哪一列，如果某一个元素不同，即可判定该列发生了变化
        this.defaultSelector.map((val, idx) => {
          if (val != e.detail.value[idx]) index = idx;
        });
        // 为了让用户对多列变化时，对动态设置其他列的变更
        if (index != null) {
          this.$emit("columnchange", {
            column: index,
            index: e.detail.value[index],
          });
        }
      }
    },
    // 用户点击确定按钮
    getResult(event = null) {
      // #ifdef MP-WEIXIN
      if (this.moving) return;
      // #endif
      let result = {};
      // 只返回用户在this.params中配置了为true的字段
      if (this.mode == "time") {
        if (this.params.year) result.year = this.formatNumber(this.year || 0);
        if (this.params.month)
          result.month = this.formatNumber(this.month || 0);
        if (this.params.day) result.day = this.formatNumber(this.day || 0);
        if (this.params.hour) result.hour = this.formatNumber(this.hour || 0);
        if (this.params.minute)
          result.minute = this.formatNumber(this.minute || 0);
        if (this.params.second)
          result.second = this.formatNumber(this.second || 0);
        if (this.params.timestamp) result.timestamp = this.getTimestamp();
      } else if (this.mode == "selector") {
        result = this.valueArr;
      } else if (this.mode == "multiSelector") {
        result = this.valueArr;
      }
      if (event) this.$emit(event, result);
      this.close();
    },
    // 获取时间戳
    getTimestamp() {
      // yyyy-mm-dd为安卓写法，不支持iOS，需要使用"/"分隔，才能二者兼容
      let time =
        this.year +
        "/" +
        this.month +
        "/" +
        this.day +
        " " +
        this.hour +
        ":" +
        this.minute +
        ":" +
        this.second;
      return new Date(time).getTime() / 1000;
    },
  },
};
</script>

<style lang="scss" scoped>
.hex-datetime-picker {
  position: relative;
}

.hex-picker-view {
  height: 100%;
  box-sizing: border-box;
  padding: 0 48rpx;
  .uni-picker-view-indicator::after {
    display: none;
  }
  .uni-picker-view-indicator::before {
    display: none;
  }
}

.hex-picker-header {
  padding-left: 48rpx;
  padding-top: 48rpx;
  height: 136rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #1c1c1d;
  box-sizing: border-box;
  background: #fff;
  position: relative;
}

.hex-picker__title {
  color: $hex-content-color;
}

.hex-picker-body {
  width: 100%;
  height: 406rpx;
  overflow: hidden;
  background-color: #fff;
}

.hex-column-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #1c1c1d;
  padding: 0 8rpx;
}
.active-column {
  font-size: 36rpx;
  font-weight: 600;
}

.hex-text {
  font-size: 24rpx;
  padding-left: 8rpx;
}

.hex-opacity {
  opacity: 0.5;
}
.hex-picker-bottom {
  width: 100%;
  height: 128rpx;
  padding: 16rpx 48rpx;
  border-top: 2rpx solid rgba(0, 9, 28, 0.08);
}
</style>
