import GoogleMap from './src/google.vue'

GoogleMap.install = function (Vue) {
    Vue.component(GoogleMap.name, GoogleMap);
}

export default GoogleMap;