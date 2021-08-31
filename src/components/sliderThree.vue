<template>
<div class="slider-three">
    <ul class="legend" style="display: none;">
        <li class="value-one">
            <!-- <i></i><span id="value-one"></span> -->
        </li>
        <li class="value-two">
            <!-- <i></i><span id="value-two"></span> -->
        </li>
        <li class="value-three">
            <!-- <i></i><span id="value-three"></span> -->
        </li>
        <li class="total-value">
            <!-- <span>Total: </span><span id="total-value"></span> -->
        </li>
    </ul>
    <div class="content">
        <div class="three-top">
            <p>0</p>
            <div class="three-flex">
                <p v-if="changeTotal">{{ (parseInt(val/60) ? parseInt(val/60) + '分钟' : '') + (val%60 ? (val%60 + '秒') :  '')}}</p>
                <el-input v-else v-model="val" autofocus @blur="changeTotalFun"></el-input>
                <i v-if="changeTotal" @click="changeFun" class="el-icon-edit-outline"></i>
            </div>
        </div>
        <div class="container">
            <div ref="sliderElem" class="three-value-slider">
            <span class="slider-bar left"><span class="slider-bar-left-title">低</span></span>
            <span class="slider-handle left"><span class="slider-bar-left-num" ref="valueOne"></span></span>
            <span class="slider-bar middle"><span class="slider-bar-left-title">中</span></span>
            <span class="slider-handle right"><span class="slider-bar-left-num" ref="valueTwo"></span></span>
            <span class="slider-bar right"><span class="slider-bar-left-title">高</span></span>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import CommonFun from '../js/commonFun'
