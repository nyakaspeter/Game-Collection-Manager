import { MultiSelect } from "@mantine/core";
import { DataGridFilterFn } from "mantine-data-grid";
import genres from "../../data/genres.json";
import { GameListItem } from "../../store/games";

const data = genres.map((genre) => ({
  value: genre.id.toString(),
  label: genre.short || genre.name,
}));

data.sort((a, b) => (a.label < b.label ? -1 : 1));

export const genreFilter: DataGridFilterFn<GameListItem, string[]> = (
  row,
  _columnId,
  filter: number[]
) => !!filter.find((id) => row.original.genres?.includes(id));

genreFilter.element = ({ filter, onFilterChange }) => (
  <MultiSelect
    clearable
    clearSearchOnChange
    placeholder="Select genres"
    data={data}
    value={filter || []}
    onChange={onFilterChange}
  />
);

genreFilter.resolveFilterValue = (filter) =>
  filter.map((id: string) => parseInt(id));

genreFilter.autoRemove = (filter) => filter?.length === 0;

genreFilter.init = () => [];
