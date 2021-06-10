import RNFS from 'react-native-fs';
import { appConfig } from './../types/apiConstants';

import axios, { AxiosResponse } from "axios";
import { SagaReturnType } from "redux-saga/effects";
import { RootState, useAppSelector } from "../../App";
import { commonApiInterface } from "../interface/interface";
import { finalUrl } from "../types/apiConstants";
import axiosService from "./axiosService";
import { store } from "../../App";
import ImageStorage from "../downloadImages/ImageStorage";
import { Alert } from "react-native";
import CountryLanguageConfirmation from '../screens/localization/CountryLanguageConfirmation';
import downloadImages from '../downloadImages/ImageStorage';
import { setSponsarStore } from '../redux/reducers/localizationSlice';

export const client =
  'https://raw.githubusercontent.com/UNICEFECAR/parent-buddy-mobile/master/src/translations/';

const commonApiService: commonApiInterface = async (apiEndpoint: string, methodname: any, postdata: object) => {
  //  console.log("apinameapiname")
  //  console.log(apiname,methodname,postdata);
  const storedata = store.getState();
  console.log("store val--", storedata)

  let selectedLang, selectedCountry;
  selectedCountry = storedata.selectedCountry.countryId;
  selectedLang = storedata.selectedCountry.languageCode;
  let newurl = finalUrl(apiEndpoint, selectedCountry, selectedLang)
  console.log("newurl--", newurl);
  let responseData: any = {};
  responseData.apiEndpoint = apiEndpoint;
  return await axiosService({
    method: methodname,
    url: newurl,
    params: postdata
  })
    .then((response: any) => {
      console.log("successsssss");
      //  console.log(response.data);
      responseData.data = response.data,
        responseData.status = response.status
      return responseData;
      // return response;
    })
    .catch((err: any) => {
      console.log("errcodeee");
      responseData.data = err.message
      responseData.status = err.response.status;
      return responseData;
      // if (err.code == 'ECONNABORTED' || err.message == 'Network Error') {
      //  return null;
      // } else {
      //    return null;
      // }
    });
}
export const onApiSuccess = async (response: any) => {
  console.log(response, "..response..");
 
  // const sponsarobj = [...response.data.data];
  // const filteredArray=response.data.data[0].find((item:any)=>{
  //   item['country_flag'] && item['country_sponsar_logo'] && item['country_national_partner']
  // })

  // console.log(filteredArray,"..filteredArray..");

  if (response[0].apiEndpoint == appConfig.sponsors) {
    response = response[0];
    const ImageArray = [];
    // let obj=[];
   // type:val.type,title:val.title,id:val.id,
    const sponsarObj = response.data.data.map((val: any) => {
      return ({country_flag:{ srcUrl: val['country_flag'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_flag'].name }})
    })
    const partnerObj = response.data.data.map((val: any) => {
      return ({country_sponsor_logo:{ srcUrl: val['country_sponsor_logo'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_sponsor_logo'].name }})
    })
    const logoObj = response.data.data.map((val: any) => {
      return ({country_national_partner:{ srcUrl: val['country_national_partner'].url, destFolder: RNFS.DocumentDirectoryPath + '/content', destFilename: val['country_national_partner'].name }})
    })
    ImageArray.push(logoObj[0].country_national_partner)
    ImageArray.push(partnerObj[0].country_sponsor_logo)
    ImageArray.push(sponsarObj[0].country_flag)
   
    const imagesDownloadResult = await downloadImages(ImageArray);
    console.log(imagesDownloadResult, "..image result..");
    store.dispatch(setSponsarStore(imagesDownloadResult));
    
    // const country= new CountryLanguageConfirmation();
    // country.dispatchSponsars();
  }
  else if(response.apiEndpoint == appConfig.sponsors){

  }
}
export const onApiFail = (error: any) => {
  console.log(error, "..error..");

}
export const retryAlert = () => {
  return new Promise((resolve, reject) => {
    Alert.alert('Retry', "All content is not downloaded.Please Retry.",
      [
        {
          text: "Cancel",
          onPress: () => reject("Retry Cancelled"),
          style: "cancel"
        },
        { text: "Retry", onPress: () => resolve("Retry success") }
      ]
    );
  });
}

export default commonApiService;
