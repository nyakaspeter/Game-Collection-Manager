import { MultiSelect } from "@mantine/core";
import { DataGridFilterFn } from "mantine-data-grid";
import { store } from "../../store";
import { Collection } from "../../store/collections";

export const collectionFilter = () => {
  const data = store.collections.map((collection) => ({
    value: collection.id,
    label: collection.name,
  }));

  const filter: DataGridFilterFn<{ collections: Collection[] }, string[]> = (
    row,
    _columnId,
    filter: string[]
  ) =>
    !!filter.find((id) =>
      row.original.collections?.find((collection) => collection.id === id)
    );

  filter.element = ({ filter, onFilterChange }) => (
    <MultiSelect
      clearable
      clearSearchOnChange
      placeholder="Select collections"
      data={data}
      value={filter || []}
      onChange={onFilterChange}
    />
  );

  filter.autoRemove = (filter) => filter?.length === 0;

  filter.init = () => [];

  return filter;
};
