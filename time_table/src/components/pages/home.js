import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Home() {
  const [rows, setRows] = useState(null);

  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [allcol, setAllcol] = useState([]);

  const [int, setInt] = useState(null);
  let cap = {
    slot: null,
    duration: null,
  };

  const col = [cap];
  const [timecol, setTimecol] = useState([]);

  console.log(timecol);

  const maxtem = 1050;

  let [info, setInfo] = useState(null);

  let prehandleclick = (event, index) => {
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
        handleclick(event, index);
      } else {
        setInfo("Time limit Exceeded.");
      }
    } else {
      setInfo("Fisrt Enter Slot and Duration");
    }
  };

  function handleclick(event, index) {
    setInfo(null);
    setAllcol((prev) => {
      return Object.values({
        ...prev,
        [index]: [...prev[index], cap],
      });
    });
  }

  console.log("ALL col : ", allcol);
  console.log(col);

  let colval = allcol.map((item, index) => {
    return allcol[index].map((item1, index1) => {
      return (
        <div id={index + "" + index1}>
          <div class="custom-select">
            <h4>Slots: </h4>
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
          <div>Duration</div>
          <input
            type="number"
            name="cols"
            id={"cols" + index}
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
            required
          />
        </div>
      );
    });
  });

  let allcolval = allcol.map((item, index) => {
    return (
      <div className="group" id={index + "allcol"}>
        <h2>{days[index]}</h2>
        <div className="hidden group-hover:block">
          <div>
            <h5>Enter the start time for time table.</h5>
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
              required
            />
            {int}
          </div>
          <div>
            <div>Enter the slots and duration.</div>
            {colval[index]}
            {info}
            <button onClick={(event) => prehandleclick(event, index)}>
              New
            </button>
            <button onClick="">Add</button>
            <div>
              {/* <button onClick={exportPDF}>Generate Report</button> */}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div>
        <div>Enter the total no. of working days in Week.</div>
        <input
          type="number"
          name="rows"
          id="rows"
          onChange={(event) => {
            setRows(event.target.value);
            setAllcol([]);
            for (let i = 0; i < event.target.value; i++) {
              setAllcol((prev) => [...prev, col]);
              setTimecol((prev) => [...prev, []]);
            }
          }}
          value={rows}
          min="1"
          max="7"
          required
        />
        {rows}
      </div>
      {allcolval}
    </div>
  );
}

export default Home;
