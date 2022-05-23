import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Home() {
  const [rows, setRows] = useState(null);
  const [hinfo, setHinfo] = useState(null);
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [allcol, setAllcol] = useState([]);
  const [add, setAdd] = useState(false);

  const [int, setInt] = useState(null);
  let cap = {
    slot: null,
    duration: null,
  };

  const col = [cap];
  const [timecol, setTimecol] = useState([]);

  // console.log(timecol);

  const maxtem = 1050;

  let [info, setInfo] = useState(null);

  let prehandleclick = (event, index) => {
    let idx = allcol[index].length - 1;
    if (add) {
      if (
        allcol[index][idx].slot !== null &&
        allcol[index][idx].duration !== null
      ) {
        let newtem = int + parseInt(allcol[index][idx].duration);

        console.log(newtem);

        if (newtem < maxtem) {
          handleclick(event, index);
        } else {
          setInfo("Time Exceeded than 5:30 PM");
        }
      } else {
        setInfo("Please Enter Slot and Duration");
      }
    } else {
      setInfo("Before New, first click on Add");
    }
  };

  let preAddhandle = (event, index) => {
    console.log(int);
    let idx = allcol[index].length - 1;
    if (
      allcol[index][idx].slot !== null &&
      allcol[index][idx].duration !== null
    ) {
      let hrs = int / 60;
      let min = int % 60;
      if (min < 10) {
        min = "0" + min;
      } else {
        min += "";
      }
      hrs = Math.floor(hrs) + "";

      console.log(hrs, min);
      let newtem = int + parseInt(allcol[index][idx].duration);

      console.log(newtem);

      if (newtem < maxtem) {
        let newhrs = newtem / 60;
        let newmin = newtem % 60;
        if (newmin < 10) {
          newmin = "0" + newmin;
        } else {
          newmin += "";
        }
        newhrs = Math.floor(newhrs) + "";

        let time = hrs + ":" + min + " - " + newhrs + ":" + newmin;

        setTimecol((prev) => {
          return Object.values({
            ...prev,
            [index]: [...prev[index], time],
          });
        });
        setInt(newtem);
        setInfo(null);
        setAdd(true);
      } else {
        setInfo("Time Exceeded than 5:30 PM");
      }
    } else {
      setInfo("Please Enter Slot and Duration");
    }
  };

  function handleclick(event, index) {
    setInfo(null);
    setAdd(false);
    setAllcol((prev) => {
      return Object.values({
        ...prev,
        [index]: [...prev[index], cap],
      });
    });
  }

  // console.log("ALL col : ", allcol);
  // console.log(col);

  let colval = allcol.map((item, index) => {
    return allcol[index].map((item1, index1) => {
      return (
        <div
          id={index + "" + index1}
          className="bg-bck-3 my-3 w-5/6 mx-auto rounded text-center"
        >
          <div className=" flex justify-around custom-select">
            <h4 className="inline-block font-semibold my-5">Slots </h4>
            <select
              onChange={(event) => {
                setAllcol((prev) => {
                  console.log("ev : ", event);
                  return Object.values({
                    ...prev,
                    [index]: Object.values({
                      ...prev[index],
                      [index1]: {
                        ...prev[index][index1],
                        slot: event.target.value,
                      },
                    }),
                  });
                });
              }}
              className="placeholder-teal-400 border border-teal-500 rounded w-28 my-5 text-center outline-none text-blue-700"
            >
              <option selected="true" disabled="disabled" value="0">
                Slot Type
              </option>
              <option value="Breakfast">Breakfast</option>
              <option value="Class">Class</option>
              <option value="Lunch">Lunch</option>
              <option value="Lab">Lab</option>
            </select>
          </div>
          <div className=" flex justify-around">
            <h4 className="inline-block self-end font-semibold my-5">
              Duration{" "}
            </h4>
            <input
              type="number"
              name="duration"
              id={"durs" + index}
              onChange={(event) =>
                setAllcol((prev) => {
                  return Object.values({
                    ...prev,
                    [index]: Object.values({
                      ...prev[index],
                      [index1]: {
                        ...prev[index][index1],
                        duration: event.target.value,
                      },
                    }),
                  });
                })
              }
              value={allcol[index].duration}
              min="0"
              max="360"
              className="placeholder-teal-400 border border-teal-500 rounded w-28 my-5 text-center outline-none text-blue-700"
              required
            />
          </div>
        </div>
      );
    });
  });

  let allcolval = allcol.map((item, index) => {
    return (
      <div
        className="group mx-auto bg-bck-2 my-3 rounded py-4"
        id={index + "allcol"}
      >
        <h2 className="text-center text-lg font-bold">{days[index]}</h2>
        <div className="hidden group-hover:block ">
          <div className="bg-bck-3 my-3 w-5/6 mx-auto rounded text-center">
            <div className="flex justify-evenly w-full">
              <h5 className="inline-block font-semibold my-5">
                Enter the Start Time{" "}
              </h5>
              <input
                type="time"
                id="appt"
                name="appt"
                min="08:00"
                max="10:00"
                onChange={(event) => {
                  let tem = event.target.value;
                  let tot =
                    60 * parseInt(tem.slice(0, 2)) + parseInt(tem.slice(3));
                  setInt(tot);
                }}
                value={int}
                className="inline-block placeholder-teal-400 border border-teal-500 rounded  my-5 text-center outline-none text-blue-700"
                required
              />
              {/* {int} */}
            </div>
          </div>
          <div>
            {/* <h3>Enter the slots and duration.</h3> */}
            {colval[index]}
            <h5 className="text-red-500 text-center font-bold">{info}</h5>
          </div>
          <div className="w-full flex">
            <button
              onClick={(event) => prehandleclick(event, index)}
              className="w-1/4 text-white bg-bck-3 hover:bg-bck-3 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 mx-auto"
            >
              New
            </button>
            <button
              onClick={(event) => preAddhandle(event, index)}
              className="w-1/4 text-white bg-bck-3 hover:bg-bck-3 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 mx-auto"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  });

  let exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(20);

    const title = "Time Table";
    doc.text(title, 250, 30);
    doc.setFontSize(10);

    allcol.map((col, index) => {
      let headers = [timecol[index]];
      let data = allcol[index].map((elt) => elt.slot);
      let ori = index === 0 ? 50 : doc.lastAutoTable.finalY + 50;
      console.log(data);

      let content = {
        theme: "grid",
        startY: ori,
        head: headers,
        body: [data],
      };
      doc.text(days[index], marginLeft, ori - 10);
      doc.autoTable(content);
      return 0;
    });
    doc.save("Time-Table.pdf");
  };

  return (
    <div className="mx-auto my-5 w-1/2">
      <div className="bg-bck-3 text-center rounded ">
        <div className="pt-5 text-xl font-semibold">
          Enter the Total number of working days in a Week
        </div>
        <input
          type="number"
          name="rows"
          id="rows"
          onChange={(event) => {
            if (event.target.value > 6 || event.target.value < 0) {
              setHinfo("Enter value from 1 to 6");
            } else {
              setHinfo(null);
              setRows(event.target.value);
              setAllcol([]);
              for (let i = 0; i < event.target.value; i++) {
                setAllcol((prev) => [...prev, col]);
                setTimecol((prev) => [...prev, []]);
              }
            }
          }}
          value={rows}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded w-28 my-5 text-center outline-none text-blue-700"
          required
        />
        {/* {rows} */}
      </div>
      <h5 className="text-red-500 text-center font-bold">{hinfo}</h5>
      {allcolval}
      <div className="w-1/3 mx-auto align-center my-3">
        <button
          onClick={exportPDF}
          className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Generate Time Table
        </button>
      </div>
    </div>
  );
}

export default Home;
