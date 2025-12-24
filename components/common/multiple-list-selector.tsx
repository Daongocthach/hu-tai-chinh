import React, { useState } from 'react'
import { ViewStyle } from 'react-native'

import { useTheme } from '@/hooks'

import ButtonComponent from './button-component'
import Checkbox from './check-box'
import ColumnComponent from './column-component'
import FlatListComponent from './flat-list-component'
import PopupComponent from './popup-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import TextInputComponent from './text-input-component'

interface MultipleListSelectorProps {
    selects: { label: string; value: string }[]
    selected: string[]
    setSelected: (values: string[]) => void
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

export default function MultipleListSelector({
    selects,
    selected,
    setSelected,
    label,
    placeholder = 'select options',
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
}: MultipleListSelectorProps) {
    const { colors } = useTheme()
    const [visible, setVisible] = useState(false)
    const [selectedItems, setSelectedItems] = useState<{ label: string, value: string }[]>([])

    const displayLabel =
        selectedItems.length > 0
            ? selectedItems.map(it => it.label).join(', ')
            : placeholder

    const handleOpen = () => {
        if (disabled) return
        setVisible(true)
        onOpen?.()
    }

    const clearAll = () => {
        setSelected([])
        setSelectedItems([])
    }

    const toggleItem = (value: string) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(item => item !== value))
            setSelectedItems(selectedItems.filter(item => item.value !== value))
        } else {
            setSelected([...selected, value])
            const item = selects.find(item => item.value === value)
            if (item) {
                setSelectedItems([...selectedItems, item])
            }
        }
    }

    return (
        <ColumnComponent gap={4} style={style}>
            {label &&
                <TextComponent
                    text={label}
                    type="label"
                />
            }
            <ColumnComponent gap={4}>
                <RowComponent
                    onPress={handleOpen}
                    disabled={disabled}
                    alignItems="center"
                    style={{
                        height: 44,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: colors.outlineVariant,
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent',
                    }}
                >
                    <TextComponent
                        numberOfLines={1}
                        style={{ flex: 1 }}
                        color={selectedItems.length ? colors.onBackground : colors.icon}
                        text={displayLabel}
                    />

                    {!hideClear && selected.length > 0 && (
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'X', size: 14, color: colors.icon }}
                            onPress={clearAll}
                        />
                    )}
                </RowComponent>
                {selectedItems.length > 0 && (
                    <RowComponent wrap gap={6}>
                        {selectedItems.map(item => (
                            <RowComponent
                                key={item.value}
                                alignItems="center"
                                style={{
                                    paddingVertical: 4,
                                    paddingHorizontal: 8,
                                    backgroundColor: colors.card,
                                    borderRadius: 16,
                                }}
                            >
                                <TextComponent
                                    text={item.label}
                                    numberOfLines={1}
                                    style={{ maxWidth: 120 }}
                                />
                                <ButtonComponent
                                    isIconOnly
                                    iconProps={{
                                        name: 'X',
                                        size: 12,
                                        color: colors.primary,
                                    }}
                                    onPress={() => toggleItem(item.value)}
                                    style={{ marginLeft: 4 }}
                                />
                            </RowComponent>
                        ))}
                    </RowComponent>
                )}
            </ColumnComponent>

            {errorMessage && (
                <TextComponent
                    type="caption"
                    color="error"
                    text={errorMessage}
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
                    keyExtractor={item => item.value}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <ColumnComponent
                            gap={8}
                            style={{
                                paddingBottom: 8,
                                backgroundColor: colors.background,
                            }}
                        >
                            {selectedItems.length > 0 && (
                                <RowComponent wrap gap={6}>
                                    {selectedItems.map(item => (
                                        <RowComponent
                                            key={item.value}
                                            alignItems="center"
                                            style={{
                                                paddingVertical: 4,
                                                paddingHorizontal: 8,
                                                backgroundColor: colors.card,
                                                borderRadius: 16,
                                            }}
                                        >
                                            <TextComponent
                                                text={item.label}
                                                numberOfLines={1}
                                                style={{ maxWidth: 120 }}
                                            />
                                            <ButtonComponent
                                                isIconOnly
                                                iconProps={{
                                                    name: 'X',
                                                    size: 12,
                                                    color: colors.primary,
                                                }}
                                                onPress={() => toggleItem(item.value)}
                                                style={{ marginLeft: 4 }}
                                            />
                                        </RowComponent>
                                    ))}
                                </RowComponent>
                            )}

                            {setSearchValue && (
                                <TextInputComponent
                                    value={searchValue}
                                    onChangeText={setSearchValue}
                                    placeholder={searchPlaceholder}
                                />
                            )}
                        </ColumnComponent>
                    }
                    stickyHeaderIndices={[0]}
                    renderItem={({ item }: { item: { label: string, value: string } }) => {
                        const checked = selected.includes(item.value)

                        return (
                            <RowComponent
                                alignItems="center"
                                onPress={() => toggleItem(item.value)}
                                style={{
                                    borderRadius: 8,
                                    paddingVertical: 12,
                                    paddingHorizontal: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.card,
                                    backgroundColor: checked
                                        ? colors.primaryContainer
                                        : 'transparent',
                                }}
                            >
                                <Checkbox
                                    checked={checked}
                                    setChecked={() => toggleItem(item.value)}
                                    style={{ marginRight: 10 }}
                                />

                                <TextComponent
                                    text={item.label}
                                    color={checked ? 'primary' : 'onBackground'}
                                    style={{ fontWeight: checked ? '600' : '400' }}
                                />
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
