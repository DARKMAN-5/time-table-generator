import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Table from "../navigation/table";

function Home() {
  const [rows, setRows] = useState(null);
  const [hinfo, setHinfo] = useState(null);
  const [sbutt, setSbutt] = useState(false);
  const [timecol, setTimecol] = useState(null);
  const [sttime, setSttime] = useState("8:00");
  const [lsttime, setLsttime] = useState(null);
  const [coursecode, setCourseCode] = useState("");
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  console.log(coursecode);
  const [allcol, setAllcol] = useState([]);

  const [lunchStartTime, setLunchStartTime] = useState("12:30");
  const [lecturesBeforeLunch, setLecturesBeforeLunch] = useState("3");
  const [lectureStartTimes, setLectureStartTimes] = useState([]);
  const [lunchEndTimes, setLunchEndTimes] = useState([]);
  const [lecturesAfterLunch, setLecturesAfterLunch] = useState("3");
  const [noOfLecs, setnoOfLecs] = useState(0);
  const [lecstime, setlecstime] = useState(0);
  const [tutstime, settutstime] = useState(0);
  const [labtime, setlabtime] = useState(0);
  const [priority, setpriority] = useState("");
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
      arr.push(
        `${tempTimeHr}:${tempTimeMin < 10 ? "0" + tempTimeMin : tempTimeMin} AM`
      );
      tempTimeMin += 15;

      if (tempTimeMin === 60) {
        tempTimeHr += 1;
        tempTimeMin = 0;
      }

      if (tempTimeHr === maxSplitStartTime && tempTimeMin > splitTimeMin) {
        break;
      }
    }

    setLectureStartTimes(arr);
  };

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
      arr.push(
        `${tempTimeHr}:${tempTimeMin < 10 ? "0" + tempTimeMin : tempTimeMin} PM`
      );
      tempTimeMin += 15;
      if (tempTimeMin === 60) {
        tempTimeHr += 1;
        tempTimeMin = 0;
      }
    }

    setLunchEndTimes(arr);
    setLsttime(arr[0].slice(0, -3));
  };

  useEffect(() => {
    setPossibleStartTimes();
  }, [lecturesBeforeLunch]);

  useEffect(() => {
    setPossibleStartTimes();
    setPossibleLunchEndTimes();
  }, [lunchStartTime]);

  // console.log(timecol);

  // const maxtem = 1050;

  let [info, setInfo] = useState(null);

  console.log(allcol);
  let submitCourseData = (event) => {};
  let colval = allcol.map((item, index) => {
    return allcol[index].map((item1, index1) => {
      if (allcol[index][index1] !== "Lunch") {
        return (
          <div
            id={index + "" + index1}
            className="bg-bck-3 my-3 w-5/6 mx-auto rounded text-center"
          >
            <div className=" flex justify-around custom-select">
              <h4 className="inline-block font-semibold my-5">
                Slots [{timecol[index1]}]{" "}
              </h4>
              <select
                onChange={(event) => {
                  setAllcol((prev) => {
                    console.log("ev : ", event);
                    return Object.values({
                      ...prev,
                      [index]: Object.values({
                        ...prev[index],
                        [index1]: event.target.value,
                      }),
                    });
                  });
                }}
                className="placeholder-teal-400 border border-teal-500 rounded w-28 my-5 text-center outline-none text-blue-700"
              >
                <option selected="true" disabled="disabled" value="0">
                  Slot Type
                </option>
                <option value="Class">Class</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
          </div>
        );
      }

      return null;
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
          <div>
            {colval[index]}
            <h5 className="text-red-500 text-center font-bold">{info}</h5>
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

    let headers;
    let data = [];
    let ori = 50;
    headers = [...timecol];
    headers.unshift("Day");
    console.log("headers: ", headers);
    allcol.map((col, index) => {
      data.push([]);
      data[index] = allcol[index].map((elt) => elt);
      data[index].unshift(days[index]);
      return 0;
    });

    console.log("DATA: ", data);
    let content = {
      theme: "grid",
      startY: ori,
      head: [headers],
      body: data,
    };
    doc.autoTable(content);
    doc.save("Time-Table.pdf");
  };

  console.log("timecol ", timecol);

  const [tbl, setTbl] = useState(null);
  const crtTable = () => {
    let data = [];

    let columns = [
      {
        Header: "Day",
        accessor: "col1", // accessor is the "key" in the data
      },
    ];

    for (let i = 0; i < timecol.length; i++) {
      let st = "col" + i + 2;
      let vl = {
        Header: timecol[i],
        accessor: st,
      };
      columns.push(vl);
    }

    allcol.map((col, index) => {
      let ml = {
        col1: days[index],
      };

      data.push(ml);
      for (let i = 0; i < allcol[index].length; i++) {
        let st = "col" + i + 2;
        data[index][st] = allcol[index][i];
      }

      return null;
    });

    console.log("data: ", data);
    console.log("columns", columns);

    let ntbl = <Table data={data} columns={columns} />;
    setTbl(ntbl);
  };

  console.log(sttime, lsttime);

  function handleclick() {
    setInfo(null);

    let ls = [];
    let cls = [];

    let tst = sttime;
    for (let i = 0; i < lecturesBeforeLunch; i++) {
      ls.push(null);
      const splitTime = tst.split(":");
      let splitTimeHr = parseInt(splitTime[0]);
      const splitTimeMin = parseInt(splitTime[1]);

      splitTimeHr = splitTimeHr + 1;
      let min = splitTimeMin < 10 ? "0" + splitTimeMin : splitTimeMin;
      let nst = tst + "-" + splitTimeHr + ":" + min;
      tst = splitTimeHr + ":" + min;
      cls.push(nst);
    }

    tst = lunchStartTime + "-" + lsttime;
    cls.push(tst);
    ls.push("Lunch");

    tst = lsttime;
    for (let i = 0; i < lecturesAfterLunch; i++) {
      ls.push(null);
      const splitTime = tst.split(":");
      let splitTimeHr = parseInt(splitTime[0]);
      let splitTimeMin = parseInt(splitTime[1]);

      splitTimeHr = splitTimeHr + 1;
      let min = splitTimeMin < 10 ? "0" + splitTimeMin : splitTimeMin;
      let nst = tst + "-" + splitTimeHr + ":" + min;
      tst = splitTimeHr + ":" + min;
      cls.push(nst);
    }

    setTimecol(cls);
    setAllcol([]);
    for (let i = 0; i < rows; i++) {
      setAllcol((prev) => [...prev, ls]);
    }

    setSbutt(true);
  }

  return (
    <div className="mx-auto my-5 w-1/2">
      <div className="bg-bck-3 text-center rounded my-3">
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
              setSbutt(false);
              setAllcol([]);
              setTbl(null);
            }
          }}
          value={rows}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded  my-3 text-center outline-none text-black"
          required
        />
        {/* {rows} */}
        {/* <br /> */}
      </div>

      <div className="bg-bck-3 text-center rounded my-3 py-2">
        <div className="pt-5 text-xl font-semibold">
          Select lunch start time
        </div>
        <select
          value={lunchStartTime}
          onChange={(e) => setLunchStartTime(e.target.value)}
          style={{ color: "black" }}
          id="lunchStartTime"
          name="lunchStartTime"
        >
          <option value="12:30">12:30 PM</option>
          <option value="12:45">12:45 PM</option>
          <option value="1:00">1:00 PM</option>
        </select>

        <div className="pt-5 text-xl font-semibold">
          Select number of lectures before lunch
        </div>
        <select
          style={{ color: "black" }}
          value={lecturesBeforeLunch}
          onChange={(e) => setLecturesBeforeLunch(e.target.value)}
          id="lecturesBeforeLunch"
          name="lecturesBeforeLunch"
        >
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <div className="pt-5 text-xl font-semibold">
          Select lecture start time
        </div>
        <select
          style={{ color: "black" }}
          id="lectureStartTime"
          name="lecturesStartTime"
          onChange={(event) => {
            let tem = event.target.value;
            let st = tem.slice(0, -3);
            setSttime(st);
          }}
        >
          {lectureStartTimes.map((time) => (
            <option value={time}>{time}</option>
          ))}
        </select>

        <div className="pt-5 text-xl font-semibold">Select lunch end time</div>
        <select
          style={{ color: "black" }}
          id="lunchEndTime"
          name="lunchEndTime"
          onChange={(event) => {
            let tem = event.target.value;
            let st = tem.slice(0, -3);
            // let tot = 60 * parseInt(tem.slice(0, 2)) + parseInt(tem.slice(3));
            setLsttime(st);
          }}
        >
          {lunchEndTimes.map((time) => (
            <option value={time}>{time}</option>
          ))}
        </select>

        <div className="pt-5 text-xl font-semibold">
          Select number of lectures after lunch
        </div>
        <select
          style={{ color: "black" }}
          value={lecturesAfterLunch}
          onChange={(e) => {
            setLecturesAfterLunch(e.target.value);
          }}
          id="lecturesAfterLunch"
          name="lecturesAfterLunch"
        >
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div className="bg-bck-3 text-center rounded my-3 py-2">
        <div className="pt-5 text-xl font-semibold">Course Code</div>
        <input
          type="text"
          name="course_code"
          id="course_code"
          onChange={(event) => {
            setCourseCode(event.target.value);
          }}
          value={coursecode}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded  my-3 text-center outline-none text-black"
          required
        />
        <div className="pt-5 text-xl font-semibold">Number of Lectures</div>
        <input
          type="text"
          name="noOfLecs"
          id="noOfLecs"
          onChange={(event) => {
            setnoOfLecs(event.target.value);
          }}
          value={noOfLecs}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded  my-3 text-center outline-none text-black"
          required
        />
        <div className="pt-5 text-xl font-semibold">Lecture Time(hrs/week)</div>
        <input
          type="text"
          name="lecstime"
          id="lecstime"
          onChange={(event) => {
            setlecstime(event.target.value);
          }}
          value={lecstime}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded  my-3 text-center outline-none text-black"
          required
        />
        <div className="pt-5 text-xl font-semibold">
          Tutorial Time(hrs/week)
        </div>
        <input
          type="text"
          name="tutstime"
          id="tutstime"
          onChange={(event) => {
            settutstime(event.target.value);
          }}
          value={tutstime}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded  my-3 text-center outline-none text-black"
          required
        />
        <div className="pt-5 text-xl font-semibold">
          Laboratory Time(hrs/week)
        </div>
        <input
          type="text"
          name="labtime"
          id="labtime"
          onChange={(event) => {
            setlabtime(event.target.value);
          }}
          value={labtime}
          min={1}
          max={7}
          className="placeholder-teal-400 border border-teal-500 rounded  my-3 text-center outline-none text-black"
          required
        />
        <div className="pt-5 text-xl font-semibold">Priority</div>
        <select
          style={{ color: "black" }}
          value={priority}
          onChange={(e) => setpriority(e.target.value)}
          id="priority"
          name="priority"
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
        </select>
        <div className="w-1/3 mx-auto align-center my-3">
          <button
            onClick={submitCourseData}
            className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </div>
      </div>

      <h5 className="text-red-500 text-center font-bold">{hinfo}</h5>
      <div className="w-1/3 mx-auto align-center my-3">
        <button
          onClick={handleclick}
          className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Add
        </button>
      </div>
      {allcolval}
      <div className={sbutt ? "w-1/3 mx-auto align-center my-3" : "hidden"}>
        <button
          onClick={crtTable}
          className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Create Table
        </button>
      </div>
      <div className="flex flex-col">{tbl}</div>
      <div className={sbutt ? "w-1/3 mx-auto align-center my-3" : "hidden"}>
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
