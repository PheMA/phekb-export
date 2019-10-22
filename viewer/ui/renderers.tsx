import React, { useState } from "react";
import { Tooltip, Button, Classes, Dialog } from "@blueprintjs/core";
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

const Summary = props => {
  const [visible, setVisible] = useState(false);

  return (
    <React.Fragment>
      <Button
        className="bp3-minimal"
        text="Show summary"
        onClick={() => setVisible(true)}
      />

      <Dialog
        icon="info-sign"
        title={props.title}
        isOpen={visible}
        onClose={() => setVisible(false)}
      >
        <div
          className={Classes.DIALOG_BODY}
          dangerouslySetInnerHTML={{ __html: props.summary }}
        />
      </Dialog>
    </React.Fragment>
  );
};

const summary = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  return (
    <Cell>
      <Summary
        summary={phenotypes[rowIndex].summary}
        title={phenotypes[rowIndex].name}
      />
    </Cell>
  );
};

const File = props => {
  return (
    <div className="pkb__files">
      <a href="#" onClick={props.onClick}>
        {props.filename.replace(/%20/g, " ")}
      </a>
    </div>
  );
};

// const tmpOnClick = () => console.log("Clicked!");

const files = (phenotypes: Object[], field: string, setFileObject: any) => (
  rowIndex: number
) => {
  return (
    <Cell>
      {phenotypes[rowIndex][field].map(file => (
        <File
          key={file.url}
          onClick={() => {
            setFileObject({
              phenotype: {
                id: phenotypes[rowIndex].id,
                name: phenotypes[rowIndex].name
              },
              ...file
            });
          }}
          filename={file.url.split("/").pop()}
        />
      ))}
    </Cell>
  );
};

module.exports = {
  id,
  string,
  stringArray,
  boolean,
  summary,
  files
};
