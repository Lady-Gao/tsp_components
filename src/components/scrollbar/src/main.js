// reference https://github.com/noeldelgado/gemini-scrollbar/blob/master/index.js

import {
  addResizeListener,
  removeResizeListener
}
from '../../../utils/resize-event';
import scrollbarWidth from 'element-ui/lib/utils/scrollbar-width';
import { toObject } from 'element-ui/lib/utils/util';
import Bar from './bar';
import '../css/index.scss';

/* istanbul ignore next */
export default {
  name: 'Scrollbar',

  components: { Bar },

  props: {
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {},
    wrapClass: {},
    viewClass: {
      default: 'el-select-dropdown__list'
    },
    viewStyle: {
      default: function _default() {
        return {
          height: '100%'
        };
      }
    },
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div'
    }
  },

  data: function data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      minHeightPercentage: 1,
      minWidthPercentage: 1
    };
  },


  computed: {
    wrap: function wrap() {
      return this.$refs.wrap;
    }
  },

  render: function render(h) {
    var gutter = scrollbarWidth();
    var style = this.wrapStyle;

    if (gutter) {
      var gutterWith = '-' + gutter + 'px';
      var gutterStyle = 'margin-bottom: ' + gutterWith + '; margin-right: ' + gutterWith + ';';

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    var view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    var wrap = h(
      'div',
      {
        ref: 'wrap',
        style: style,
        on: {
          'scroll': this.handleScroll
        },

        'class': [this.wrapClass, 'el-scrollbar__wrap', gutter ? '' : 'el-scrollbar__wrap--hidden-default'] },
      [[view]]
    );
    var nodes = void 0;

    if (!this.native) {
      nodes = [wrap, h(Bar, {
        attrs: {
          move: this.moveX,
          size: this.sizeWidth }
      }), h(Bar, {
        attrs: {
          vertical: true,
          move: this.moveY,
          size: this.sizeHeight }
      })];
    } else {
      nodes = [h(
        'div',
        {
          ref: 'wrap',
          'class': [this.wrapClass, 'el-scrollbar__wrap'],
          style: style },
        [[view]]
      )];
    }
    return h('div', { class: 'el-scrollbar' }, nodes);
  },


  methods: {
    handleScroll: function handleScroll() {
      var wrap = this.wrap;

      this.moveY = wrap.scrollTop * (100 * this.minHeightPercentage) / wrap.clientHeight;
      this.moveX = wrap.scrollLeft * (100 * this.minWidthPercentage) / wrap.clientWidth;
    },
    update: function update() {
      var heightPercentage = void 0,
          widthPercentage = void 0,
          minPercentage = 10;
      var wrap = this.wrap;
      if (!wrap) return;

      var percent_height = wrap.clientHeight * 100 / wrap.scrollHeight,
          percent_width = wrap.clientWidth * 100 / wrap.scrollWidth;

      heightPercentage = Math.max(percent_height, minPercentage);
      widthPercentage = Math.max(percent_width, minPercentage);

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';

      this.minHeightPercentage = percent_height < minPercentage ? percent_height / minPercentage : 1;
      this.minWidthPercentage = percent_width < minPercentage ? percent_width / minPercentage : 1;
    }
  },

  mounted: function mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && addResizeListener(this.$refs.resize, this.update);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.native) return;
    !this.noresize && removeResizeListener(this.$refs.resize, this.update);
  }
};