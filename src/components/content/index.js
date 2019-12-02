import content from "./src/content.vue";

content.install = function(Vue) {
  Vue.component(content.name, content);
};

export default content;
