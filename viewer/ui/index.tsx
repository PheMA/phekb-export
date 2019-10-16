import "babel-polyfill";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Cell, Column, Table, RenderMode } from "@blueprintjs/table";

import * as renderers from "./renderers";
import "./index.css";

const api_prefix = "http://localhost:3000";
const list_path = `${api_prefix}/phenotype`;

const cellRenderer = rowIndex => {
  return <Cell>{`$${(rowIndex * 10).toFixed(2)}`}</Cell>;
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

  return (
    <Table
      renderMode={RenderMode.BATCH_ON_UPDATE}
      defaultRowHeight={40}
      enableRowHeader={true}
      numRows={phenotypes.length}
    >
      <Column name="ID" cellRenderer={renderers.string(phenotypes, "id")} />
      <Column name="Name" cellRenderer={renderers.string(phenotypes, "name")} />
      <Column
        name="Type"
        cellRenderer={renderers.stringArray(phenotypes, "type")}
      />
    </Table>
  );
};

ReactDOM.render(<App />, document.getElementById("viewer"));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
