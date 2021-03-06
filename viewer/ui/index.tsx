import "babel-polyfill";
const dotenv = require("dotenv");

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Cell, Column, Table, RenderMode } from "@blueprintjs/table";
import {
  Navbar,
  NavbarHeading,
  NavbarGroup,
  Alignment,
  Button,
  Classes
} from "@blueprintjs/core";
import Split from "react-split";
import * as csvWriter from "csv-writer";

import "./index.scss";
import DataTable from "./datatable";
import FileViewer from "./filleviewer";
import UserColumnManager from "./usercolumns";

const api_prefix = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
const list_path = `${api_prefix}/phenotype`;

const cellRenderer = rowIndex => {
  return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
};

const Header = props => {
  const { addColumn, setFilter, downloadCsv } = props;

  return (
    <Navbar fixedToTop={true} className="bp3-dark">
      <NavbarGroup>
        <NavbarHeading>PheKB Export Viewer</NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <div className="bp3-input-group .modifier">
          <span className="bp3-icon bp3-icon-search"></span>
          <input
            className="bp3-input"
            type="search"
            placeholder="Search RegEx /ig"
            dir="auto"
            onChange={e => {
              setFilter(e.target.value);
            }}
          />
        </div>
        <Button
          onClick={addColumn}
          className={Classes.MINIMAL}
          icon="add"
          text="Add Column"
        />
        <Button
          onClick={downloadCsv}
          className={Classes.MINIMAL}
          icon="download"
          text="Download"
        />
      </NavbarGroup>
    </Navbar>
  );
};

const userColumnManager = new UserColumnManager();

const downloadCsv = (phenotypes, userColumns) => {
  const header = [{ id: "id", title: "ID" }, { id: "name", title: "Name" }];
  // Add user column headers
  userColumns.forEach((col, index) => {
    header.push({ id: `user_${index}`, title: col.name });
  });

  const csvStringifier = csvWriter.createObjectCsvStringifier({
    header,
    alwaysQuote: true
  });

  const records = [];

  phenotypes.forEach((phenotype, pix) => {
    const record = {};

    record.id = phenotype.id;
    record.name = phenotype.name;

    userColumns.forEach((col, index) => {
      record[`user_${index}`] = col.values[pix]
        ? col.values[pix].replace(/"/g, '\\"')
        : "";
    });

    records.push(record);
  });

  const csvString = `${csvStringifier.getHeaderString()}${csvStringifier.stringifyRecords(
    records
  )}`;

  const now = new Date();

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
  hiddenElement.target = "_blank";
  hiddenElement.download = `phekb-export-custom-columns-${now.toISOString()}.csv`;
  hiddenElement.click();
};

const App = () => {
  const [phenotypes, setPhenotypes] = useState([]);

  useEffect(() => {
    const fetchPhenotypeList = async () =>
      fetch(list_path)
        .then(result => result.json())
        .then(list => {
          const all_phenotypes = [];

          list.phenotypes.forEach(item => {
            all_phenotypes.push(
              fetch(`${api_prefix}${item.path}`).then(result => result.json())
            );
          });

          Promise.all(all_phenotypes).then(values => {
            setPhenotypes(values);
          });
        });

    fetchPhenotypeList();
  }, []);

  const [userColumns, setUserColumns] = useState(
    userColumnManager.getColumns()
  );

  const [, forceRender] = useState();

  const [fileObject, setFileObject] = useState({});

  const split = fileObject.url ? [25, 75] : [0, 100];

  const deleteColumn = columnIndex => {
    userColumnManager.deleteColumn(columnIndex);
    setUserColumns(userColumnManager.getColumns());
    forceRender({});
  };

  const moveColumn = (columnIndex, direction) => {
    userColumnManager.moveColumn(columnIndex, direction);
    setUserColumns(userColumnManager.getColumns());
    forceRender({});
  };

  const insertColumn = columnIndex => {
    userColumnManager.insertColumn(columnIndex);
    setUserColumns(userColumnManager.getColumns());
    forceRender({});
  };

  const [filter, setFilter] = useState("");

  return (
    <React.Fragment>
      <Header
        setFilter={setFilter}
        addColumn={() => {
          userColumnManager.addEmptyColumn();
          setUserColumns(userColumnManager.getColumns());
          forceRender({});
        }}
        downloadCsv={() => {
          downloadCsv(phenotypes, userColumns);
        }}
      />
      <Split minSize={0} className="pkb__wrapper" sizes={split}>
        <FileViewer fileObject={fileObject} setFileObject={setFileObject} />
        <DataTable
          filter={filter}
          setFileObject={setFileObject}
          phenotypes={phenotypes}
          userColumns={userColumns}
          deleteColumn={deleteColumn}
          insertColumn={insertColumn}
          moveColumn={moveColumn}
          getColumn={userColumnManager.getColumn.bind(userColumnManager)}
          getCell={userColumnManager.getCell.bind(userColumnManager)}
          onNameChange={userColumnManager.onNameChange.bind(userColumnManager)}
          onNameCancel={userColumnManager.onNameCancel.bind(userColumnManager)}
          onNameConfirm={userColumnManager.onNameConfirm.bind(
            userColumnManager
          )}
          onCellChange={userColumnManager.onCellChange.bind(userColumnManager)}
          onCellCancel={userColumnManager.onCellCancel.bind(userColumnManager)}
          onCellConfirm={userColumnManager.onCellConfirm.bind(
            userColumnManager
          )}
        />
      </Split>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById("viewer"));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
