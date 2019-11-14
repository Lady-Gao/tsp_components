import service from '../../../../utils/service'
export default class Circle{

    constructor(point, radius, style) {
        this.point = point;
        this.radius = radius;
        this.options = optins || {};
        this.style =service.extend({
            strokeColor: '#20a0ff',
            strokeWeight: 2,
            strokeOpacity: 0.5
        },style); 
    }
}