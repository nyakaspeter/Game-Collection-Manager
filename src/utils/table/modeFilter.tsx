import { MultiSelect } from "@mantine/core";
import { DataGridFilterFn } from "mantine-data-grid";
import { Game } from "../../store/games";
import modes from "../../data/game_modes.json";

const data = modes.map((mode) => ({
  value: mode.id.toString(),
  label: mode.short || mode.name,
}));

export const modeFilter: DataGridFilterFn<Game, string[]> = (
  row,
  _columnId,
  filter: number[]
) => !!filter.find((id) => row.original.gameModes?.includes(id));

modeFilter.element = ({ filter, onFilterChange }) => (
  <MultiSelect
    clearable
    clearSearchOnChange
    placeholder="Select game modes"
    data={data}
    value={filter || []}
    onChange={onFilterChange}
  />
);

modeFilter.resolveFilterValue = (filter) =>
  filter.map((id: string) => parseInt(id));

modeFilter.autoRemove = (filter) => filter?.length === 0;

modeFilter.init = () => [];
