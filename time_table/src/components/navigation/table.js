import React, { useMemo } from "react";
import { useTable } from "react-table";

// Create a default prop getter
const defaultPropGetter = () => ({});

const Table = ({ columns, data, noDataComponent, getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter, ...rest }) => {
  const tableColumns = useMemo(() => columns, [columns]);
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    useTable({ columns: tableColumns, data });

  if (!rows.length) {
    if (noDataComponent) return noDataComponent;
    return null;
  }

  return (
    <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps([
                  {
                    className: column.className,
                    style: column.style
                  },
                  getColumnProps(column),
                  getHeaderProps(column)
                ])}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell)
                    ])}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
