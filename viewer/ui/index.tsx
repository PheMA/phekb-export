import "babel-polyfill";

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

import "./index.scss";
import DataTable from "./datatable";
import FileViewer from "./filleviewer";
import UserColumnManager from "./usercolumns";

const api_prefix = "http://localhost:3000";
const list_path = `${api_prefix}/phenotype`;

const cellRenderer = rowIndex => {
  return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
};

const Header = props => {
  const { addColumn } = props;

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
            placeholder="Search [TODO]"
            dir="auto"
          />
        </div>
        <Button
          onClick={addColumn}
          className={Classes.MINIMAL}
          icon="add"
          text="Add Column"
        />
      </NavbarGroup>
    </Navbar>
  );
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

  const userColumnManager = new UserColumnManager();

  return (
    <React.Fragment>
      <Header addColumn={userColumnManager.addEmptyColumn} />
      <div className="pkb__wrapper">
        <FileViewer filepath={""} />
        <DataTable
          phenotypes={phenotypes}
          userColumnManager={userColumnManager}
        />
      </div>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById("viewer"));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
