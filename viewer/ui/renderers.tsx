import React from "react";
import { Tooltip } from "@blueprintjs/core";
import { Cell } from "@blueprintjs/table";

const id = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  return (
    <Cell>
      <React.Fragment>
        <a href={`https://phekb.org/node/${phenotypes[rowIndex][field]}`}>
          {phenotypes[rowIndex][field]}
        </a>
      </React.Fragment>
    </Cell>
  );
};

const string = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  return <Cell>{phenotypes[rowIndex][field]}</Cell>;
};

const boolean = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  return <Cell>{`${phenotypes[rowIndex][field]}`}</Cell>;
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

  return (
    <Cell>
      <Tooltip content={`Total: ${values.length}`}>
        <React.Fragment>{values}</React.Fragment>
      </Tooltip>
    </Cell>
  );
};

module.exports = {
  id,
  string,
  stringArray,
  boolean
};
