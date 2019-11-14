import service from '../../../../utils/service'
export default class Marker{
    constructor(point,icon,offset={x:0,y:0},rotation=0){
        this.point={
            lng:point.longitude||point.lng,
            lat:point.latitude||point.lat
        };
        this.icon=icon;
        this.offset=offset;
        this.rotation=rotation;
    }
}