import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
import "jspdf-autotable";
import Table from "../navigation/table";
// import html2canvas from "html2canvas";

function Home() {
  let ccallcol = [];
  const [rows, setRows] = useState(5);
  const [timecol, setTimecol] = useState(null);
  const [sttime, setSttime] = useState("8:00");
  const [lsttime, setLsttime] = useState(null);
  const [lead, setLead] = useState(0);
  const [oallp, setOallp] = useState(null);
  const [sectn, setSectn] = useState(1);
  const [batch, setBatch] = useState(1);
  const [clickEnabled, setClickEnabled] = useState(false);
  const [selectedObj1, setSelectedObj1] = useState([]);
  const [selectedObj2, setSelectedObj2] = useState([]);
  const [currSection, setCurrSection] = useState(-1);
  const [prnt1, setPrnt1] = useState(0);
  const [prnt2, setPrnt2] = useState(0);

  const tempArr = [];

  for (let i = 0; i < 2; i++) {
    let obj = { select: false, set: false, value: "Not Selected" };
    tempArr.push(obj);
  }

  const [cellObj1, setCellObj1] = useState(tempArr);
  const [cellObj2, setCellObj2] = useState(tempArr);

  function courseInfo(courseCode, totalLectures, l, lPr, t, tPr, p, pPr) {
    this.courseCode = courseCode;
    this.totalLectures = totalLectures;
    this.l = l;
    this.lPr = lPr;
    this.t = t;
    this.tPr = tPr;
    this.p = p;
    this.pPr = pPr;
  }

  const tempCourseInputs = [];

  for (let i = 0; i < 9; i++) {
    let course = new courseInfo("", 0, 0, "", 0, "", 0, "");
    tempCourseInputs.push(course);
  }

  const [courseInputs, setCourseInputs] = useState(tempCourseInputs);

  const addCourseInputs = (e) => {
    let course = new courseInfo("", 0, 0, "", 0, "", 0, "");
    const updatedCourseInputs = [...courseInputs, course];
    setCourseInputs(updatedCourseInputs);
  };

  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [allcol, setAllcol] = useState([]);
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
    // eslint-disable-next-line
  }, [lecturesBeforeLunch]);

  useEffect(() => {
    setPossibleStartTimes();
    // eslint-disable-next-line

    setPossibleLunchEndTimes();
    // eslint-disable-next-line
  }, [lunchStartTime]);

  useEffect(() => {
    crtTable();
    // eslint-disable-next-line
  }, [lead]);

  const btnBgClr = !clickEnabled ? "#BFD4FB" : "";

  // console.log(allcol);
  const [tblData, setTblData] = useState([]);
  const [newtblData, setNewtblData] = useState([]);
  const [tblCols, setTblCols] = useState([]);

  const rotateArray2 = (nums, k, n) => {
    // reverse helper function
    console.log("bnd", nums);
    for (let i = 0; i < n * k; i++) {
      nums.unshift(nums.pop());
    }
    let j = 0;
    for (let i = 0; i < nums.length; i += n) {
      nums[i]["col1"] = days[j];
      j++;
    }
    console.log("and", nums);
    return nums;
  };

  let exportPDF = () => {
    // option:1
    window.print();
    // ************************************************************************************
    // option:2
    // var prtContent = document.getElementById("tableId");
    // var WinPrint = window.open("", "", "status=0");
    // WinPrint.document.write(prtContent.innerHTML);
    // WinPrint.document.close();
    // // WinPrint.focus();
    // WinPrint.print();
    // // WinPrint.close();
    // ***************************************************************************************
    // option:3
    // const unit = "pt";
    // const size = "A4"; // Use A1, A2, A3 or A4
    // const orientation = "landscape"; // portrait or landscape
    // const doc = new jsPDF(orientation, unit, size);
    // let prtContent = document.getElementById("tableId");
    // console.log(prtContent);
    // doc.html(prtContent.innerHTML, {
    //   margin: [10, 20, 10, 20],
    //   callback: function (doc) {
    //     doc.save();
    //   },
    // });
    // ************************************************************************************
    // option:4
    // const unit = "pt";
    // const size = "A4"; // Use A1, A2, A3 or A4
    // const orientation = "landscape"; // portrait or landscape
    // const input = document.getElementById("tableId");
    // html2canvas(input).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF(orientation, unit, size);
    //   let wt = pdf.internal.pageSize.getWidth() - 100;
    //   let ht = pdf.internal.pageSize.getHeight() - 300;
    //   pdf.addImage(imgData, "JPEG", 0, 0, wt, ht);
    //   // pdf.output('dataurlnewwindow');
    //   pdf.save("time_table.pdf");
    // });
    // ***********************************************************************
  };

  function crtTable() {
    if (allcol.length === 0) {
      return null;
    }

    let data = [];

    let columns = [
      {
        Header: "Day",
        accessor: "col1", // accessor is the "key" in the data
      },
    ];

    for (let i = 0; i < timecol.length; i++) {
      let st = "col" + (i + 2);
      let vl = {
        Header: timecol[i],
        accessor: st,
      };
      columns.push(vl);
    }

    allcol.map((col, index) => {
      if (batch === 1) {
        let ml = {
          col1: days[index],
        };

        data.push(ml);
      } else if (batch === 2 && index % 2 === 0) {
        let ml = {
          col1: days[index / 2],
        };

        data.push(ml);
      } else {
        let ml = {
          col1: null,
        };

        data.push(ml);
      }

      for (let i = 0; i < allcol[index].length; i++) {
        let st = "col" + (i + 2);
        data[index][st] = allcol[index][i];
      }

      return null;
    });

    let newdata = JSON.parse(JSON.stringify(data));
    if (batch === 2) {
      newdata = rotateArray2(newdata, 2, 2);

      for (let i = 0; i < newdata.length; i++) {
        for (let j = 0; j < Object.keys(newdata[i]).length - 1; j++) {
          // console.log("val", newdata[i]["col" + (j + 2)]);
          if (
            newdata[i]["col" + (j + 2)] !== null &&
            newdata[i]["col" + (j + 2)].charAt(0) === "A"
          ) {
            newdata[i]["col" + (j + 2)] =
              "B" + newdata[i]["col" + (j + 2)].substring(1);
          }
        }
      }
    } else {
      newdata = rotateArray2(newdata, 2, 1);
    }
    setTblData(data);
    setNewtblData(newdata);
    setTblCols(columns);
  }

  const enableClick = () => {
    setClickEnabled(!clickEnabled);
  };

  const swap = (row1, col1, row2, col2) => {
    if (currSection === 1) {
      let newAllCol = [...tblData];
      let temp = newAllCol[row1][`col${col1}`];
      newAllCol[row1][`col${col1}`] = newAllCol[row2][`col${col2}`];
      newAllCol[row2][`col${col2}`] = temp;
      setTblData(newAllCol);
    } else if (currSection === 2) {
      let newAllCol = [...newtblData];
      let temp = newAllCol[row1][`col${col1}`];
      newAllCol[row1][`col${col1}`] = newAllCol[row2][`col${col2}`];
      newAllCol[row2][`col${col2}`] = temp;
      setNewtblData(newAllCol);
    }
  };

  const handleSwapHelper = (obj) => {
    if (obj.length === 2) {
      const row1 = Object.keys(obj[0])[0];
      const col1 = obj[0][row1];

      const row2 = Object.keys(obj[1])[0];
      const col2 = obj[1][row2];

      console.log(row1, col1, row2, col2);

      if (row1 >= 0 && row2 >= 0) {
        swap(row1, col1 + 1, row2, col2 + 1);
      }
    }
  };

  const resetTable = () => {
    const newObj = {};
    newObj[-1] = -1;
    const newArr = [...selectedObj1];
    newArr[0] = newObj;
    newArr[1] = newObj;
    const newCellObjArr = [...cellObj1];
    newCellObjArr[0]["value"] = "Not selected";
    newCellObjArr[1]["value"] = "Not selected";
    setSelectedObj1(newArr);
    setSelectedObj2(newArr);
    setCellObj1(newCellObjArr);
    setCellObj2(newCellObjArr);
  };

  const handleSwap = () => {
    if (currSection === 1) {
      handleSwapHelper(selectedObj1);
    } else if (currSection === 2) {
      handleSwapHelper(selectedObj2);
    }

    resetTable();
  };

  // console.log(sttime, lsttime);

  function handleclick() {
    let ls = [];
    let cls = [];
    let rem = 0;
    let tst;
    if (oallp === "mor") {
      tst = sttime;
      let mst = lunchStartTime;
      let splitTime1 = tst.split(":");
      let splitTime2 = mst.split(":");
      let splitTime1Hr = parseInt(splitTime1[0]) * 60;
      splitTime1Hr += parseInt(splitTime1[1]);

      let splitTime2Hr = parseInt(splitTime2[0]);

      if (splitTime2Hr >= 1 && splitTime2Hr <= 6) {
        splitTime2Hr = (splitTime2Hr + 12) * 60;
      } else {
        splitTime2Hr = splitTime2Hr * 60;
      }
      splitTime2Hr += parseInt(splitTime2[1]);
      rem = splitTime2Hr - splitTime1Hr;
      rem -= lecturesBeforeLunch * 60;
    }

    tst = sttime;
    for (let i = 0; i < lecturesBeforeLunch; i++) {
      let splitTime = tst.split(":");
      let splitTimeHr = parseInt(splitTime[0]);
      let splitTimeMin = parseInt(splitTime[1]);

      if (i === 2 && oallp === "mor" && rem !== 0) {
        let brk = 15;
        if (rem >= 60) {
          brk = 30;
          rem -= 30;
        } else {
          rem -= 15;
        }

        splitTimeMin = splitTimeMin + brk;
        if (splitTimeMin >= 60) {
          splitTimeMin = splitTimeMin % 60;
          splitTimeHr++;
        }

        let min = splitTimeMin < 10 ? "0" + splitTimeMin : splitTimeMin;
        let nst = tst + "-" + splitTimeHr + ":" + min;
        tst = splitTimeHr + ":" + min;
        cls.push(nst);
        ls.push("Break");
        splitTime = tst.split(":");
        splitTimeHr = parseInt(splitTime[0]);
        splitTimeMin = parseInt(splitTime[1]);
      }

      splitTimeHr = splitTimeHr + 1;
      if (splitTimeHr > 12) {
        splitTimeHr -= 12;
      }
      let min = splitTimeMin < 10 ? "0" + splitTimeMin : splitTimeMin;
      let nst = tst + "-" + splitTimeHr + ":" + min;
      tst = splitTimeHr + ":" + min;
      cls.push(nst);
      ls.push(null);
    }

    tst = tst + "-" + lsttime;
    cls.push(tst);
    ls.push("Lunch");

    tst = lsttime;
    for (let i = 0; i < lecturesAfterLunch; i++) {
      let splitTime = tst.split(":");
      let splitTimeHr = parseInt(splitTime[0]);
      let splitTimeMin = parseInt(splitTime[1]);

      if (i === 2 && oallp === "aft") {
        splitTimeMin = splitTimeMin + 15;
        if (splitTimeMin >= 60) {
          splitTimeMin = splitTimeMin % 60;
          splitTimeHr++;
        }
        let min = splitTimeMin < 10 ? "0" + splitTimeMin : splitTimeMin;
        let nst = tst + "-" + splitTimeHr + ":" + min;
        tst = splitTimeHr + ":" + min;
        cls.push(nst);
        ls.push("Break");
        splitTime = tst.split(":");
        splitTimeHr = parseInt(splitTime[0]);
        splitTimeMin = parseInt(splitTime[1]);
      }

      splitTimeHr = splitTimeHr + 1;
      let min = splitTimeMin < 10 ? "0" + splitTimeMin : splitTimeMin;
      let nst = tst + "-" + splitTimeHr + ":" + min;
      tst = splitTimeHr + ":" + min;
      cls.push(nst);
      ls.push(null);
    }
    console.log("LS", ls);
    console.log("CLS", cls);
    setTimecol(cls);
    setAllcol([]);

    if (oallp === "aft") {
      let pos = -1;
      for (let i = 0; i < ls.length; i++) {
        if (ls[i] === "Lunch") {
          pos = i;
          break;
        }
      }

      let nls = [];
      for (let i = pos + 1; i < ls.length; i++) {
        nls.push(ls[i]);
      }
      nls.push(ls[pos]);
      for (let i = 0; i < pos; i++) {
        nls.push(ls[i]);
      }

      ls = JSON.parse(JSON.stringify(nls));
    }

    if (
      (lecturesBeforeLunch === "4" && oallp === "mor") ||
      (lecturesAfterLunch === "4" && oallp === "aft")
    ) {
      const slots4bfl = [
        [1, 5, 6, 3, 7],
        [2, 1, 7, 4],
        [3, 2, 6, 5],
        [4, 3, 7, 1],
        [5, 4, 6, 2],
      ];
      for (let i = 0; i < rows; i++) {
        let nls = [...ls];
        // console.log("Before", nls);
        let j = 0;
        for (let k = 0; k < slots4bfl[i].length; k++) {
          while (nls[j] !== null) {
            j++;
          }
          nls[j] = slots4bfl[i][k];
          j++;
        }
        // console.log("After", nls);
        for (let j = 0; j < batch; j++) {
          ccallcol.push([...nls]);
          setAllcol((prev) => [...prev, ls]);
        }
      }
    } else {
      const slots4bfl = [
        [1, 5, 3, 6, 7],
        [2, 1, 4, 7],
        [3, 2, 5, 6],
        [4, 3, 1, 7],
        [5, 4, 2, 6],
      ];
      for (let i = 0; i < rows; i++) {
        let nls = [...ls];
        // console.log("Before", nls);
        let j = 0;
        for (let k = 0; k < slots4bfl[i].length; k++) {
          while (nls[j] !== null) {
            j++;
          }
          nls[j] = slots4bfl[i][k];
          j++;
        }
        // console.log("After", nls);
        for (let j = 0; j < batch; j++) {
          ccallcol.push([...nls]);
          setAllcol((prev) => [...prev, ls]);
        }
      }
    }

    setLead((prev) => prev + 1);
  }

  // console.log(ccallcol);
  // console.log(allcol);

  const handleCellObj = (e, idx1, idx2) => {
    if (currSection === 1) {
      const newArr = [...cellObj1];
      newArr[idx1][e.target.value] = true;
      newArr[idx2]["select"] = false;
      newArr[idx2]["set"] = false;
      setCellObj1(newArr);
    } else {
      const newArr = [...cellObj2];
      newArr[idx1][e.target.value] = true;
      newArr[idx2]["select"] = false;
      newArr[idx2]["set"] = false;
      setCellObj2(newArr);
    }
  };

  const updateTT = () => {
    handleclick();
    let distribution = { L: {}, T: {}, P: {}, TP: {} };

    let lectslot = { L: new Set(), T: new Set(), P: new Set() };
    for (let i = 0; i < courseInputs.length; i++) {
      if (courseInputs[i].courseCode !== "") {
        if (courseInputs[i].l !== 0) {
          lectslot.L.add(courseInputs[i].l);
          if (distribution.L[courseInputs[i].l] !== undefined) {
            distribution.L[courseInputs[i].l].push(courseInputs[i].courseCode);
          } else {
            distribution.L[courseInputs[i].l] = [courseInputs[i].courseCode];
          }
        }

        if (courseInputs[i].t !== 0 && courseInputs[i].p !== 0) {
          if (distribution.TP[courseInputs[i].p + 1] !== undefined) {
            distribution.TP[courseInputs[i].p + 1].push(
              courseInputs[i].courseCode
            );
          } else {
            distribution.TP[courseInputs[i].p + 1] = [
              courseInputs[i].courseCode,
            ];
          }
        } else if (courseInputs[i].t !== 0) {
          lectslot.T.add(courseInputs[i].t);

          if (distribution.T[courseInputs[i].t] !== undefined) {
            distribution.T[courseInputs[i].t].push(courseInputs[i].courseCode);
          } else {
            distribution.T[courseInputs[i].t] = [courseInputs[i].courseCode];
          }
        } else if (courseInputs[i].p !== 0) {
          lectslot.P.add(courseInputs[i].p);
          if (distribution.P[courseInputs[i].p] !== undefined) {
            distribution.P[courseInputs[i].p].push(courseInputs[i].courseCode);
          } else {
            distribution.P[courseInputs[i].p] = [courseInputs[i].courseCode];
          }
        }
      }
    }

    // Lecture Assignment Code
    let uniquearray = Array.from(lectslot.L);
    uniquearray.sort((a, b) => a - b);
    uniquearray = uniquearray.reverse();
    // console.log("dist", distribution);
    // console.log("LEC", lectslot);
    let dict = {};
    let remmm = 1;
    for (let i = 0; i < uniquearray.length; i++) {
      for (let j = 0; j < distribution.L[uniquearray[i]].length; j++) {
        dict[remmm] = [distribution.L[uniquearray[i]][j], uniquearray[i]];
        remmm++;
      }
    }

    // console.log("Dict", dict);

    let copyallcol = JSON.parse(JSON.stringify(ccallcol));
    let Lunch_idx = null;
    for (let i = 0; i < copyallcol[0].length; i++) {
      if (copyallcol[0][i] === "Lunch") {
        Lunch_idx = i;
      }
    }

    let colsize = copyallcol[0].length;

    console.log("setold", timecol);
    if (
      distribution.TP.hasOwnProperty(4) &&
      copyallcol[0].length - Lunch_idx - 1 < 4
    ) {
      for (let i = 0; i < copyallcol.length; i++) {
        copyallcol[i].push(null);
      }

      let st = timecol[colsize - 1];
      let vl = st.split("-");
      let vt = vl[vl.length - 1].split(":");
      let nt = parseInt(vt[0]) + 1;
      st = vl[vl.length - 1] + "-" + nt + ":" + vt[1];
      setTimecol((prev) => [...prev, st]);
    }
    console.log("setnew", timecol);
    console.log("old", copyallcol);
    for (let i = 0; i < copyallcol[0].length; i++) {
      for (let j = 0; j < copyallcol.length; j++) {
        if (
          batch === 1 &&
          copyallcol[j][i] !== null &&
          dict[copyallcol[j][i]] !== undefined
        ) {
          if (dict[copyallcol[j][i]][1] > 0) {
            dict[copyallcol[j][i]][1]--;
            copyallcol[j][i] = dict[copyallcol[j][i]][0];
          } else {
            copyallcol[j][i] = null;
          }
        } else if (
          batch === 2 &&
          j % 2 === 0 &&
          copyallcol[j][i] !== null &&
          dict[copyallcol[j][i]] !== undefined
        ) {
          if (dict[copyallcol[j][i]][1] > 0) {
            dict[copyallcol[j][i]][1]--;
            copyallcol[j][i] = dict[copyallcol[j][i]][0];
          } else {
            copyallcol[j][i] = null;
          }
        } else if (
          copyallcol[j][i] !== "Lunch" &&
          copyallcol[j][i] !== "Break"
        ) {
          copyallcol[j][i] = null;
        }
      }
    }

    // Lab+Tutorial Assignment Code
    let last = 0;
    let arrP = Object.keys(distribution.TP).reverse();
    for (let i = Lunch_idx + 1; i < copyallcol[0].length; i++) {
      for (let j = 0; j < copyallcol.length; j++) {
        if (batch === 1 && copyallcol[j][i] === null) {
          let i1 = i;
          let val = copyallcol[0].length - i;
          // console.log("VAL", val);
          if (
            distribution.TP.hasOwnProperty(val) &&
            distribution.TP[val].length > 0
          ) {
            let sub = distribution.TP[val][0];
            distribution.TP[val].shift();
            copyallcol[j][i1] = sub + "[T]";
            i1++;
            while (i1 < copyallcol[0].length && val--) {
              copyallcol[j][i1] = sub + "[L]";
              i1++;
            }
          } else {
            let k = 0;
            while (
              k < arrP.length &&
              (parseInt(arrP[k]) > val ||
                distribution.TP[parseInt(arrP[k])].length === 0)
            ) {
              k++;
            }
            if (k === arrP.length) {
              break;
            }
            val = parseInt(arrP[k]);
            let sub = distribution.TP[val][0];
            distribution.TP[val].shift();
            copyallcol[j][i1] = sub + "[T]";
            i1++;
            while (i1 < copyallcol[0].length && val--) {
              copyallcol[j][i1] = sub + "[L]";
              i1++;
            }
          }
          // console.log("inside", copyallcol);
        } else if (batch === 2 && j % 2 === 0 && copyallcol[j][i] === null) {
          let i1 = i;
          let val = copyallcol[0].length - i;
          // console.log("VAL", val);
          if (
            distribution.TP.hasOwnProperty(val) &&
            distribution.TP[val].length > 0
          ) {
            let sub = distribution.TP[val][0];
            distribution.TP[val].shift();
            copyallcol[j][i1] = "A1:" + sub + "[T]";
            copyallcol[(j + 3) % 10][i1] = "A2:" + sub + "[T]";
            i1++;
            while (i1 < copyallcol[0].length && val-- > 1) {
              copyallcol[j][i1] = "A1:" + sub + "[L]";
              copyallcol[(j + 3) % 10][i1] = "A2:" + sub + "[L]";
              i1++;
            }
            last = (j + 3) % 10;
          } else {
            let k = 0;
            while (
              k < arrP.length &&
              (parseInt(arrP[k]) > val ||
                distribution.TP[parseInt(arrP[k])].length === 0)
            ) {
              k++;
            }
            if (k === arrP.length) {
              break;
            }
            val = parseInt(arrP[k]);
            let sub = distribution.TP[val][0];
            distribution.TP[val].shift();
            copyallcol[j][i1] = "A1:" + sub + "[T]";
            copyallcol[(j + 3) % 10][i1] = "A2:" + sub + "[T]";
            i1++;
            while (i1 < copyallcol[0].length && val-- > 1) {
              copyallcol[j][i1] = "A1:" + sub + "[L]";
              copyallcol[(j + 3) % 10][i1] = "A2:" + sub + "[L]";
              last = (j + 3) % 10;
              i1++;
            }
          }
          // console.log("inside", copyallcol);
        }
      }
    }

    // Individual Lab Assignment Code
    arrP = Object.keys(distribution.P).reverse();
    for (let i = Lunch_idx + 1; i < copyallcol[0].length; i++) {
      for (let j = 0; j < copyallcol.length; j++) {
        if (batch === 1 && copyallcol[j][i] === null) {
          let i1 = i;
          let val = copyallcol[0].length - i;
          // console.log("VAL", val);
          if (
            distribution.P.hasOwnProperty(val) &&
            distribution.P[val].length > 0
          ) {
            let sub = distribution.P[val][0];
            distribution.P[val].shift();
            while (i1 < copyallcol[0].length && val--) {
              copyallcol[j][i1] = sub + "[L]";
              i1++;
            }
          } else {
            let k = 0;
            while (
              k < arrP.length &&
              (parseInt(arrP[k]) > val ||
                distribution.P[parseInt(arrP[k])].length === 0)
            ) {
              k++;
            }
            if (k === arrP.length) {
              break;
            }
            val = parseInt(arrP[k]);
            let sub = distribution.P[val][0];
            distribution.P[val].shift();
            while (i1 < copyallcol[0].length && val--) {
              copyallcol[j][i1] = sub + "[L]";
              i1++;
            }
          }
          // console.log("inside", copyallcol);
        } else if (batch === 2 && j % 2 === 0 && copyallcol[j][i] === null) {
          let i1 = i;
          let val = copyallcol[0].length - i;
          // console.log("VAL", val);
          if (
            distribution.P.hasOwnProperty(val) &&
            distribution.P[val].length > 0
          ) {
            let sub = distribution.P[val][0];
            distribution.P[val].shift();
            while (i1 < copyallcol[0].length && val--) {
              copyallcol[j][i1] = "A1:" + sub + "[L]";
              copyallcol[(j + 3) % 10][i1] = "A2:" + sub + "[L]";
              i1++;
            }
            if ((j + 3) % 10 > last) {
              last = (j + 3) % 10;
            }
          } else {
            let k = 0;
            while (
              k < arrP.length &&
              (parseInt(arrP[k]) > val ||
                distribution.P[parseInt(arrP[k])].length === 0)
            ) {
              k++;
            }
            if (k === arrP.length) {
              break;
            }
            val = parseInt(arrP[k]);
            let sub = distribution.P[val][0];
            distribution.P[val].shift();
            while (i1 < copyallcol[0].length && val--) {
              copyallcol[j][i1] = "A1:" + sub + "[L]";
              copyallcol[(j + 3) % 10][i1] = "A2:" + sub + "[L]";
              i1++;
            }
            if ((j + 3) % 10 > last) {
              last = (j + 3) % 10;
            }
          }
          // console.log("inside", copyallcol);
        }
      }
    }

    // console.log("LAST", last);

    if (batch === 2) {
      let cc = 0;
      for (let i = Lunch_idx + 1; i < copyallcol[0].length; i++) {
        if (copyallcol[1][i] === null) {
          cc++;
        }
      }

      // console.log("cc", cc);

      if (cc === copyallcol[0].length - Lunch_idx - 1) {
        for (let i = Lunch_idx + 1; i < copyallcol[0].length; i++) {
          copyallcol[1][i] = copyallcol[last][i];
          copyallcol[last][i] = null;
        }
      }
    }

    // Tutorial Assignment Code
    // console.log("dist2", distribution);
    let flag = true;
    let prevT;
    for (let i = 0; i < copyallcol[0].length; i++) {
      for (let j = 0; j < copyallcol.length; j++) {
        if (
          batch === 1 &&
          distribution.T.hasOwnProperty(1) &&
          distribution.T[1].length > 0 &&
          copyallcol[j][i] === null
        ) {
          copyallcol[j][i] = distribution.T[1][0] + "[T]";
          distribution.T[1].shift();
        } else if (
          batch === 2 &&
          distribution.T.hasOwnProperty(1) &&
          distribution.T[1].length > 0 &&
          j % 2 === 0 &&
          copyallcol[j][i] === null
        ) {
          if (i > Lunch_idx) {
            if (copyallcol[j + 1][i] === null) {
              copyallcol[j][i] = "A1:" + distribution.T[1][0] + "[T]";
              copyallcol[j + 1][i] = flag
                ? "A2:" +
                  distribution.T[1][distribution.T[1].length - 1] +
                  "[T]"
                : prevT;
              prevT = "A2:" + distribution.T[1][0] + "[T]";
              flag = false;
              distribution.T[1].shift();
            }
          } else {
            copyallcol[j][i] = "A1:" + distribution.T[1][0] + "[T]";
            copyallcol[j + 1][i] = flag
              ? "A2:" + distribution.T[1][distribution.T[1].length - 1] + "[T]"
              : prevT;
            prevT = "A2:" + distribution.T[1][0] + "[T]";
            flag = false;
            distribution.T[1].shift();
          }
        }
        // console.log("TIN", copyallcol);
      }
    }

    // console.log("new", copyallcol);

    if (oallp === "aft") {
      let newAllCol = [];
      for (let i = 0; i < copyallcol.length; i++) {
        newAllCol.push([]);
      }

      for (let i = 0; i < copyallcol.length; i++) {
        for (let j = Lunch_idx + 1; j < copyallcol[0].length; j++) {
          newAllCol[i].push(copyallcol[i][j]);
        }
      }

      for (let i = 0; i < copyallcol.length; i++) {
        newAllCol[i].push(copyallcol[i][Lunch_idx]);
      }

      for (let i = 0; i < copyallcol.length; i++) {
        for (let j = 0; j < Lunch_idx; j++) {
          newAllCol[i].push(copyallcol[i][j]);
        }
      }

      copyallcol = [...newAllCol];
      // copyallcol = JSON.parse(JSON.stringify(ccallcol));
    }

    setAllcol([...copyallcol]);
    setLead((prev) => prev + 1);
  };

  // console.log("rows", rows);
  return (
    <div className="mx-auto w-full print:invisible">
      <div className={lead === 0 ? "block w-2/3 mx-auto my-10" : "hidden"}>
        <div className="bg-bck-4 text-center rounded ">
          <div className="pt-5 text-xl font-semibold">TOTAL WEEKDAYS</div>
          <select
            value={rows}
            onChange={(event) => {
              setRows(parseInt(event.target.value));
            }}
            style={{ color: "black" }}
            id="rows"
            name="rows"
          >
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          {/* {rows} */}
          {/* <br /> */}
          <div className="text-center rounded my-3 py-2 flex flex-row flex-wrap justify-evenly">
            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">1. LUNCH START TIME</div>
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
            </div>

            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">2. SLOTS BEFORE LUNCH</div>
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
            </div>

            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">3. SLOTS START TIME</div>
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
            </div>

            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">4. LUNCH END TIME</div>
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
            </div>

            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">5. SLOTS AFTER LUNCH</div>
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
            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">6. LECTURE PRIORITY</div>
              <select
                style={{ color: "black" }}
                value={oallp}
                onChange={(e) => {
                  setOallp(e.target.value);
                }}
                id="oallp"
                name="oallp"
              >
                <option value="Selected" selected="true" disabled="disabled">
                  Select
                </option>
                <option value="mor">Morning</option>
                <option value="aft">Afternoon</option>
              </select>
            </div>

            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">7. TOTAL SECTION</div>
              <select
                value={sectn}
                onChange={(e) => setSectn(parseInt(e.target.value))}
                style={{ color: "black" }}
                id="section"
                name="section"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>

            <div className="bg-bck-3 p-5 m-5 w-64 rounded">
              <div className="text-l font-semibold">8. BATCH PER SECTION</div>
              <select
                value={batch}
                onChange={(e) => setBatch(parseInt(e.target.value))}
                style={{ color: "black" }}
                id="section"
                name="section"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
          </div>
          <p className="text-xs font-thin text-yellow-300">
            **FILL THE INPUT IN ORDER
          </p>
          <div className="w-1/3 mx-auto align-center">
            <button
              onClick={handleclick}
              className="w-full my-10 text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-m px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>

      {/* *************************************************************************************************************** */}
      <div
        className={
          lead === 1
            ? "p-10 rounded block w-3/4 mx-auto bg-bck-4 text-center my-10"
            : "hidden"
        }
        id="secondpage"
      >
        <div className=" flex flex-row flex-wrap justify-evenly ">
          {courseInputs.map((obj) => (
            <div className="w-1/4 flex flex-row justify-evenly bg-bck-3 text-center rounded my-5 mx-2 py-4 px-2">
              <div className="w-full">
                <div className="text-sm font-bold">CC</div>
                <input
                  type="text"
                  name="course_code"
                  id="course_code"
                  onChange={(event) => {
                    obj.courseCode = event.target.value;
                  }}
                  className="rounded text-center outline-none text-black w-1/2"
                  required
                />
              </div>

              <div className="flex justify-evenly">
                <div className="flex flex-col mx-2">
                  <div className=" text-sm font-bold">L</div>
                  <input
                    type="number"
                    name="lecstime"
                    id="lecstime"
                    onChange={(event) => {
                      obj.l =
                        event.target.value === ""
                          ? 0
                          : parseInt(event.target.value, 10);
                    }}
                    defaultValue={obj.l}
                    min={1}
                    max={7}
                    className="rounded mb-1 text-center outline-none text-black"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-bold">T</div>
                  <input
                    type="number"
                    name="tutstime"
                    id="tutstime"
                    onChange={(event) => {
                      obj.t =
                        event.target.value === ""
                          ? 0
                          : parseInt(event.target.value, 10);
                    }}
                    defaultValue={obj.t}
                    min={1}
                    max={9}
                    className="rounded  mb-1 text-center outline-none text-black"
                    required
                  />
                </div>
                <div className="flex flex-col mx-2">
                  <div className="text-sm font-bold">P</div>
                  <input
                    type="number"
                    name="labtime"
                    id="labtime"
                    onChange={(event) => {
                      obj.p =
                        event.target.value === ""
                          ? 0
                          : parseInt(event.target.value, 10);
                    }}
                    defaultValue={obj.p}
                    min={1}
                    max={9}
                    className="rounded mb-1 text-center outline-none text-black"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs font-thin text-yellow-300 mt-2">
          CC - COURSE CODE
        </p>
        <p className="text-xs font-thin text-yellow-300">L - LECTURE</p>
        <p className="text-xs font-thin text-yellow-300">T - TUTORIAL</p>
        <p className="text-xs font-thin text-yellow-300 mb-2">
          P - PRACTICAL / LAB
        </p>
        <div className="flex flex-row">
          <div className="w-1/6 mx-auto align-center my-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              &laquo; Back
            </button>
          </div>
          <div className="w-1/6 mx-auto align-center my-3">
            <button
              onClick={addCourseInputs}
              className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              Add
            </button>
          </div>
          <div className="w-1/6 mx-auto align-center my-3">
            <button
              onClick={updateTT}
              className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              Generate &raquo;
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          lead !== 0 && lead !== 1
            ? "mx-10  py-5 rounded flex flex-col"
            : "hidden"
        }
        id="Thirdpage"
      >
        <div className="flex flex-row flex-wrap justify-evenly">
          <div
            className={
              prnt1 === 1 && prnt2 === 1
                ? "flex flex-col flex-wrap justify-evenly print:visible print:absolute print:top-10"
                : "flex flex-col flex-wrap justify-evenly"
            }
          >
            <div
              className={
                prnt1 === 1 && prnt2 === 0
                  ? "print:visible print:absolute print:top-10"
                  : ""
              }
              id="tableId1"
            >
              <div className="font-bold text-xl text-black text-center">
                SECTION 1
              </div>
              <div className="flex flex-row mb-3">
                <Table
                  section={1}
                  setCurrSection={setCurrSection}
                  data={tblData}
                  cellObj={cellObj1}
                  setCellObj={setCellObj1}
                  selectedObj={selectedObj1}
                  setSelectedObj={setSelectedObj1}
                  columns={tblCols}
                  clickEnabled={clickEnabled}
                />
                <input
                  type="checkbox"
                  className="print:invisible w-4 h-4"
                  defaultChecked={false}
                  onChange={() => {
                    setPrnt1((prev) => {
                      if (prev === 1) {
                        return 0;
                      }
                      return 1;
                    });
                  }}
                />
              </div>
            </div>
            <div className={sectn === 2 ? "" : "hidden"} id="tableId2">
              <div
                className={
                  prnt2 === 1 && prnt1 === 0
                    ? "print:visible print:absolute print:top-10"
                    : ""
                }
              >
                <div className="font-bold text-xl text-black text-center">
                  SECTION 2
                </div>
                <div className="flex flex-row">
                  <Table
                    section={2}
                    setCurrSection={setCurrSection}
                    data={newtblData}
                    cellObj={cellObj2}
                    setCellObj={setCellObj2}
                    selectedObj={selectedObj2}
                    setSelectedObj={setSelectedObj2}
                    columns={tblCols}
                    clickEnabled={clickEnabled}
                  />
                  <input
                    type="checkbox"
                    className="print:invisible w-4 h-4"
                    defaultChecked={false}
                    onChange={() => {
                      setPrnt2((prev) => {
                        if (prev === 1) {
                          return 0;
                        }
                        return 1;
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-auto">
            <div className="flex flex-col bg-bck-4 rounded p-5 my-2">
              <div className="mx-auto align-center">
                <input
                  type="checkbox"
                  id="enableclick"
                  defaultChecked={false}
                  onChange={enableClick}
                />
                <label for="enableclick">Enable Cell Selection</label>
              </div>
              <div className="align-center">
                <div className="my-3 flex justify-between">
                  <button
                    value="select"
                    style={{ background: btnBgClr }}
                    onClick={(e) => handleCellObj(e, 0, 1)}
                    disabled={!clickEnabled}
                    className=" text-white bg-bck-3 font-medium rounded text-sm px-2 py-1.5 dark:hover:bg-blue-400"
                  >
                    Select cell 1
                  </button>
                  <button
                    value="set"
                    onClick={(e) => handleCellObj(e, 0, 1)}
                    style={{ background: btnBgClr }}
                    disabled={!clickEnabled}
                    className="text-white bg-bck-2 font-medium rounded text-sm px-5 py-1.5 dark:hover:bg-blue-300"
                  >
                    Set
                  </button>
                </div>
                <div className="ml-2 my-auto inline-block">
                  {cellObj1[0]["value"]}
                </div>
              </div>

              <div className="align-center">
                <div className="my-3 flex justify-between">
                  <button
                    value="select"
                    onClick={(e) => handleCellObj(e, 1, 0)}
                    style={{ background: btnBgClr }}
                    disabled={!clickEnabled}
                    className="text-white bg-bck-3 font-medium rounded text-sm px-2 py-1.5 dark:hover:bg-blue-400"
                  >
                    Select cell 2
                  </button>
                  <button
                    value="set"
                    disabled={!clickEnabled}
                    onClick={(e) => handleCellObj(e, 1, 0)}
                    style={{ background: btnBgClr }}
                    className="text-white bg-bck-2 font-medium rounded text-sm px-5 py-1.5 dark:hover:bg-blue-300 inline-block"
                  >
                    Set
                  </button>
                </div>
                <div className="ml-2 align-center my-auto inline-block">
                  {cellObj1[1]["value"]}
                </div>
              </div>

              <div className="mx-auto align-center my-3">
                <button
                  style={{ background: btnBgClr }}
                  onClick={handleSwap}
                  disabled={!clickEnabled}
                  className=" text-white bg-bck-3 font-medium rounded text-sm px-2 py-1.5 dark:hover:bg-blue-500"
                >
                  Swap cells
                </button>
              </div>
            </div>
            <p className="text-xs font-thin text-violet-700 mt-2 text-center ">
              **To Print, first Select the
              <hr />
              table by clicking the chekbox
            </p>
            <div className="flex flex-row">
              <div className="my-5 align-center mx-auto">
                <button
                  onClick={() => setLead(1)}
                  className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-300 focus:outline-none dark:focus:ring-blue-800"
                >
                  &laquo; Back
                </button>
              </div>
              <div className={"mx-auto align-center my-5"}>
                <button
                  onClick={exportPDF}
                  className="w-full text-white bg-bck-3 hover:bg-bck-3 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-bck-3-600 dark:hover:bg-blue-300 focus:outline-none dark:focus:ring-blue-800"
                >
                  Print &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ********************************************************************************************* */}
    </div>
  );
}

export default Home;
