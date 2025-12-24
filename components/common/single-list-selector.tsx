import React, { useState } from 'react'
import { ViewStyle } from 'react-native'

import { useTheme } from "@/hooks"

import { DropdownProps } from '@/lib'
import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import FlatListComponent from './flat-list-component'
import IconComponent from './icon-component'
import PopupComponent from './popup-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import TextInputComponent from './text-input-component'

interface SingleListSelectorProps {
    selects: { label: string, value: string | number }[]
    selected: string | number
    setSelected: (value: any) => void
    label?: string
    placeholder?: string
    style?: ViewStyle
    searchValue?: string
    setSearchValue?: (value: string) => void
    searchPlaceholder?: string
    disabled?: boolean
    onOpen?: () => void
    onRefresh?: () => void
    refreshing?: boolean
    loadMore?: () => void
    isLoading?: boolean
    isFetchingNextPage?: boolean
    isError?: boolean
    hasMore?: boolean
    hideClear?: boolean
    hideFooter?: boolean
    errorMessage?: string
}

export default function SingleListSelector({
    selects,
    selected,
    setSelected,
    label,
    placeholder = 'select an option',
    style,
    searchValue,
    setSearchValue,
    searchPlaceholder = 'search',
    disabled = false,
    onOpen,
    onRefresh,
    refreshing = false,
    loadMore,
    isLoading = false,
    isFetchingNextPage = false,
    isError = false,
    hasMore = false,
    hideClear = false,
    hideFooter = false,
    errorMessage,
}: SingleListSelectorProps) {
    const { colors } = useTheme()
    const [visible, setVisible] = useState(false)
    const [localSelected, setLocalSelected] = useState<DropdownProps>()

    const handleOpen = () => {
        onOpen?.()
        setVisible(true)
    }
    const handleClear = () => {
        setSelected('')
        setLocalSelected(undefined)
    }

    const handleSelect = (item: DropdownProps) => {
        setLocalSelected(item)
        setVisible(false)
        setSelected(item.value)
    }

    return (
        <ColumnComponent gap={4} style={[style]}>
            {label && (
                <TextComponent
                    text={label}
                    type="label"
                />
            )}
            <RowComponent
                style={{
                    height: 44,
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 8,
                    gap: 10,
                    borderColor: colors.outlineVariant,
                    backgroundColor: "transparent",
                    justifyContent: "space-between",
                }}
                disabled={disabled}
                onPress={handleOpen}
            >
                <TextComponent
                    color={localSelected ? colors.onBackground : colors.icon}
                    style={{ flexShrink: 1 }}
                    text={localSelected ? localSelected.label : placeholder}
                />

                {!hideClear && localSelected &&
                    <ButtonComponent
                        isIconOnly
                        iconProps={{ name: "X", size: 16, color: colors.icon }}
                        onPress={handleClear}
                    />
                }
            </RowComponent>

            {errorMessage && (
                <TextComponent
                    type='caption'
                    text={errorMessage}
                    color='error'
                />
            )}

            <PopupComponent
                visible={visible}
                onClose={() => setVisible(false)}
                modalTitle={placeholder}
                isFullHeight
            >
                <FlatListComponent
                    data={selects}
                    keyExtractor={(item) => item.value.toString()}
                    ListHeaderComponent={
                        <ColumnComponent gap={8} style={{ backgroundColor: colors.background}}>
                            {localSelected?.label &&
                                <TextInputComponent
                                    readOnly
                                    value={localSelected.label}
                                    placeholder={searchPlaceholder}
                                    onClear={handleClear}
                                    style={{ backgroundColor: colors.card }}
                                />
                            }
                            <TextInputComponent
                                value={searchValue}
                                onChangeText={setSearchValue}
                                placeholder={searchPlaceholder}
                            />
                        </ColumnComponent>
                    }
                    stickyHeaderIndices={[0]}
                    renderItem={({ item }: { item: DropdownProps }) => {
                        const isSelected = item.value === selected

                        return (
                            <RowComponent
                                onPress={() => handleSelect(item)}
                                justify="space-between"
                                alignItems="center"
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 14,
                                    borderRadius: 8,
                                    backgroundColor: isSelected
                                        ? colors.cardDisabled
                                        : 'transparent',
                                }}
                            >
                                <TextComponent
                                    text={item.label}
                                    numberOfLines={1}
                                    style={{
                                        flexShrink: 1,
                                        color: isSelected ? colors.primary : colors.onBackground,
                                        fontWeight: isSelected ? '600' : '400',
                                    }}
                                />

                                {isSelected && (
                                    <IconComponent
                                        name="Check"
                                        size={18}
                                        color={colors.primary}
                                    />
                                )}
                            </RowComponent>
                        )
                    }}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    loadMore={loadMore}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    isError={isError}
                    hasMore={hasMore}
                    hideFooter={hideFooter}
                />
            </PopupComponent>
        </ColumnComponent>
    )
}