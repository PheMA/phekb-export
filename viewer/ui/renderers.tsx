import React, { useState } from "react";
import {
  Tooltip,
  Button,
  Classes,
  Dialog,
  Popover,
  PopoverInteractionKind
} from "@blueprintjs/core";
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
  if (phenotypes[rowIndex] === undefined || !phenotypes[rowIndex][field]) {
    return renderEmptyCell();
  }

  return <Cell>{phenotypes[rowIndex][field].substring(0, 10)}</Cell>;
};

const boolean = (phenotypes: Object[], field: string) => (rowIndex: number) => {
  if (phenotypes[rowIndex] === undefined || phenotypes[rowIndex][field]) {
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

const implementations = (phenotypes: Object[]) => (rowIndex: number) => {
  if (
    phenotypes[rowIndex] === undefined ||
    phenotypes[rowIndex].implementations === undefined
  ) {
    return renderEmptyCell();
  }

  const content = (inst, type, date) => {
    return (
      <div key={`${inst}-${date}`} className="pkb__impl">
        <div key="inst" className="pkb__impl__inst">
          {inst}
        </div>
        <div key="type" className="pkb__impl__type">
          {type}
        </div>
        <div key="ppv" className="pkb__impl__ppv">
          Cases PPV: ?, Control PPV: ?
        </div>
        <div key="date" className="pkb__impl__date">
          {date}
        </div>
      </div>
    );
  };

  return (
    <Cell>
      <React.Fragment>
        {phenotypes[rowIndex].implementations.map((impl, index) => (
          <div key={`${index}`}>
            {`${index + 1}. `}
            <Popover
              interactionKind={PopoverInteractionKind.HOVER}
              content={content(
                impl.institution,
                impl.algorithm_type,
                impl.date_uploaded
              )}
            >
              <div>{impl.title}</div>
            </Popover>
          </div>
        ))}
      </React.Fragment>
    </Cell>
  );
};

const references = (phenotypes: Object[]) => (rowIndex: number) => {
  if (
    phenotypes[rowIndex] === undefined ||
    phenotypes[rowIndex].references === undefined
  ) {
    return renderEmptyCell();
  }

  return (
    <Cell>
      <React.Fragment>
        {phenotypes[rowIndex].references.map((ref, index) => (
          <div key={`${index}`}>
            {`${index + 1}. `}
            <a
              target="_blank"
              href={`https://www.ncbi.nlm.nih.gov/pubmed/${ref.PMID}`}
            >
              {ref.title}
            </a>
          </div>
        ))}
      </React.Fragment>
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
  date,
  implementations,
  references
};
