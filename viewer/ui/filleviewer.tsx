import React from "react";

const FileViewer = props => {
  const { filepath } = props;

  const className = `pkb__fileviewer-${filepath ? "open" : "closed"}`;

  return <div className={className}>test</div>;
};

export default FileViewer;
