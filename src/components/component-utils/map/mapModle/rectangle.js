import service from '../../../../utils/service'
export default class Rectangle {
    constructor(minLng, maxLng, minLat, maxLat, options) {
        this.leftTop = {
            lng: minLng,
            lat: maxLat
        };
        this.leftBottom = {
            lng: minLng,
            lat: minLat
        };
        this.rightTop = {
            lng: maxLng,
            lat: maxLat
        };
        this.rightBottom = {
            lng: maxLng,
            lat: minLat
        };
        this.style = service.extend({
            strokeColor: '#20a0ff',
            strokeWeight: 2,
            strokeOpacity: 1
        }, options);
    }
}