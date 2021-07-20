import React, { useState, useEffect } from 'react';
// import {Container,Label, Card, CardHeader, CardTitle, CardBody, Form, FormGroup, Row, Col, Progress } from "reactstrap"
import { Container, Row, Col, Label, Button } from 'reactstrap';
import { readFile } from "@ramonak/react-excel"
import './custom.css'
import DataTableComponent from "./components/datatableCustom.jsx"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure()

const ImportExcelDatatables = () => {

  //------------- fnc พิเศษจาก lib @ramonak/react-excel สำหรับดึง readfiles มาเอาลง datatables
  function _interopDefault(ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
  var XLSX = _interopDefault(require('xlsx'));

  //---------------------------------constructor and State ---------------------------
  const [textinputFile, setTextinputFile] = useState("")
  const [initialValidData, setInitialValidData] = useState([])
  const [initialData, setInitialData] = useState([])
  const [rows, setRows] = useState([])
  const [rows2, setRows2] = useState([])

  // -------------------- columns for datatables -------------------------------------
  const columns = [
    {
      name: "empid",
      label: (
        <div>
          <Label className="mb-1">empid</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div className="text-center" style={row.valid === false ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" } : { width: "100%" }}>
          <Label>{row.empid}</Label>
        </div>
      ),
      width: "10%",
    },
    {
      name: "name",
      label: (
        <div>
          <Label className="mb-1" need="need">name</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div className="text-center" style={row.valid === false ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" } : { width: "100%" }}>
          <Label>{row.name}</Label>
        </div>
      ),
      width: "20%",
    },
    {
      name: "lastname",
      label: (
        <div>
          <Label className="mb-1" need="need">lastname</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div className="text-center" style={row.valid === false ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" } : { width: "100%" }}>
          <Label>{row.lastname}</Label>
        </div>
      ),
      width: "20%",
    },
    {
      name: "position",
      label: (
        <div>
          <Label className="mb-1" need="need">position</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div className="text-center" style={row.valid === false ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" } : { width: "100%" }}>
          <Label>{row.position}</Label>
        </div>
      ),
      width: "30%",
    },
    {
      name: "startDates",
      label: (
        <div>
          <Label className="mb-1" need="need">startDates</Label>
        </div>
      ),
      theadAlign: "center",
      tbody: (row) => (
        <div className="text-center" style={row.valid === false ? { width: "100%", background: "rgba(220, 53, 69, 0.3)" } : { width: "100%" }}>
          <Label>{row.startDates}</Label>
        </div>
      ),
      width: "20%",
    },
  ]
  //----------------------------useEffect ----------------------------------------------
  useEffect(() => {

    // if (initialData.SheetNames) {
    //   console.log()
    // }
    if (initialData.SheetNames) {
      var setData = function setData() {
        var result = initialData.SheetNames.map(function (name) {
          var _ref;
          var ws = initialData.Sheets[name];
          var dataParse = XLSX.utils.sheet_to_json(ws, {
            header: [
              'empid',
              'name',
              'lastname',
              'position',
              'startDates'
            ],
            defval: "",
          });
          return _ref = {}, _ref = dataParse, _ref;
        });
        let header = ''
        result[0].slice(0, 1).map((item) =>
          header += `${item.empid}${item.name}${item.lastname}${item.position}${item.startDates}`
        )
        if (header === 'empidnamelastnamepositionstartDates') {
          // check header of xlsx is true 
          console.log("result[0].slice(2)", result[0].slice(2));
          setRows(result[0].slice(2))
        }
        else {
          console.log('ข้อมูลผิด')
          setTextinputFile("")
          toast.error('header is not corresponding.', { position: toast.POSITION.BOTTOM_RIGHT, autoClose: 3000 })
          document.getElementById("inputFilesStudent").value = ""
        }

      }
      initialData && setData();
    }
  }, [initialData])

  //---------------------------------- FNC ALL ---------------------------------------
  const handleUpload = (e) => {
    // setStatusProcess(true)
    setRows([])
    // setRows2([])
    const file = e.target.files[0]
    if (file) {
      console.log('files---', file)
      setTextinputFile(file.name)
      readFile(file)
        .then((readedData) => setInitialData(readedData))
        .catch((error) => {
          toast.error('file import is not xlsx format.',
            {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 3000
            }
          )
        })
    }
  }



  return (
    <>
      {/* components */}
      <Container>
        <Row className="py-1 justify-content-md-center pt-3">
          <Col md="2" className="m-auto">
            <Label>Excel import</Label>
          </Col>
          <Col md="8">
            <div style={{ width: "300px" }}>
              <div className=" custom-file">
                <input className=" custom-file-input" id="inputFilesStudent" lang="en" type="file" accept=".xlsx" onChange={handleUpload}></input>
                <label className=" custom-file-label m-0" htmlFor="inputFilesStudent">
                  {textinputFile ? textinputFile : "select .XLSX "}
                </label>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          {rows.length ? (
            <>
              <div className="col-12">
                <DataTableComponent columns={columns} rows={rows} search={false} btnAdd={[]} />
              </div>
              <div className="col-12 text-center">
                <Button color="success">import</Button>
              </div>
            </>
          ) : null}
        </Row>

      </Container>
    </>
  )
}



export default ImportExcelDatatables;