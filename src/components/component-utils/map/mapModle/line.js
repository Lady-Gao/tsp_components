import service from '../../../../utils/service'
export default class Line{
    constructor(style,points){
        this.style=service.extend({ strokeColor: "#5298ff",
        strokeWeight: 6,
        strokeOpacity: 1},style);
        this.points=points;
    }
}