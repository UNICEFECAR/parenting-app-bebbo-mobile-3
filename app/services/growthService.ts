import { maxHeight, maxWeight } from '@assets/translations/appOfflineData/apiConstants';
import { DateTime } from 'luxon';
import { MeasuresEntity } from '../database/schema/ChildDataSchema';


export interface singleAreaDataFormat {
  x?: number | null,
  y: number | null,
  y0: number | null,
}
export interface chartAreaDataFormat {
  topArea: singleAreaDataFormat[],
  middleArea: singleAreaDataFormat[],
  bottomArea: singleAreaDataFormat[],
}


export const setInitialWeightValues = (weightValue: any) => {
  if (weightValue + ''.indexOf('.') === -1) {
    return { weight: weightValue, weight1: 0 };
  } else {
    let w = (weightValue + '').split('.');
    if (weightValue && String(w[1]).length == 1) {
     return { weight: Number(w[0]), weight1: Number(w[1]) * 10 };
    } else {
      return {
        weight: Number(w[0]) >maxWeight ?maxWeight:Number(w[0]),
        weight1: Number(w[0]) >maxWeight ? (Number(w[0])-maxWeight)*100 : (w[1] == undefined ? 0 : Number(w[1])),
      };
    }
  }
};
export const setInitialHeightValues = (heightValue: any) => {
   if (heightValue + ''.indexOf('.') === -1) {
    return { height: heightValue, height1: 0 };
  } else {
    let w = (heightValue + '').split('.');
    if (heightValue && String(w[1]).length == 1) {
      return { height: Number(w[0]), height1: Number(w[1]) * 10 };
    } else {
      return {
        height: Number(w[0]) >maxHeight ?maxHeight:Number(w[0]),
        height1: Number(w[0]) >maxHeight ? (Number(w[0])-maxHeight)*100 : (w[1] == undefined ? 0 : Number(w[1])),

      };
    }
  }
};

export const convertMeasuresData = (
  measures: MeasuresEntity[],
  childBirthDay: Date,
) => {
  let measurementDateInDays: number = 0;

  let measuresData: any[] = [];

  measures.forEach((item) => {
    if (item.measurementDate) {
      let childAge = DateTime.fromJSDate(new Date(childBirthDay));
      let date = DateTime.fromMillis(item.measurementDate);

      let days = date.diff(childAge, 'days').toObject().days;

      measurementDateInDays = days ? Math.round(days) : 0;
    }

    if (measurementDateInDays>=0 && measurementDateInDays < 1855) {
      measuresData.push({
        weight: item.weight ? parseFloat(item.weight) : 0,
        height: item.height ? parseFloat(item.height) : 0,
        measurementDate: measurementDateInDays ? measurementDateInDays : 0,
      });
    }
  });

  return measuresData;
};
export const formatDaysData = (data: any) => {
  let obj: chartAreaDataFormat;

  let topArea: singleAreaDataFormat[] = [];
  let middleArea: singleAreaDataFormat[] = [];
  let bottomArea: singleAreaDataFormat[] = [];
   data.map((item:any) => {
    topArea.push({ x: Number(item.name) / 30, y: item.sd3, y0: item.sd4 });
    middleArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd3 });
    bottomArea.push({ x: Number(item.name) / 30, y: item.sd3neg, y0: item.sd4neg });
  })

  obj = {
    topArea: topArea,
    middleArea: middleArea,
    bottomArea: bottomArea,
  }

  return obj;
}
export const formatHeightData = (data: any,param:any) => {
  let obj: chartAreaDataFormat;
  let topArea: singleAreaDataFormat[] = [];
  let middleArea: singleAreaDataFormat[] = [];
  let bottomArea: singleAreaDataFormat[] = [];
  if(param=='height'){
    data.map((item:any) => {
      // if (Number(item.name) >= 45 && Number(item.name) <= 87) {
      // if (Number(item.name) > 87.0) {
      topArea.push({ x: Number(item.name)/30, y: item.sd3, y0: item.sd4 });
      middleArea.push({ x: Number(item.name)/30, y: item.sd3neg, y0: item.sd3 });
      bottomArea.push({ x: Number(item.name)/30, y: item.sd3neg, y0: item.sd4neg });
    })
  }
  else{
    data.map((item:any) => {
      // if (Number(item.name) >= 45 && Number(item.name) <= 87) {
      // if (Number(item.name) > 87.0) {
      topArea.push({ x: Number(item.name), y: item.sd3, y0: item.sd4 });
      middleArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd3 });
      bottomArea.push({ x: Number(item.name), y: item.sd3neg, y0: item.sd4neg });
    })
  }
  
  obj = {
    topArea: topArea,
    middleArea: middleArea,
    bottomArea: bottomArea,
  }

  return obj;
}

