import Scrollbar from './src/main';
Scrollbar.install = function (Scrollbar) {
    Vue.component(Scrollbar.name, Scrollbar);
}

export default Scrollbar;