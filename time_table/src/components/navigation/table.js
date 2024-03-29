import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";

const Table = ({
  columns,
  data,
  noDataComponent,
  clickEnabled,
  cellObj,
  setCellObj,
  selectedObj,
  setSelectedObj,
  handleSwap,
  section,
  setCurrSection,
  ...rest
}) => {
  const tableColumns = useMemo(() => columns, [columns]);
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    useTable({ columns: tableColumns, data });

  const [selectedRow, setSelectedRow] = useState(-1);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [selectedVal, setSelectedVal] = useState("Not Selected");

  const reinitailizeRowCol = () => {
    setSelectedRow(-1);
    setSelectedCol(-1);
    setSelectedVal("Not Selected");
  };

  const updateArrAndCells = (idx) => {
    reinitailizeRowCol();

    const newObj = {};
    newObj[selectedRow.id] = selectedCol;

    if (selectedObj.length < 2) {
      const newArr = [...selectedObj, newObj];
      setSelectedObj(newArr);
    } else {
      const newArr = [...selectedObj];
      newArr[idx] = newObj;
      setSelectedObj(newArr);
    }

    const newArr = [...cellObj];
    newArr[idx]["value"] = selectedVal;
    setCellObj(newArr);
  };

  const resetArr = (idx) => {
    if (selectedObj.length === 2) {
      const newObj = {};
      newObj[-1] = -1;
      const newArr = [...selectedObj];
      newArr[idx] = newObj;
      setSelectedObj(newArr);
    }
  };

  const resetCellObj = (idx, setValFlag) => {
    const newArr = [...cellObj];
    newArr[idx]["select"] = false;
    newArr[idx]["set"] = false;
    if (setValFlag === true) {
      newArr[idx]["value"] = "Not selected";
    }
    setCellObj(newArr);
  };

  useEffect(() => {
    if (clickEnabled === false) {
      reinitailizeRowCol();
      resetCellObj(0, true);
      resetCellObj(1, true);
      const newArr = [];
      setSelectedObj(newArr);
      setCurrSection(-1);
    }
    // eslint-disable-next-line
  }, [clickEnabled]);

  useEffect(() => {
    if (cellObj[0]["select"] === true) {
      resetArr(0);
      if (cellObj[0]["set"] === true) {
        updateArrAndCells(0);
        resetCellObj(0);
      }
    } else if (cellObj[1]["select"] === true) {
      resetArr(1);
      if (cellObj[1]["set"] === true) {
        updateArrAndCells(1);
        resetCellObj(1);
      }
    }
    // eslint-disable-next-line
  }, [cellObj]);

  const getCellValue = (e, j) => {
    if (cellObj[0]["select"] === true || cellObj[1]["select"] === true) {
      setCurrSection(section);
      setSelectedRow(e.row);
      setSelectedCol(j);
      setSelectedVal(e.value);
    }
  };

  if (!rows.length) {
    if (noDataComponent) return noDataComponent;
    return null;
  }

  return (
    <table {...getTableProps()} style={{ border: "solid 2px black" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  padding: "1px 5px 1px 5px",
                  // padding: "2px",
                  border: "solid 2px black",
                  background: "aliceblue",
                  color: "black",
                }}
                {...column.getHeaderProps()}
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
              {row.cells.map((cell, j) => {
                const exp1 =
                  (row.id === selectedRow.id && j === selectedCol) ||
                    selectedObj.filter(function (e) {
                      return e[row.id] === j;
                    }).length > 0
                    ? "#FEB2C3"
                    : "papayawhip";
                const exp2 = cell.value === "Break" ? "#73a2d9" : exp1;
                const exp3 = cell.value === "Lunch" ? "#60BA48" : exp2;
                const finalExpBg =
                  cell.column.Header === "Day" ? "#ED7D31" : exp3;

                const finalExpClr =
                  cell.value === "Break" ||
                    cell.value === "Lunch" ||
                    cell.column.Header === "Day"
                    ? "white"
                    : "black";

                return (
                  <td
                    onClick={() => getCellValue(cell, j)}
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      padding: "1px 5px 1px 5px",
                      // padding: "2px",
                      border: "solid 1px black",
                      background: finalExpBg,
                      color: finalExpClr,
                    }}
                    {...cell.getCellProps()}
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
