import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Table from "../navigation/table";

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

  const [lunchStartTime, setLunchStartTime] = useState("12:30");
  const [lecturesBeforeLunch, setLecturesBeforeLunch] = useState("3");
  const [lectureStartTimes, setLectureStartTimes] = useState([]);
  const [lunchEndTimes, setLunchEndTimes] = useState([]);
  const [lecturesAfterLunch, setLecturesAfterLunch] = useState("3");

  const setPossibleStartTimes = () => {
    const arr = [];

    const splitTime = lunchStartTime.split(":");
    const splitTimeHr = parseInt(splitTime[0]);
    const splitTimeMin = parseInt(splitTime[1]);

    let maxSplitStartTime = splitTimeHr - parseInt(lecturesBeforeLunch);

    if (maxSplitStartTime <= 0) {
      maxSplitStartTime += 12;
    }

    let tempTimeHr = 8;
    let tempTimeMin = 0;

    while (tempTimeHr <= maxSplitStartTime) {
      arr.push(`${tempTimeHr}:${tempTimeMin < 10 ? "0" + tempTimeMin : tempTimeMin} AM`);
      tempTimeMin += 15;

      if (tempTimeMin == 60) {
        tempTimeHr += 1;
        tempTimeMin = 0;
      }

      if (tempTimeHr == maxSplitStartTime && tempTimeMin > splitTimeMin) {
        break;
      }
    }

    setLectureStartTimes(arr);
  }

  const setPossibleLunchEndTimes = () => {
    const arr = [];

    const splitTime = lunchStartTime.split(":");
    const splitTimeHr = parseInt(splitTime[0]);
    const splitTimeMin = parseInt(splitTime[1]);

    let tempTimeHr = splitTimeHr + 1;
    let tempTimeMin = splitTimeMin;

    if (tempTimeHr > 12) {
      tempTimeHr -= 12;
    }

    for (let i = 0; i < 3; i++) {
      arr.push(`${tempTimeHr}:${tempTimeMin < 10 ? "0" + tempTimeMin : tempTimeMin} PM`);
      tempTimeMin += 15;
      if (tempTimeMin == 60) {
        tempTimeHr += 1;
        tempTimeMin = 0;
      }
    }

    setLunchEndTimes(arr);
  }

  useEffect(() => {
    setPossibleStartTimes();
  }, [lecturesBeforeLunch]);

  useEffect(() => {
    setPossibleStartTimes();
    setPossibleLunchEndTimes();
  }, [lunchStartTime]);

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

      // console.log(hrs, min);
      let newtem = int + parseInt(allcol[index][idx].duration);

      // console.log(newtem);

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
        setInfo("Added");
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

  // console.log(allcol);

  let exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(20);

    const title = "Time Table";
    doc.text(title, 250, 30);
    doc.setFontSize(10);

    allcol.map((col, index) => {
      let headers = [[...timecol[index]]];
      let data = allcol[index].map((elt) => elt.slot);
      let ori = index === 0 ? 50 : doc.lastAutoTable.finalY;
      console.log(data);
      headers[0].unshift("Day");
      data.unshift(days[index]);

      let content = {
        theme: "grid",
        startY: ori,
        head: headers,
        body: [data],
      };
      doc.autoTable(content);
      return 0;
    });
    doc.save("Time-Table.pdf");
  };

  console.log("timecol ", timecol);

  const [tbl, setTbl] = useState(null);
  const crtTable = () => {
    let ntbl = allcol.map((col, index) => {
      let data = [
        {
          col1: days[index],
        },
      ];

      let columns = [
        {
          Header: "Day",
          accessor: "col1", // accessor is the "key" in the data
        },
      ];

      for (let i = 0; i < allcol[index].length; i++) {
        let st = "col" + i + 2;
        data[0][st] = allcol[index][i]["slot"];
        let vl = {
          Header: timecol[index][i],
          accessor: st,
        };
        columns.push(vl);
      }

      return <Table data={data} columns={columns} />;
    });

    setTbl(ntbl);
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
        <br />

        <div className="pt-5 text-xl font-semibold">Select lunch start time</div>
        <select
          value={lunchStartTime}
          onChange={e => setLunchStartTime(e.target.value)}
          style={{ color: 'black' }} id="lunchStartTime" name="lunchStartTime">
          <option value="12:30">12:30 PM</option>
          <option value="12:45">12:45 PM</option>
          <option value="1:00">1:00 PM</option>
        </select>

        <div className="pt-5 text-xl font-semibold">Select number of lectures before lunch</div>
        <select style={{ color: 'black' }}
          value={lecturesBeforeLunch}
          onChange={e => setLecturesBeforeLunch(e.target.value)}
          id="lecturesBeforeLunch" name="lecturesBeforeLunch">
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <div className="pt-5 text-xl font-semibold">Select lecture start time</div>
        <select style={{ color: 'black' }} id="lectureStartTime" name="lecturesStartTime">
          {lectureStartTimes.map(time => (
            <option value={time}>{time}</option>
          ))}
        </select>

        <div className="pt-5 text-xl font-semibold">Select lunch end time</div>
        <select
          style={{ color: 'black' }} id="lunchEndTime" name="lunchEndTime">
          {lunchEndTimes.map(time => (
            <option value={time}>{time}</option>
          ))}
        </select>

        <div className="pt-5 text-xl font-semibold">Select number of lectures after lunch</div>
        <select style={{ color: 'black' }}
          value={lecturesAfterLunch}
          onChange={e => setLecturesAfterLunch(e.target.value)}
          id="lecturesAfterLunch" name="lecturesAfterLunch">
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      <h5 className="text-red-500 text-center font-bold">{hinfo}</h5>
      {allcolval}
      <div className="w-1/3 mx-auto align-center my-3">
        <button
          onClick={crtTable}
          className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Create Table
        </button>
      </div>
      <div className="flex flex-col">{tbl}</div>
      <div className="w-1/3 mx-auto align-center my-3">
        <button
          onClick={exportPDF}
          className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Print Time Table
        </button>
      </div>
    </div>
  );
}

export default Home;
