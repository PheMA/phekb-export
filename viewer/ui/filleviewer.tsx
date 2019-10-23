import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarHeading,
  NavbarGroup,
  NavbarDivider,
  Alignment,
  Button,
  Classes,
  NonIdealState
} from "@blueprintjs/core";
import CsvToJson from "csvtojson";

const API_ROOT = "http://localhost:3000";

const getUrl = (relativeUrl, phenotypeId) =>
  `${API_ROOT}/phenotype/${phenotypeId}${relativeUrl}`;

const PDFViewer = props => {
  return <iframe className="pkb__fileviewer__pdf" src={props.url} />;
};

const TextViewer = props => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(props.url)
      .then(res => res.text())
      .then(text => setText(text));
  });

  return (
    <div className="pkb__fileviewer__text__wrapper">
      <pre className="pkb__fileviewer__text__content bp3-running-text bp3-text-large bp3-code-block">
        {text}
      </pre>
    </div>
  );
};

const CSVViewer = props => {
  const [csv, setCsv] = useState([]);

  useEffect(() => {
    fetch(props.url)
      .then(res => res.text())
      .then(text => {
        CsvToJson()
          .fromString(text)
          .then(data => setCsv(data));
      });
  }, [props.url]);

  const renderTableHeader = cols => {
    return (
      <thead>
        <tr>
          {cols.map((column, i) => (
            <th key={`${i}${column}`}>{column}</th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderTableBody = (keys, rows) => {
    return (
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {keys.map((column, i) => (
              <td key={`${i}${row[column]}`}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  if (!csv.length) return null;

  return (
    <div className="pkb__fileviewer__csv__wrapper">
      <table className="pkb__fileviewer__csv__table bp3-html-table bp3-html-table-striped bp3-interactive">
        {renderTableHeader(Object.keys(csv[0]))}
        {renderTableBody(Object.keys(csv[0]), csv)}
      </table>
    </div>
  );
};

const renderFileViewer = fileObject => {
  if (fileObject.type === "application/pdf") {
    return <PDFViewer url={getUrl(fileObject.url, fileObject.phenotype.id)} />;
  } else if (fileObject.type === "text/plain") {
    return <TextViewer url={getUrl(fileObject.url, fileObject.phenotype.id)} />;
  } else if (fileObject.type === "text/csv") {
    return <CSVViewer url={getUrl(fileObject.url, fileObject.phenotype.id)} />;
  } else {
    return (
      <NonIdealState
        icon="error"
        title="Unsuppored File Type"
        description="Cannot render this type of file right now."
      />
    );
  }
};

const FileViewer = props => {
  const { fileObject, setFileObject } = props;

  if (!fileObject.url) return <div className="pkb__fileviewer"></div>;
  return (
    <div className="pkb__fileviewer">
      <Navbar>
        <NavbarGroup>
          <NavbarHeading className="bp3-text-overflow-ellipsis">
            {fileObject.phenotype && fileObject.phenotype.name}
          </NavbarHeading>
          <NavbarDivider />
          <NavbarHeading>
            <span className="bp3-text-overflow-ellipsis">
              {fileObject.name}
            </span>
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Button
            onClick={() => setFileObject({})}
            className={Classes.MINIMAL}
            icon="cross"
          />
        </NavbarGroup>
      </Navbar>
      {renderFileViewer(fileObject)}
    </div>
  );
};

export default FileViewer;
