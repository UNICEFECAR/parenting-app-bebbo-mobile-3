import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1, Heading3Center, ShiftFromTop10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components';
type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};
const SupportChat = ({ navigation }: Props) => {
  const themeContext = useContext(ThemeContext);
  const {t, i18n} = useTranslation();
  const headerColor=themeContext.colors.PRIMARY_COLOR;
  return (
    <>
     <SafeAreaView style={{flex:1}}>
     <FocusAwareStatusBar
        animated={true}
        backgroundColor={headerColor}
       />
       <TabScreenHeader
          title={t('supportScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#000"
        />
      <View style={{
        flexDirection: 'column',
        flex: 1,
      }}>
        
        <View style={{flex:1,alignItems:'center',justifyContent: 'center',padding:50}}>
          <Heading1>{t('supportScreenheader1text')}</Heading1>
          <ShiftFromTop10>
          <Heading3Center>{t('supportScreenheader2text')}</Heading3Center>
          </ShiftFromTop10>
        </View>
      </View>
      </SafeAreaView>
    </>
  );
};

export default SupportChat;
