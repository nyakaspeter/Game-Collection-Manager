import { Sx } from "@mantine/core";

export const createTableStyles = (columnWidths: string[]): Sx => ({
  flex: 1,
  table: {
    tableLayout: "fixed",
    width: "100% !important",
    thead: { zIndex: 1 },
    "tr:hover button": { visibility: "visible" },
    "td>:nth-of-type(1),th>:nth-of-type(1)": { width: "100% !important" },
    ...Object.fromEntries(
      columnWidths.map((_width, index) => [
        `tr>:nth-of-type(${index + 1})`,
        { width: "100% !important" },
      ])
    ),
    "@media (min-width: 1000px)": {
      ...Object.fromEntries(
        columnWidths.map((width, index) => [
          `tr>:nth-of-type(${index + 1})`,
          { width: `${width} !important` },
        ])
      ),
    },
  },
  ".mantine-DataGrid-scrollArea": { flex: 1 },
  ".mantine-ScrollArea-scrollbar": { zIndex: 2 },
});
