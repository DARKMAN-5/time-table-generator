import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Home() {
  const [rows, setRows] = useState(null);
  const [int, setInt] = useState(null);
  let cap = {
    slot: null,
    duration: null,
  };
  const [col, setCol] = useState([cap]);
  const [timecol, setTimecol] = useState([]);

  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // const stall = {
  //   people: [
  //     { name: "Keanu Reeves", profession: "Actor" },
  //     { name: "Lionel Messi", profession: "Football Player" },
  //     { name: "Cristiano Ronaldo", profession: "Football Player" },
  //     { name: null, profession: "Golf Player" },
  //   ],
  // };

  // let exportPDF = () => {
  //   const unit = "pt";
  //   const size = "A4"; // Use A1, A2, A3 or A4
  //   const orientation = "portrait"; // portrait or landscape

  //   const marginLeft = 40;
  //   const doc = new jsPDF(orientation, unit, size);

  //   doc.setFontSize(15);

  //   const title = "Time Table";
  //   const headers = [["NAME", "PROFESSION"]];

  //   const data = stall.people.map((elt) => [elt.name, elt.profession]);

  //   let content = {
  //     startY: 50,
  //     theme: "grid",
  //     head: headers,
  //     body: data,
  //   };

  //   doc.text(title, marginLeft, 40);
  //   // doc.autoTable(content);
  //   doc.autoTable({
  //     columnStyles: { europe: { halign: "center" } }, // European countries centered
  //     body: [
  //       { europe: "Sweden", america: "Canada", asia: "China" },
  //       { europe: "Norway", america: "Mexico", asia: "Japan" },
  //     ],
  //     columns: [
  //       { header: "Europe", dataKey: "europe" },
  //       { header: "Asia", dataKey: "asia" },
  //       { header: "America", dataKey: "america" },
  //     ],
  //   });
  //   doc.save("time-table.pdf");
  // };

  console.log(timecol);

  const maxtem = 1050;

  let [info, setInfo] = useState(null);
  let prehandleclick = (event) => {
    console.log(int);
    let idx = col.length - 1;
    if (col[idx].slot !== null && col[idx].duration !== null) {
      let hrs = int / 60;
      let min = int % 60;
      if (min < 10) {
        min = "0" + min;
      } else {
        min += "";
      }
      hrs = Math.floor(hrs) + "";

      console.log(hrs, min);
      let newtem = int + parseInt(col[idx].duration);

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

        setTimecol((prev) => [...prev, time]);
        setInt(newtem);
        handleclick(event);
      } else {
        setInfo("Time limit Exceeded.");
      }
    } else {
      setInfo("Fisrt Enter Slot and Duration");
    }
  };

  function handleclick(event) {
    setInfo(null);
    setCol((prev) => [...prev, cap]);
  }

  console.log(col);

  let colval = col.map((item, index) => {
    return (
      <div id={index}>
        <div class="custom-select">
          <select
            onChange={(event) => {
              setCol((prev) => {
                console.log("prev", prev);
                return Object.values({
                  ...prev,
                  [index]: {
                    ...prev[index],
                    slot: event.target.value,
                  },
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
            setCol((prev) => {
              return Object.values({
                ...prev,
                [index]: {
                  ...prev[index],
                  duration: event.target.value,
                },
              });
            })
          }
          value={col[index].duration}
          min="0"
          max="360"
          required
        />
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
          onChange={(event) => setRows(event.target.value)}
          value={rows}
          min="1"
          max="7"
          required
        />
        {rows}
      </div>
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
            let tot = 60 * parseInt(tem.slice(0, 2)) + parseInt(tem.slice(3));
            setInt(tot);
          }}
          required
        />
        {int}
      </div>
      <div>
        <div>Enter the total no. of working days in Week.</div>
        {colval}
        {info}
        <button onClick={prehandleclick}>New</button>
        <button onClick="">Add</button>
        <div>{/* <button onClick={exportPDF}>Generate Report</button> */}</div>
      </div>
    </div>
  );
}

export default Home;
