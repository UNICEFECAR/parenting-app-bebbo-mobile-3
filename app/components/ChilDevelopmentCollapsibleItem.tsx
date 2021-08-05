import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading4, Heading4Regular, Heading5, ShiftFromBottom5, ShiftFromTop5, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { Text } from 'victory-native';
import { useAppSelector } from '../../App';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxDevActive, CheckboxItem } from './shared/CheckboxStyle';
import { MainContainer } from './shared/Container';
import { DevelopmentBox } from './shared/DevelopmentStyle';
import { DividerDev } from './shared/Divider';
import { FDirRow, Flex5 } from './shared/FlexBoxStyle';
import Icon from './shared/Icon';
import VideoPlayer from './VideoPlayer';
import RNFS from 'react-native-fs';
import downloadImages from '../downloadImages/ImageStorage';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import HTML from 'react-native-render-html';

// const videoarticleType = {

// }

const ChilDevelopmentCollapsibleItem = (props: any) => {
  const {item, VideoArticlesData, ActivitiesData, sendMileStoneDatatoParent, currentSelectedChildId} = props;
  // console.log(item);
  // console.log(ActivitiesData);
  const navigation = useNavigation();
  const {t}= useTranslation()
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const activeChilduuid = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild).uuid
    : [],
);
  const [selVideoArticleData, setselVideoArticleData] = useState();
  const [selActivitiesData, setselActivitiesData] = useState();
  // useFocusEffect(
  //   React.useCallback(() => {
    useEffect(() => {
      console.log("collapsible usefocuseffect",item);
      if(item?.toggleCheck == true)
      {
        setToggleCheckBox(true);
      }else {
        setToggleCheckBox(false);
      }
      const fetchData = async () => {
        setselVideoArticleData(VideoArticlesData.filter((x:any) => x.id == item?.related_video_articles[0])[0]);
        setselActivitiesData(ActivitiesData.filter((x:any) => x.id == item?.related_activities[0])[0]);
        if(selActivitiesData && selActivitiesData?.cover_image && selActivitiesData?.cover_image?.url != "")
        {   
            let imageArray = [];
            imageArray.push({
                srcUrl: selActivitiesData?.cover_image.url, 
                destFolder: RNFS.DocumentDirectoryPath + '/content', 
                destFilename: selActivitiesData?.cover_image.url.split('/').pop()
            })
            const imagesDownloadResult = await downloadImages(imageArray);
            // console.log(imagesDownloadResult,"--imagesDownloadResult");
        }
      }
      fetchData()
    }, []);
  //   },[])
  // );
  const milestoneCheckUncheck = async () => {
    // console.log(activeChilduuid,"--checked mielstone---",item);
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    // console.log("filterQuery--",filterQuery);
    setToggleCheckBox(!toggleCheckBox);
    sendMileStoneDatatoParent(item,!toggleCheckBox);
    const updatemilestone = await userRealmCommon.updateChildMilestones<ChildEntity>(ChildEntitySchema,item?.id,filterQuery);
  }
  const gotoArticle =(articleId: any[])=>{
    // 3626
    console.log("currentSelectedChildId---",currentSelectedChildId)
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"MileStone",
      headerColor:artHeaderColor,
      backgroundColor:artBackgroundColor,
      detailData:articleId[0],
      currentSelectedChildId: currentSelectedChildId
    });
  }
  const gotoActivity =(activityData)=>{
    console.log("activityData--",activityData);
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"MileStoneActivity", //ChildDevelopment
      headerColor:actHeaderColor,
      backgroundColor:actBackgroundColor,
      detailData:activityData,
      // listCategoryArray: filterArray,
      selectedChildActivitiesData: currentSelectedChildId,
      currentSelectedChildId: currentSelectedChildId
    });
  }
  return (
    <>
    <MainContainer key={item.id}>
    <DevelopmentBox>
    <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection:'row',
            }}>
            <Pressable
              onPress={() => {
                milestoneCheckUncheck();
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxDevActive>
                      <Icon name="ic_tick" size={12} color="#000" />
                    </CheckboxDevActive>
                  ) : (
                    <Checkbox style={{borderWidth: 1}}></Checkbox>
                  )}
                </View>
              </CheckboxItem>
            </Pressable>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 1
            }}
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <Heading4Regular style={[{flex: 7,textAlignVertical:'center'}]}>
              {item?.title}
            </Heading4Regular>
            <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            />
          </Pressable>
        </View>
        {isOPen ? (
          <>
          <ShiftFromTop5></ShiftFromTop5>
            <ShiftFromTopBottom10>
              <ShiftFromBottom5>
              <Heading4>{t('developScreenmileStone')}</Heading4>
             </ShiftFromBottom5>
              <FDirRow>
                
                {selVideoArticleData && selVideoArticleData?.cover_video && selVideoArticleData?.cover_video?.url != "" ? 
                  // <Image
                  //   source={require('@assets/trash/card1.jpeg')}
                  //   style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                  //   resizeMode={'cover'}
                  // />
                  <VideoPlayer selectedPinnedArticleData={selVideoArticleData}></VideoPlayer>
                  // <Heading4Regular style={{flex: 1}}>in if</Heading4Regular>
                  : null 
                  }
                <Flex5>
                <ShiftFromBottom5>
                  {/* <Heading5>
                    {selVideoArticleData?.title}
                  </Heading5> */}
                  {item && item.body ?
                    <HTML
                      source={{html: item.body}}
                      baseFontStyle={{fontSize: 16}}
                    />
                    : null 
                  }
                  </ShiftFromBottom5>
                  {/* uncomment this for related article */}
                  {item && item.related_articles && item.related_articles.length > 0 ?
                    <Pressable onPress={() => gotoArticle(item.related_articles)}>
                      <ButtonTextSmLineL>
                        {t('developScreenrelatedArticleText')}
                      </ButtonTextSmLineL>
                    </Pressable>
                    : null }
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            <DividerDev></DividerDev>
            
              <ShiftFromTopBottom10>
              <ShiftFromBottom5>
              <Heading4>{t('developScreenrelatedAct')}</Heading4>
             </ShiftFromBottom5>
              <FDirRow>
              { selActivitiesData && selActivitiesData?.cover_image && selActivitiesData?.cover_image?.url != "" ? 
                  <Image
                      // source={require('@assets/trash/card1.jpeg')}
                      source={{uri : "file://" + destinationFolder + (selActivitiesData?.cover_image?.url.split('/').pop())}}
                      style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                      resizeMode={'cover'}
                    />
                  : null
              }
                <Flex5>
                <ShiftFromBottom5>
                <Heading5>
                    {selActivitiesData?.title}
                  </Heading5>
                  </ShiftFromBottom5>
                  {selActivitiesData ?
                    <Pressable onPress={() => gotoActivity(selActivitiesData)}>
                      <ButtonTextSmLineL>
                        {t('developScreenviewDetails')}
                      </ButtonTextSmLineL>
                    </Pressable>
                    : null}
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            
          </>
        ) : null}
    </DevelopmentBox>
    </MainContainer>
    </>
  );
};
export default ChilDevelopmentCollapsibleItem;

const styles = StyleSheet.create({
  // item: {
  //   padding: 10,
  //   color: '#000',
  //   backgroundColor: '#FFF',
  //   // marginVertical: 8,
  //   marginHorizontal: 16,

  //   marginVertical: 5,
  // },
  title: {
    fontSize: 12,
  },
});
