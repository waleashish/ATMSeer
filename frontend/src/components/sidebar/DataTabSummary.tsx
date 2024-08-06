import { DataTabSummaryProps } from '@/utils/interfaces';

// Styles for the color box
const colorBoxStyle = {
  width: '20px',
  height: '20px',
  marginRight: '12px'
};

const DataTabSummary = ({ numRows, numColumns, classSummary }: DataTabSummaryProps) => {
  return (
    <div id="summary">
      {/* Overview information */}
      <p>{`${numColumns} features / ${numRows} instances / ${classSummary.length} classes`}</p>
      
      {/* Feature distribution text */}
      <p>Feature Distribution</p>

      {/* Class summary list */}
      <ul>
        {classSummary.map((item, index) => (
          <li key={index} className="list-group-item d-flex align-items-center">
            {/* Color icon div */}
            <div className="flex flex-row">
              <div style={{ ...colorBoxStyle, backgroundColor: item.color }} />
              
              {/* Display count and class name */}
              <span style={{ color: 'black' }}>{item.count}</span>
              <span style={{ color: 'black' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;class = {item.className}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataTabSummary;
