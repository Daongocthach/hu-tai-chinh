import * as Linking from 'expo-linking'
import { useEffect, useState } from 'react'

import { showAlert, showToast } from '@/alerts'
import {
  ButtonComponent,
  CardContainer,
  ChangeLanguageDropdown,
  ColumnComponent,
  Container,
  IconComponent,
  RowComponent,
  SwitchComponent,
  TextComponent
} from '@/components'
import { useCheckAppUpdate } from '@/hooks/use-check-app-update'
import { LanguageProps, VERSION_PATCH } from '@/lib'
import useStore from '@/store'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

export default function SettingsScreen() {
  const { t } = useTranslation()
  const {
    hasUpdate,
    checking,
    openUpdate,
  } = useCheckAppUpdate()

  const {
    currentLanguage,
    darkMode,
    changeLanguage,
    setDarkMode,
  } = useStore()
  const [language, setLanguage] = useState<LanguageProps>(currentLanguage)

  const toggleSwitch = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    changeLanguage(language)
  }, [language])

  const handleResetSettings = () => {
    showAlert('reset_settings', () => {
      setLanguage('en')
      setDarkMode(false)
      showToast('reset_settings_success')
    })
  }

  const handleHelp = () => {
    showAlert('help', () => {
      Linking.openURL('https://finepro-automation.vercel.app/contact')
    })
  }

  return (
    <Container isScroll>
      <CardContainer gap={25}>
        <TextComponent type='title' text='system' color='primary' />

        <ColumnComponent gap={20}>
          <ChangeLanguageDropdown viewStyle={{ flexGrow: 1, width: '100%' }} label='language' />
          <RowComponent justify='space-between' alignItems='flex-end'>
            <SwitchComponent
              value={darkMode}
              onToggle={toggleSwitch}
              label='dark mode'
            />
            <IconComponent name={darkMode ? 'Moon' : 'Sun'} />
          </RowComponent>
          <ButtonComponent
            iconProps={{ name: 'TimerReset', color: 'error' }}
            textProps={{ text: 'reset settings' }}
            ghost
            style={{ alignSelf: 'flex-start' }}
            onPress={handleResetSettings}
          />
          <ButtonComponent
            iconProps={{ name: 'Info', color: 'secondary' }}
            textProps={{ text: 'help' }}
            ghost
            style={{ alignSelf: 'flex-start' }}
            onPress={handleHelp}
          />
          {Platform.OS === 'android' &&
            <ButtonComponent
              iconProps={{ name: 'CloudDownload', color: hasUpdate ? 'secondary' : 'icon' }}
              textProps={{
                text: checking
                  ? 'checking update'
                  : hasUpdate
                    ? t('update available') + ' (v1.0.' + (VERSION_PATCH + 1) + ')'
                    : 'up to date',
              }}
              ghost
              disabled={!hasUpdate}
              style={{ alignSelf: 'flex-start' }}
              onPress={openUpdate}
            />
          }
          <TextComponent
            type='caption'
            color='onCardDisabled'
            text={`v1.0.${VERSION_PATCH}`}
          />
        </ColumnComponent>
      </CardContainer>
    </Container>
  )
}