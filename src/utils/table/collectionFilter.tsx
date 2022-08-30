import { MultiSelect } from "@mantine/core";
import { DataGridFilterFn } from "mantine-data-grid";
import { store } from "../../store";
import { Collection } from "../../store/collections";

const data = store.collections.map((collection) => ({
  value: collection.id,
  label: collection.name,
}));

export const collectionFilter: DataGridFilterFn<
  { collections: Collection[] },
  string[]
> = (row, _columnId, filter: string[]) =>
  !!filter.find((id) =>
    row.original.collections?.find((collection) => collection.id === id)
  );

collectionFilter.element = ({ filter, onFilterChange }) => (
  <MultiSelect
    clearable
    clearSearchOnChange
    placeholder="Select collections"
    data={data}
    value={filter || []}
    onChange={onFilterChange}
  />
);

collectionFilter.autoRemove = (filter) => filter?.length === 0;

collectionFilter.init = () => [];
