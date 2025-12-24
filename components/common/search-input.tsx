import { useTheme } from '@/hooks'
import TextInputComponent from './text-input-component'

interface SearchInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  onClear?: () => void
  style?: object
}

export default function SearchInput({
  value,
  onChangeText,
  placeholder = 'search',
  onClear,
  style,
}: SearchInputProps) {
  const { colors } = useTheme()


  return (
    <TextInputComponent
      leftIcon='Search'
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      borderRadius={999}
      hideBorder
      style={{
        height: 38,
        paddingVertical: 8,
        backgroundColor: colors.cardDisabled,
        borderRadius: 999,
      }}
    />
  )
}
