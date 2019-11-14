/*
* name: 所有dom操作的简单方法
* author: wukangjun
* time: 2017.07.10
*/
var slice = Array.prototype.slice;
var myJq = {};

var trim = function(string) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
};
// 目前只支持标签查找--find
myJq.find = function(ele, name) {
  var item;
  if (ele instanceof HTMLElement) {
    item = ele;
  } else {
    item = document.querySelector(ele);
  }
  var arr = [];
  function done(node) {
    if (node.children.length != 0) {
      var childrenNodes = node.children;
      for (var index = 0, len = childrenNodes.length; index < len; index++) {
        if (childrenNodes[index].nodeName.toLowerCase() == name) {
          arr.push(childrenNodes[index]);
        }
        done(childrenNodes[index]);
      }
    }
  }
  done(item);
  return arr;
};

myJq.$ = function(selector, context) {
  var context = context || document,
    poster = context.querySelectorAll(selector);
  return poster.length > 1 ? poster : poster[0];
};

myJq.prependTo = function(child, parent) {
  if (parent.firstChild) {
    parent.insertBefore(child, parent.firstChild);
  } else {
    parent.appendChild(child);
  }
};

myJq.after = function(child, target) {
  var parent = target.parentNode;
  if (parent.lastChild == target) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, target.nextSibling);
  }
};

// 绑定事件 -- on
myJq.on = (function(element, event, handler) {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

// 解除绑定 --off
myJq.off = (function(element, event, handler) {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * 切换body的className来更换主题
 * 判断类名是否存在进行删除或者添加
 */
myJq.toggleClass=function(obj,cls){  
                if(this.hasClass(obj,cls)){  
                    this.removeClass(obj, cls);  
                }else{  
                    this.addClass(obj, cls);  
                }  
     },
// 是否有当前类名
myJq.hasClass = function(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
};

//添加类名
myJq.addClass = function(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || "").split(" ");

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!this.hasClass(el, clsName)) {
        curClass += " " + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

//移除类名
myJq.removeClass = function(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(" ");
  var curClass = " " + el.className + " ";

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (this.hasClass(el, clsName)) {
        curClass = curClass.replace(" " + clsName + " ", " ");
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

//添加属性
myJq.attr = function(el, attrName, value) {
  if (value) {
    el.setAttribute(attrName, value);
  } else {
    return el.getAttribute(attrName);
  }
};

//移除属性
myJq.removeAttr = function(el, attrName) {
  el.removeAttribute(attrName);
};

myJq.getDom = function(className) {
  return document.getElementsByClassName(className);
};

//显示
myJq.show = function(el, type) {
  var type = type || "block";
  el.style.display = type;
  return this;
};

// 隐藏
myJq.hide = function(el) {
  el.style.display = "none";
  return this;
};

// 设置样式
myJq.css = function(el, name, config) {
  if (el) {
    if (arguments.length > 2) {
      el.style[name] = config;
    } else {
      return el.style[name];
    }
  }
};

myJq.delegation = (event, name = "LI") => {
  let target = event.target;
  while (target && target.tagName.toUpperCase() !== "HTML") {
    if (target.tagName === name.toUpperCase()) {
      return target;
    }
    target = target.parentNode;
  }
  return null;
};

/**
 *
 * @param {*Element} element: 父元素
 * @param {* String} eventName: 事件名称
 * @param {* String} delegator: 子元素类名
 * @param {* Function} handler: 方法
 */
myJq.handler = function(element, eventName, delegator, handler) {
  element.addEventListener(
    eventName,
    function(e) {
      const _this = deletator(e, delegator);
      _this && handler.apply(_this, arguments);
    },
    false
  );

  function deletator(e, name) {
    let target = (e || windowevent).target;
    let reg = new RegExp(name, "g");
    while (target && target.tagName.toUpperCase() !== "HTML") {
      if (reg.test(target.className)) {
        return target;
      }
      target = target.parentNode;
    }
    return null;
  }
};

export default myJq;
