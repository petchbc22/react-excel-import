import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Label,
  Button,
  Table,
  FormGroup,
} from "reactstrap";
import { readFile } from "@ramonak/react-excel";
import "./custom.css";
import DataTableComponent from "./components/datatableCustom.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

toast.configure();

const ImportExcelDatatables = () => {
  //------------- fnc พิเศษจาก lib @ramonak/react-excel สำหรับดึง readfiles มาเอาลง datatables
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var XLSX = _interopDefault(require("xlsx"));

  //---------------------------------constructor and State ---------------------------
  const [textinputFile, setTextinputFile] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [rows, setRows] = useState([]);
  const [initialValidData, setInitialValidData] = useState([]);

  const [masterData, setMasterData] = useState([]);
  const [loadingSpin, setLoadingSpin] = useState(false);
  // -------------------- columns for datatables -------------------------------------
  const columns = [
    {
      name: "no",
      label: (
        <div>
          <Label className="mb-1">no</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div
          className="text-center"
          style={
            row.valid === false
              ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" }
              : { width: "100%" }
          }
        >
          <Label>{row.no}</Label>
        </div>
      ),
      width: "10%",
    },
    {
      name: "empid",
      label: (
        <div>
          <Label className="mb-1">empid</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div
          className="text-center"
          style={
            row.valid === false
              ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" }
              : { width: "100%" }
          }
        >
          <Label>{row.empid}</Label>
        </div>
      ),
      width: "10%",
    },
    {
      name: "name",
      label: (
        <div>
          <Label className="mb-1" need="need">
            name
          </Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div
          className="text-center"
          style={
            row.valid === false
              ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" }
              : { width: "100%" }
          }
        >
          <Label>{row.name}</Label>
        </div>
      ),
      width: "20%",
    },
    {
      name: "lastname",
      label: (
        <div>
          <Label className="mb-1" need="need">
            lastname
          </Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div
          className="text-center"
          style={
            row.valid === false
              ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" }
              : { width: "100%" }
          }
        >
          <Label>{row.lastname}</Label>
        </div>
      ),
      width: "20%",
    },
    {
      name: "position",
      label: (
        <div>
          <Label className="mb-1" need="need">
            position
          </Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div
          className="text-center"
          style={
            row.valid === false
              ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" }
              : { width: "100%" }
          }
        >
          <Label>{row.position}</Label>
        </div>
      ),
      width: "20%",
    },
    {
      name: "startDates",
      label: (
        <div>
          <Label className="mb-1" need="need">
            startDates
          </Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div
          className="text-center"
          style={
            row.valid === false
              ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" }
              : { width: "100%" }
          }
        >
          <Label>{row.startDates}</Label>
        </div>
      ),
      width: "20%",
    },
  ];
  //----------------------------useEffect ----------------------------------------------
  // Fetch Data API
  useEffect(() => {
    setLoadingSpin(true);
    fetch(
      "https://raw.githubusercontent.com/petchbc22/react-excel-import/main/api.json"
    )
      .then((Response) => Response.json())
      .then((data) => {
        setMasterData(data);
        setLoadingSpin(false);
      })
      .catch((err) =>   
      toast.error("error loading api.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar:true
      }),
      setLoadingSpin(false)
      );
  }, []);
  // Read XLSX file
  useEffect(() => {
    if (initialData.SheetNames) {
      var setData = function setData() {
        var result = initialData.SheetNames.map(function (name) {
          var _ref;
          var ws = initialData.Sheets[name];
          var dataParse = XLSX.utils.sheet_to_json(ws, {
            header: ["empid", "name", "lastname", "position", "startDates"],
            defval: "",
          });
          return (_ref = {}), (_ref = dataParse), _ref;
        });
        let header = "";
        result[0]
          .slice(0, 1)
          .map(
            (item) =>
              (header += `${item.empid}${item.name}${item.lastname}${item.position}${item.startDates}`)
          );
        if (header === "empidnamelastnamepositionstartDates") {
          // check header of xlsx is true
          let datawithNo = result[0].slice(1).map((data,index)=>{
            return{
              no : index+1,
              ...data
            }
          })
          setRows(datawithNo);
          setLoadingSpin(false);
        } else {
          setTextinputFile("");
          toast.error("header is not corresponding.", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
            hideProgressBar:true
          });
          document.getElementById("inputFiles").value = "";
        }
      };
      initialData && setData();
    }
  }, [initialData]);
  //---------------------------------- FNC ALL ---------------------------------------
  // FNC Compare to find Duplicate ID
  function comparer(otherArray) {
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other.empid === current.empid;
        }).length !== 0
      );
    };
  }
  // FNC Upload XLSX
  const handleUpload = (e) => {

    setInitialData([]);
    setInitialValidData([]);
    setRows([]);
    const file = e.target.files[0];
    if (file) {
      setTextinputFile(file.name);
      readFile(file)
        .then((readedData) => setInitialData(readedData),setInitialValidData([]))
        .catch((error) => {
          toast.error("file import is not xlsx format.", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
            hideProgressBar:true

          });
        });
    }
  };
  // ONCLICK Validation Button
  const validation = () => {
    setLoadingSpin(true);
    let inputAddID = rows.map((obj, index) => ({ id: index, ...obj }));
    let dataxlsx = rows.map((data, index) => {
      return {
        id: index,
        valid: false,
        empid: String(data.empid),
        Errorempid: data.empid,
      };
    });
    let empidError = dataxlsx.filter(comparer(masterData));
    const responseTextValid = inputAddID.map((t1) => ({
      id: t1.id,
      ...empidError.find((data) => data.empid === t1.empid),
    }));
    const dataRowsValid = inputAddID.map((t1) => ({
      ...t1, // get all object in inputAddID
      ...empidError.find((data) => data.empid === t1.empid),
    }));
    let onlyErrorRow = responseTextValid.filter((x) => x.valid === false);
    if (onlyErrorRow.length) {
      setLoadingSpin(false);
      setRows(dataRowsValid);
      setInitialValidData(onlyErrorRow);
    }
    else{
      setLoadingSpin(false);
      toast.success("send data to insert :)", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar:true
      });
    }
  };
  // ONCLICK Clear Button
  const fncClear = () => {
    setRows([]);
    setTextinputFile("");
    setInitialData([]);
    setInitialValidData([]);
    document.getElementById("inputFiles").value = "";
  };
  return (
    <>
      {loadingSpin === true ? (
        <div className="main-center-of-page">
          <ReactLoading
            type={"spin"}
            color={"#14b960"}
            height={30}
            width={30}
            className={"m-auto element-center-of-page"}
          />
        </div>
      ) : null}

      <Container>
        <Row className="py-1 justify-content-md-center pt-3">
          <Col md="12">
            <div className="text-center">
              <Label>Master Data</Label>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>empID</th>
                  <th>Name</th>
                  <th>LastName</th>
                  <th>Position</th>
                  <th>StartDate</th>
                </tr>
              </thead>
              <tbody>
                {masterData.length ? (
                  masterData.map((data, key) => {
                    return (
                      <tr key={key}>
                        <th scope="row">{data.empid}</th>
                        <td>{data.name}</td>
                        <td>{data.lastname}</td>
                        <td>{data.position}</td>
                        <td>{data.startDates}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td  colSpan="5" className="text-center">no data.</td>
                   
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
          <Col md="2" className="m-auto pt-5">
            <Label>Excel import</Label>
          </Col>
          <Col md="8" className="pt-5">
            <div style={{ width: "300px" }}>
              <div className=" custom-file">
                <input
                  className=" custom-file-input"
                  id="inputFiles"
                  lang="en"
                  type="file"
                  accept=".xlsx"
                  onChange={handleUpload}
                ></input>
                <label
                  className=" custom-file-label m-0"
                  htmlFor="inputFiles"
                >
                  {textinputFile ? textinputFile : "select .XLSX "}
                </label>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {rows.length ? (
            <>
              <div className="col-12 text-center pt-5">
                <Label>Your Data in XLSX</Label>
              </div>
              {initialValidData.length ? (
                <Col md="12">
                  { initialValidData.map((data, index) => {
                    return data.valid === false ? (
                      <FormGroup key={index}>
                        <Label style={{ color: "rgba(220, 53, 69)" }}>
                          Row {parseInt(data.id) + 1} :
                          {data.Errorempid
                            ? `empid ${data.Errorempid} duplicate , `
                            : ""}
                        </Label>
                      </FormGroup>
                    ) : null;
                  })}
                </Col>
              ) : null}
              <div className="col-12">
                <DataTableComponent
                  columns={columns}
                  rows={rows}
                  search={false}
                  btnAdd={[]}
                />
              </div>
              <div className="col-12 text-center row justify-content-center ">
                <div className="m-1">
                  <Button color="success" onClick={validation}>
                    Validate
                  </Button>
                </div>
                <div className="m-1">
                  <Button color="danger" onClick={fncClear}>
                    Clear
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </Row>
      </Container>
    </>
  );
};

export default ImportExcelDatatables;
