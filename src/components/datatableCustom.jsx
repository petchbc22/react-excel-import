import React, { useState, useEffect } from "react"
import DataTable from "react-data-table-component"
import { Input,Button } from "reactstrap"
// import { Button } from "../button/Button.jsx"
import * as Icon from "react-feather"
// import { Permission } from "../permission/Permission.jsx"

const CustomHeader = ({ value, handleFilter, otherProps }) => {
  let setSearch = true
  if (otherProps.search !== undefined && otherProps.search !== null) {
    setSearch = otherProps.search
  }
  let keyword = value
  return (
    <div className="d-flex flex-wrap justify-content-between" style={{ width: "100%" }}>
      <div className="add-new d-flex">
        {otherProps.btnAdd
          ? otherProps.btnAdd.map((data, index) => {
              let click = data.onClick ? { onClick: data.onClick } : {}
              let optionPermission = {}
              if (data.permission) {
                optionPermission["type"] = data.permissionType
                if (optionPermission.type === "button") {
                  optionPermission["action"] = data.permissionAction
                }
              }
              return (
                  <Button
                    className="mr-1"
                    style={data.disabled ? { pointerEvents: "none", opacity: "0.5" } : {}}
                    outline={data.outline === false ? false : true}
                    textColor={data.textColor}
                    type={data.type ? data.type : "primary"}
                    bgColor={data.bgColor}
                    width={data.width ? data.width : ""}
                    icon={data.icon === null || data.icon === undefined ? "fas fa-plus" : data.icon}
                    {...click}
                  >
                    {data.label ? data.label : ""}
                  </Button>
              )
            })
          : ""}
      </div>
      <div className="position-relative has-icon-left mb-1">
        {setSearch ? (
          <div>
            <Input value={keyword} className="round" onChange={(e) => handleFilter(e.target.value)} />
            <div className="form-control-position">
              <Icon.Search size="15" />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}
const DataTableComponent = (props) => {
  const { columns, rows, ...otherProps } = props
  const [columnsMap, setColumnsMap] = useState([])
  const [rowMap, setRowMap] = useState([])
  const [value, setValue] = useState("")
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    setColumnsMap(
      columns.map((data, index) => {
        let newMap = {
          name: data.label,
          selector: data.name,
          sortable: true,
          cell: data.tbody
            ? data.tbody
            : (row) => (
                <div className={"text-" + (data.tbodyAlign ? data.tbodyAlign : "left")} style={{ width: "100%" }}>
                  {row[data.name]}
                </div>
              ),
        }
        if (data.sortable !== undefined && data.sortable !== null) {
          newMap.sortable = data.sortable
        }
        if (data.width) {
          newMap.width = data.width
        }
        if (data.theadAlign) {
          if (data.theadAlign === "left") {
            newMap.left = true
          }
          if (data.theadAlign === "right") {
            newMap.right = true
          }
          if (data.theadAlign === "center") {
            newMap.center = true
          }
        } else {
          newMap.center = true
        }
        return newMap
      })
    )
  }, [])
  useEffect(() => {
    setValue("")
    setRowMap(
      rows.map((data, index) => {
        let keyData = Object.keys(data)
        let newMap = {}
        for (let i = 0; i < keyData.length; i++) {
          newMap[keyData[i]] = data[keyData[i]]
        }
        return newMap
      })
    )
  }, [rows])

  const handleFilter = (e) => {
    let filteredDataEv = filteredData
    let dataEv = rows
    // console.log('dataEv: ', dataEv);
    let valueEv = e
    setValue(valueEv)
    if (valueEv.length) {
      let keyNames = columnsMap.map((data, index) => {
        return data.selector
      })
      filteredDataEv = dataEv.filter((item) => {
        let check = {}
        for (let i = 0; i < keyNames.length; i++) {
          check[keyNames[i]] = {
            StartsWithCondition: false,
            IncludesCondition: false,
          }
          if (item[keyNames[i]]) {
            check[keyNames[i]].StartsWithCondition = item[keyNames[i]].toString().toLowerCase().startsWith(valueEv.toString().toLowerCase())
            check[keyNames[i]].IncludesCondition = item[keyNames[i]].toString().toLowerCase().includes(valueEv.toString().toLowerCase())
          }
        }
        let startsWithCondition = false
        let includesCondition = false
        for (let i = 0; i < keyNames.length; i++) {
          if (i === 0) {
            startsWithCondition = check[keyNames[i]].StartsWithCondition
            includesCondition = check[keyNames[i]].IncludesCondition
          } else {
            startsWithCondition = startsWithCondition || check[keyNames[i]].StartsWithCondition
            includesCondition = includesCondition || check[keyNames[i]].IncludesCondition
          }
        }
        if (startsWithCondition) {
          return startsWithCondition
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition
        } else return null
      })
      setFilteredData(filteredDataEv)
    }
  }
  let styleDivCol = {}
  let styleTb = {}
  if (otherProps.extendTabel) {
    styleDivCol = { style: { width: "100%", overflowX: "scroll" } }
    styleTb = { style: { width: otherProps.extendTabel.width, overflowX: "hidden" } }
  }

  return (
    <div className="row">
      <div className="col-md-12" {...styleDivCol}>
        <DataTable
          {...props}
          className="dataTable-custom"
          data={value.length ? filteredData : rows}
          columns={columnsMap}
          noHeader
          pagination
          subHeader
          {...styleTb}
          noDataComponent="no data"
          paginationComponentOptions={{ rowsPerPageText: "total", rangeSeparatorText: "from" }}
          subHeaderComponent={<CustomHeader value={value} handleFilter={handleFilter} otherProps={otherProps} />}
        />
      </div>
    </div>
  )
}
export default DataTableComponent
