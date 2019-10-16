import React from "react";
import { Cell } from "@blueprintjs/table";

const string = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  return <Cell>{phenotypes[rowIndex][field]}</Cell>;
};

const stringArray = (phenotypes: Object[], field: string) => (
  rowIndex: number
) => {
  let values = phenotypes[rowIndex][field].map(
    (value: string, index: number) => (
      <div key={value}>
        {`${index + 1}. `}
        {value}
      </div>
    )
  );

  return <Cell>{values}</Cell>;
};

module.exports = {
  string,
  stringArray
};
