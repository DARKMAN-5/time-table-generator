import React, { useMemo } from "react";
import { useTable } from "react-table";

const Table = ({ columns, data, noDataComponent, ...rest }) => {
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
                {...column.getHeaderProps()}
                style={{
                  border: "solid 1px grey",
                  background: "aliceblue",
                  color: "black",
                  fontWeight: "bold",
                }}
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
                    {...cell.getCellProps()}
                    style={{
                      padding: "10px",
                      border: "solid 1px gray",
                      background: "papayawhip",
                      color: "blue",
                    }}
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