export default {
  name: "sliderThree",
  data() {
    return {
        val: '',
        val1: '',
        changeTotal: true
    };
  },
  props: ["sliderVal", "sliderVisible"],
  methods: {
    initSlider(sllider) {
        let $this = this;
      var _class, _temp, _class2, _temp2;

      var _createClass = (function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        }
        return call && (typeof call === "object" || typeof call === "function")
          ? call
          : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError(
            "Super expression must either be null or a function, not " +
              typeof superClass
          );
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        });
        if (superClass)
          Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var Legend = (function () {
        function Legend() {
          _classCallCheck(this, Legend);

          this.valueOne = $this.$refs.valueOne;
          this.valueTwo = $this.$refs.valueTwo;
          this.valueThree = {};
          this.totalValue = {};
        }

        _createClass(Legend, [
          {
            key: "setValueOne",
            value: function setValueOne(value) {
                $this.val1 = value;
                $this.sliderVal.val1 = value;
              this.valueOne.textContent = (parseInt(value/60) ? parseInt(value/60) + '分钟' : '') + (value%60 ? (value%60 + '秒') :  '');
            },
          },
          {
            key: "setValueTwo",
            value: function setValueTwo(value) {
                $this.sliderVal.val2 = value;
                let valueM = $this.val1 + value
              this.valueTwo.textContent = (parseInt(valueM/60) ? parseInt(valueM/60) + '分钟' : '') + (valueM%60 ? (valueM%60 + '秒') :  '');
            },
          },
          {
            key: "setValueThree",
            value: function setValueThree(value) {
                $this.sliderVal.val3 = value;
              this.valueThree.textContent = value;
            },
          },
          {
            key: "setTotalValue",
            value: function setTotalValue(value) {
              this.totalValue.textContent = value;
            },
          },
          {
            key: "updateValues",
            value: function updateValues(val1, val2, val3) {
              this.setValueOne(val1);
              this.setValueTwo(val2);
              this.setValueThree(val3);
            },
          },
        ]);

        return Legend;
      })();

      var SliderWidget =
        ((_temp = _class = (function () {
          function SliderWidget(elem, widgetType) {
            _classCallCheck(this, SliderWidget);

            this.elem = elem;
            this.widgetType = widgetType;
            this.totalWidth;
            this.elemWidth;
          }

          _createClass(SliderWidget, [
            {
              key: "setElemWidth",
              value: function setElemWidth(width) {
                var elem = this.elem;

                this.elemWidth = width;
                elem.style.width = width + "px";
              },
            },
            {
              key: "getElemWidth",
              value: function getElemWidth() {
                return this.elemWidth;
              },
            },
            {
              key: "getElemWidthFromCss",
              value: function getElemWidthFromCss() {
                return parseFloat(this.elem.offsetWidth);
              },
            },
          ]);

          return SliderWidget;
        })()),
        (_class.WIDGET_TYPE = {
          HANDLE: 1,
          BAR: 2,
        }),
        _temp);
      var SliderHandle =
        ((_temp2 = _class2 = (function (_SliderWidget) {
          _inherits(SliderHandle, _SliderWidget);

          function SliderHandle(elem, handleType) {
            _classCallCheck(this, SliderHandle);

            var _this = _possibleConstructorReturn(
              this,
              (
                SliderHandle.__proto__ || Object.getPrototypeOf(SliderHandle)
              ).call(this, elem, SliderWidget.WIDGET_TYPE.HANDLE)
            );

            _this.elemWidth = _this.getElemWidthFromCss();
            _this.handleType = handleType;
            _this.curPos;

            _this.bindEvents();
            return _this;
          }

          _createClass(SliderHandle, [
            {
              key: "setPosition",
              value: function setPosition(x) {
                var elem = this.elem,
                  handleType = this.handleType;

                this.curPos = x;
                if (handleType === SliderHandle.HANDLE_TYPE.RIGHT) {
                  elem.style.transform = "translate3d(-" + x + "px, 0, 0)";
                } else {
                  elem.style.transform = "translate3d(" + x + "px, 0, 0)";
                }
              },
            },
            {
              key: "getPosition",
              value: function getPosition() {
                return this.curPos;
              },
            },
            {
              key: "bindEvents",
              value: function bindEvents() {
                var _this2 = this;

                var elem = this.elem,
                  bindEventHelper = this.bindEventHelper;

                var eventHelper = function eventHelper(e) {
                  e.preventDefault();
                  // We want the object with screenX property
                  if (e.touches) {
                    // Handle touch events
                    return e.touches[e.touches.length - 1];
                  }
                  return e;
                };

                elem.addEventListener("touchstart", function (e) {
                  return _this2.onPointerDown(eventHelper(e));
                });
                elem.addEventListener("mousedown", function (e) {
                  return _this2.onPointerDown(eventHelper(e));
                });

                window.addEventListener("touchmove", function (e) {
                  return _this2.onPointerMove(eventHelper(e));
                });
                window.addEventListener("mousemove", function (e) {
                  return _this2.onPointerMove(eventHelper(e));
                });

                window.addEventListener("touchend", function (e) {
                  return _this2.onPointerUp(eventHelper(e));
                });
                window.addEventListener("mouseup", function (e) {
                  return _this2.onPointerUp(eventHelper(e));
                });
              },
            },
            {
              key: "onPointerDown",
              value: function onPointerDown(e) {
              },
            },
            {
              key: "onPointerMove",
              value: function onPointerMove(e) {
              },
            },
            {
              key: "onPointerUp",
              value: function onPointerUp(e) {
              },
            },
          ]);

          return SliderHandle;
        })(SliderWidget)),
        (_class2.HANDLE_TYPE = {
          RIGHT: 1,
          LEFT: 2,
        }),
        _temp2);

      var SliderBar = (function (_SliderWidget2) {
        _inherits(SliderBar, _SliderWidget2);

        function SliderBar(elem) {
          _classCallCheck(this, SliderBar);

          return _possibleConstructorReturn(
            this,
            (SliderBar.__proto__ || Object.getPrototypeOf(SliderBar)).call(
              this,
              elem,
              SliderWidget.WIDGET_TYPE.BAR
            )
          );
        }

        return SliderBar;
      })(SliderWidget);

      var ThreeValueSlider = (function () {
        function ThreeValueSlider(val1, val2, val3, totalVal) {
          _classCallCheck(this, ThreeValueSlider);

          this.sliderElem = $this.$refs.sliderElem;//document.getElementById("three-value-slider");

          var leftHandleElem = this.sliderElem.getElementsByClassName(
            "slider-handle left"
          )[0];
          this.leftHandle = new SliderHandle(
            leftHandleElem,
            SliderHandle.HANDLE_TYPE.LEFT
          );
          var rightHandleElem = this.sliderElem.getElementsByClassName(
            "slider-handle right"
          )[0];
          this.rightHandle = new SliderHandle(
            rightHandleElem,
            SliderHandle.HANDLE_TYPE.RIGHT
          );

          var leftBarElem = this.sliderElem.getElementsByClassName(
            "slider-bar left"
          )[0];
          this.leftBar = new SliderBar(leftBarElem);
          var middleBarElem = this.sliderElem.getElementsByClassName(
            "slider-bar middle"
          )[0];
          this.middleBar = new SliderBar(middleBarElem);
          var rightBarElem = this.sliderElem.getElementsByClassName(
            "slider-bar right"
          )[0];
          this.rightBar = new SliderBar(rightBarElem);

          this.value1 = val1;
          this.value2 = val2;
          this.value3 = val3;
          this.totalValue = totalVal;
          this.totalWidth = this.getTotalWidth();

          this.leftBar.setElemWidth(this.getWidthByValue(this.value1));
          this.middleBar.setElemWidth(this.getWidthByValue(this.value2));
          this.rightBar.setElemWidth(this.getWidthByValue(this.value3));

          // Placing handles at the right position
          this.leftHandle.setPosition(this.leftBar.getElemWidth());
          this.rightHandle.setPosition(this.rightBar.getElemWidth());

          this.bindEvents();
          this.trackLeftHandle();
          this.trackRightHandle();

          this.legend = new Legend();
          this.legend.setTotalValue(totalVal);
          this.legend.updateValues(val1, val2, val3);
        }

        _createClass(ThreeValueSlider, [
          {
            key: "trackRightHandle",
            value: function trackRightHandle() {
              var _this4 = this;

              var rightHandle = this.rightHandle,
                leftBar = this.leftBar,
                rightBar = this.rightBar,
                middleBar = this.middleBar;

              var tracker = {
                pointerDown: false,
                startX: 0,
                rightBarStartWidth: 0,
                middleBarStartWidth: 0,
                handleStartPos: 0,
              };

              var updateValues = function updateValues() {
                var totalValue = _this4.totalValue,
                  value1 = _this4.value1;
                // Value calculated based on rightBar delta

                var newValue3 = _this4.getValueByWidth(rightBar.getElemWidth());
                var newValue2 = totalValue - newValue3 - value1;

                _this4.value3 = newValue3;
                _this4.value2 = newValue2;

                _this4.legend.updateValues(
                  _this4.value1,
                  _this4.value2,
                  _this4.value3
                );
              };

              rightHandle.onPointerDown = function (e) {
                tracker.startX = e.screenX;
                tracker.rightBarStartWidth = rightBar.getElemWidth();
                tracker.middleBarStartWidth = middleBar.getElemWidth();
                tracker.handleStartPos = rightHandle.getPosition();
                tracker.pointerDown = true;
              };

              rightHandle.onPointerMove = function (e) {
                if (!tracker.pointerDown) return;

                var currentX = e.screenX;
                var delta = tracker.startX - currentX;

                var middleBarWidth = tracker.middleBarStartWidth - delta;
                var rightBarWidth = tracker.rightBarStartWidth + delta;
                if (middleBarWidth < 0) {
                  // right handle is next to the left handle
                  if (middleBar.getElemWidth() > 0) {
                    rightHandle.setPosition(
                      _this4.totalWidth - leftBar.getElemWidth()
                    );
                    middleBar.setElemWidth(0);
                    rightBar.setElemWidth(
                      _this4.totalWidth - leftBar.getElemWidth()
                    );

                    updateValues();
                  }
                } else if (rightBarWidth < 0) {
                  // Right handle is at the very right
                  if (rightHandle.getPosition() > 0) {
                    rightHandle.setPosition(0);
                    rightBar.setElemWidth(0);
                    middleBar.setElemWidth(
                      _this4.totalWidth - leftBar.getElemWidth()
                    );

                    updateValues();
                  }
                } else {
                  rightHandle.setPosition(tracker.handleStartPos + delta);
                  rightBar.setElemWidth(tracker.rightBarStartWidth + delta);
                  middleBar.setElemWidth(tracker.middleBarStartWidth - delta);

                  updateValues();
                }
              };

              rightHandle.onPointerUp = function (e) {
                tracker.pointerDown = false;
              };
            },
          },
          {
            key: "trackLeftHandle",
            value: function trackLeftHandle() {
              var _this5 = this;

              var leftHandle = this.leftHandle,
                leftBar = this.leftBar,
                middleBar = this.middleBar,
                rightBar = this.rightBar;

              var tracker = {
                pointerDown: false,
                startX: 0,
                leftBarStartWidth: 0,
                middleBarStartWidth: 0,
                handleStartPos: 0,
              };

              var updateValues = function updateValues() {
                var totalValue = _this5.totalValue,
                  value3 = _this5.value3;
                // Value calculated based on leftBar delta

                var newValue1 = _this5.getValueByWidth(leftBar.getElemWidth());
                var newValue2 = totalValue - newValue1 - value3;

                _this5.value1 = newValue1;
                _this5.value2 = newValue2;

                _this5.legend.updateValues(
                  _this5.value1,
                  _this5.value2,
                  _this5.value3
                );
              };

              leftHandle.onPointerDown = function (e) {
                tracker.startX = e.screenX;
                tracker.leftBarStartWidth = leftBar.getElemWidth();
                tracker.middleBarStartWidth = middleBar.getElemWidth();
                tracker.handleStartPos = leftHandle.getPosition();
                tracker.pointerDown = true;
              };

              leftHandle.onPointerMove = function (e) {
                if (!tracker.pointerDown) return;

                var currentX = e.screenX;
                var delta = currentX - tracker.startX;

                var middleBarWidth = tracker.middleBarStartWidth - delta;
                var leftBarWidth = tracker.leftBarStartWidth + delta;
                if (middleBarWidth < 0) {
                  // Left handle is next to the right handle
                  if (middleBar.getElemWidth() > 0) {
                    leftHandle.setPosition(
                      _this5.totalWidth - rightBar.getElemWidth()
                    );
                    middleBar.setElemWidth(0);
                    leftBar.setElemWidth(
                      _this5.totalWidth - rightBar.getElemWidth()
                    );

                    updateValues();
                  }
                } else if (leftBarWidth < 0) {
                  // Left handle is at the very left
                  if (leftHandle.getPosition() > 0) {
                    leftHandle.setPosition(0);
                    leftBar.setElemWidth(0);
                    middleBar.setElemWidth(
                      _this5.totalWidth - rightBar.getElemWidth()
                    );

                    updateValues();
                  }
                } else {
                  leftHandle.setPosition(tracker.handleStartPos + delta);
                  leftBar.setElemWidth(tracker.leftBarStartWidth + delta);
                  middleBar.setElemWidth(tracker.middleBarStartWidth - delta);

                  updateValues();
                }

              };

              leftHandle.onPointerUp = function (e) {
                tracker.pointerDown = false;
              };
            },
          },
          {
            key: "bindEvents",
            value: function bindEvents() {
              var _this6 = this;

              var leftHandle = this.leftHandle,
                rightHandle = this.rightHandle,
                leftBar = this.leftBar,
                middleBar = this.middleBar,
                rightBar = this.rightBar;

              var updateWidth = CommonFun.throttle(function () {
                var value1 = _this6.value1,
                  value2 = _this6.value2,
                  value3 = _this6.value3;

                _this6.totalWidth = _this6.getTotalWidth();
                leftBar.setElemWidth(_this6.getWidthByValue(value1));
                middleBar.setElemWidth(_this6.getWidthByValue(value2));
                rightBar.setElemWidth(_this6.getWidthByValue(value3));

                leftHandle.setPosition(leftBar.getElemWidth());
                rightHandle.setPosition(rightBar.getElemWidth());
              }, 100)
            //   window.addEventListener("resize", updateWidth);
            },
          },
          {
            key: "getWidthByValue",
            value: function getWidthByValue(value) {
              var totalValue = this.totalValue,
                totalWidth = this.totalWidth;

              return (value / totalValue) * totalWidth;
            },
          },
          {
            key: "getValueByWidth",
            value: function getValueByWidth(width) {
              var totalValue = this.totalValue,
                totalWidth = this.totalWidth;

              return Math.round((width / totalWidth) * totalValue);
            },
          },
          {
            key: "getTotalWidth",
            value: function getTotalWidth() {
              var sliderElem = this.sliderElem,
                leftHandle = this.leftHandle;

              var sliderWidth = parseFloat(sliderElem.offsetWidth);
              var handleWidth = leftHandle.getElemWidth();

              // Exclude padding widths
              var totalWidth = sliderWidth - 2 * handleWidth;
              if (totalWidth < 0) totalWidth = 2 * handleWidth;

              return totalWidth;
            },
          },
        ]);

        return ThreeValueSlider;
      })();

      var slider = new ThreeValueSlider(sllider.val1, sllider.val2, sllider.val3, sllider.valTotal);
    },
    changeFun() {
        this.changeTotal = !this.changeTotal;
    },
    changeTotalFun() {
        this.changeTotal=!this.changeTotal;
        this.sliderVal.valTotal = this.val;
        this.sliderVal.val1 = parseInt(this.val * 3 / 10);
        this.sliderVal.val2 = parseInt(this.val * 3 / 10);
        this.sliderVal.val3 = this.val-this.sliderVal.val1-this.sliderVal.val2;
        this.$emit("changeShow")
    }
  },
  mounted() {
      this.val = this.sliderVal.valTotal
      this.initSlider(this.sliderVal);
  },
};
</script>
<style lang="scss" scoped>
*{
    box-sizing: initial;
}
.el-icon-edit-outline,
.el-icon-circle-plus-outline {
    margin-left: 5px;
    cursor: pointer;
    color: #00E9DF;
    font-size: 16px;
}
.three-flex {
    display: flex;
    align-items: center;
}
.three-top {
    display: flex;
    justify-content: space-between;
    margin: 5px 25px 0;
    color: #fff;
}
.slider-bar-left-title {
    position: absolute;
    top: 12px;
    left: 50%;
    margin-left: -7px;
    color: #fff;
    font-size: 14px;
}
.slider-bar-left-num {
    position: absolute;
    color: #fff;
    top: -30px;
    left: -6px;
}
.slider-three {
    width: 100%;
    // margin-left: -25px;
}
.container {
//   height: 100px;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -moz-box-align: center;
  -o-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
//   flex-direction: column;
//   padding: 0px 15%;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
.legend {
  list-style: none;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  -o-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  color: #999;
}
.legend li {
  margin: 0 5px;
}
.legend .value-one span,
.legend .value-two span,
.legend .value-three span {
  display: inline-block;
  width: 3em;
  padding-left: 10px;
}
.legend i {
  display: inline-block;
  width: 10px;
  height: 10px;
}
.legend .value-one > i {
  background-color: #22C3FF;
}
.legend .value-two > i {
  background-color: #FDD658;
}
.legend .value-three > i {
  background-color: #FA7142;
}
.three-value-slider {
  position: relative;
  width: 100%;
  white-space: nowrap;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -moz-box-align: center;
  -o-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  height: 20px;
  margin: 0 25px;
}
.three-value-slider .slider-handle {
  display: block;
  position: absolute;
  top: 15px;
//   background-color: #fff;
//   height: 20px;
//   width: 25px;
//   border: 1px solid #888;
//   -webkit-box-sizing: border-box;
//   -moz-box-sizing: border-box;
//   box-sizing: border-box;
  cursor: pointer;
//   border-radius: 15px;
//   padding: 0 3px;
    width: 0;
    height: 0;
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;
    border-bottom: 8px solid #00FFF4;
}
.three-value-slider .slider-handle.left {
  left: 4px;
}
.three-value-slider .slider-handle.right {
  right: 4px;
}
.three-value-slider .slider-bar {
  position: relative;
  display: inline-block;
  height: 7px;
}
.three-value-slider .slider-bar.left {
  background-color: #22C3FF;
//   border-top-left-radius: calc(10px/2);
//   border-bottom-left-radius: calc(10px/2);
  padding-right: calc(25px/2);
}
.three-value-slider .slider-bar.middle {
  background-color: #FDD658;
  padding: 0 calc(25px/2);
}
.three-value-slider .slider-bar.right {
  background-color: #FA7142;
//   border-top-right-radius: calc(10px/2);
//   border-bottom-right-radius: calc(10px/2);
  padding-left: calc(25px/2);
}
</style>