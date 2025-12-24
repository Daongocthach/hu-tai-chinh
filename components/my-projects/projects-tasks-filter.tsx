import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import SingleListSelector from '@/components/common/single-list-selector'

import {
    ProjectsTasksFilterValues,
    TASK_STATUS_MAP
} from '@/lib'

import { useMyProjects } from '@/hooks'

type ProjectsTasksFilterProps = {
    control: Control<ProjectsTasksFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function ProjectsTasksFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: ProjectsTasksFilterProps) {
    const {
        projectOptions,
        hasNextPage: hasNextPageProjects,
        fetchNextPage: fetchNextPageProjects,
        isFetchingNextPage: isFetchingNextPageProjects,
        isLoading: isLoadingProjects,
        isError: isErrorProjects,
        searchProjectName,
        setSearchProjectName,
    } = useMyProjects()

    return (
        <ColumnComponent gap={10}>
            <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="status"
                        value={value}
                        setValue={onChange}
                        selectOptions={TASK_STATUS_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="project_id"
                render={({ field: { value, onChange } }) => (
                    <SingleListSelector
                        label="project"
                        selects={projectOptions}
                        selected={value}
                        setSelected={onChange}
                        searchValue={searchProjectName}
                        setSearchValue={setSearchProjectName}
                        placeholder='select a project'
                        isLoading={isLoadingProjects}
                        isFetchingNextPage={isFetchingNextPageProjects}
                        loadMore={fetchNextPageProjects}
                        hasMore={hasNextPageProjects}
                        isError={isErrorProjects}
                    />
                )}
            />
            <RowComponent justify="flex-end" gap={10}>
                <ButtonComponent
                    textProps={{ text: 'reset', color: 'onCardDisabled' }}
                    backgroundColor="cardDisabled"
                    onPress={onReset}
                />
                <ButtonComponent
                    textProps={{ text: 'apply' }}
                    onPress={handleSubmit(onApply)}
                />
            </RowComponent>
        </ColumnComponent>
    )
}
