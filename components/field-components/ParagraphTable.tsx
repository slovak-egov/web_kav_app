import classNames from 'classnames';
import React from 'react';

interface TableObject {
  [key: number]: {
    [key: number]: string;
    weight: string;
  };
  caption: string;
}

type TableData = { data: string[][]; removed: boolean };

const Table = ({ children }) => {
  return (
    <div className="w-full overflow-auto max-h-[50vh] idsk-text-body border border-neutral-300 rounded bg-neutral-90">
      <table className="table-auto w-full">
        <tbody className="w-full">{children}</tbody>
      </table>
    </div>
  );
};

const TableRow = ({ children, headRow }) => {
  const rowClasses = classNames('border-b border-neutral-300 last:border-none', {
    'font-bold': !!headRow
  });
  return <tr className={rowClasses}>{children}</tr>;
};

const TableCell = ({ children, maxWordLength = 25 }) => {
  const words = children.split(' ');
  let newWords: string[] = [];

  if (!!words.length) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      if (word.length > maxWordLength) {
        for (let j = 0; j < word.length; j += maxWordLength) {
          newWords.push(word.slice(j, j + maxWordLength));
        }
      } else {
        newWords.push(word);
      }
    }
  } else {
    newWords = words;
  }

  return (
    <td className="px-4 py-2 break-keep border-r border-neutral-300 last:border-none text-left align-top">
      {newWords.join(' ')}
    </td>
  );
};

export default function ParagraphTable(props) {
  const title = props?.field_title;
  const header = props?.field_table_header;
  const value = props?.field_table_content.value;
  const footer = props?.field_table_footer;

  const mapObjectTo2dArray = (object: TableObject): string[][] => {
    return Object.values(object)
      .slice(0, -1)
      .map((obj) => Object.values(obj));
  };

  const sortByWeight = (tableData: string[][]): string[][] => {
    return tableData.sort((a, b) => {
      const aLast = parseInt(a[a.length - 1]);
      const bLast = parseInt(b[b.length - 1]);
      if (aLast < bLast) {
        return -1;
      } else if (aLast > bLast) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const removeWeight = (tableData: string[][]): string[][] => {
    return tableData.map((inner) => inner.slice(0, -1));
  };

  const removeEmptyHeaderRow = (tableData: string[][]): TableData => {
    const data = tableData;
    const firstArray = data[0];
    let removed = false;

    if (firstArray.every((val) => val === '')) {
      data.shift();
      removed = true;
    }

    return { data: data, removed: removed };
  };

  const { data, removed } = removeEmptyHeaderRow(
    removeWeight(sortByWeight(mapObjectTo2dArray(value)))
  );

  const mapTextLines = (text) => {
    const lines = text.split(/\r?\n/);

    return lines.map((line, index) =>
      !!line.length ? (
        <span className="block" key={index}>
          {line}
        </span>
      ) : (
        <br />
      )
    );
  };

  return (
    <div className="grid grid-cols-1">
      {!!title && <h2 className="mb-4">{title}</h2>}
      {!!header && <h3 className="mb-6">{mapTextLines(header)}</h3>}
      <Table>
        {data.map((row, rIndex) => (
          <TableRow key={rIndex} headRow={rIndex === 0 && removed === false}>
            {row.map((cell, cIndex) => (
              <TableCell key={cIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </Table>
      {!!footer?.length && (
        <div className="w-full idsk-text-body mt-5">
          <div className="w-fit ml-auto">{mapTextLines(footer)}</div>
        </div>
      )}
    </div>
  );
}
