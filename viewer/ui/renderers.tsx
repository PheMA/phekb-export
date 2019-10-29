import React, { useState } from "react";
import { Tooltip, Button, Classes, Dialog } from "@blueprintjs/core";
import { Cell } from "@blueprintjs/table";

const renderEmptyCell = () => <Cell></Cell>;

const id = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

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

const name = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

  return (
    <Cell>
      <React.Fragment>
        <Tooltip content={`ID: ${phenotypes[rowIndex].id}`}>
          <a href={`https://phekb.org/node/${phenotypes[rowIndex].id}`}>
            {phenotypes[rowIndex].name}
          </a>
        </Tooltip>
      </React.Fragment>
    </Cell>
  );
};

const string = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

  return <Cell>{phenotypes[rowIndex][field]}</Cell>;
};

const date = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

  return <Cell>{phenotypes[rowIndex][field].substring(0, 10)}</Cell>;
};

const boolean = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

  return <Cell>{`${phenotypes[rowIndex][field]}`}</Cell>;
};

const stringArray = (phenotypes: Object[], field: string) => (
  rowIndex: number
) => {
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

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
        icon="document-open"
        className="bp3-minimal"
        text="Summary"
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
  if (phenotypes[rowIndex] === undefined) {
    return renderEmptyCell();
  }

  return (
    <Cell className="pkb__summary">
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
  if (
    phenotypes[rowIndex] === undefined ||
    phenotypes[rowIndex][field] === undefined
  ) {
    return renderEmptyCell();
  }

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
  files,
  name,
  date
};
