// import './App.css'
// import { useState } from 'react'
// import axios from 'axios';

// function App() {
//   const [columns, setColumns] = useState([]);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleFileUpload = async () => {
//     if (!file) {
//       alert('Please select a file first.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:3001/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setColumns(response.data.columns);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   const handleColumnChange = (event) => {
//     const { value, checked } = event.target;
//     setSelectedColumns(prev =>
//       checked ? [...prev, value] : prev.filter(col => col !== value)
//     );
//   };

//   const handleProcessData = async () => {
//     try {
//       await axios.post('http://localhost:3001/process', { columns: selectedColumns });
//       const data = await response.data
//       console.log(data)
//       alert('Data processed successfully.');
//     } catch (error) {
//       console.error('Error processing data:', error);
//     }
//   };

//   return (
//     <>
//       <div>
//       <h1>Upload and Process Spreadsheet</h1>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleFileUpload}>Upload</button>
//       <div>
//         <h2>Select Columns</h2>
//         {columns?.map(column => (
//           <div key={column}>
//             <input
//               type="checkbox"
//               id={column}
//               value={column}
//               onChange={handleColumnChange}
//             />
//             <label htmlFor={column}>{column}</label>
//           </div>
//         ))}
//       </div>
//       <button onClick={handleProcessData}>Process Data</button>
//     </div>
//     </>
//   )
// }

// export default App

import { useState } from 'react';
import axios from 'axios';

function App() {
  const [columns, setColumns] = useState([]);
    const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // const handleFileUpload = async () => {
  //   if (!file) {
  //     alert('Please select a file first.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('http://localhost:3001/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     setColumns(response.data.columns);
  //     setData(response.data.data); // Store data for preview and selection
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };
  const handleFileUpload = async () => {
        if (!file) {
          alert('Please select a file first.');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await axios.post('https://spreadsheet-to-json-converter.vercel.app/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setColumns(response.data.columns);
          setData(response.data.data); // Store data for preview and selection
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };

  const handleColumnChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColumns(prev =>
      checked ? [...prev, value] : prev.filter(col => col !== value)
    );
  };

  const handleRowSelection = (index) => {
    setSelectedRows(prev => 
      prev.includes(index) ? prev.filter(rowIndex => rowIndex !== index) : [...prev, index]
    );
  };

  const handleSaveSelected = async () => {
    try {
      const selectedData = selectedRows.map(rowIndex => data[rowIndex]);
      await axios.post('https://spreadsheet-to-json-converter.vercel.app/save', { data: selectedData });
      alert('Selected data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-full">
    <div className="App flex flex-col justify-start items-center gap-5">
      <h1 className="py-2">Upload and Process Spreadsheet</h1>
      <div className="flex">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange}/>
      <button onClick={handleFileUpload}>Upload</button>
      </div>
      <div>
        <h2>Select Columns</h2>
        {columns.map(column => (
          <div key={column}>
            <input
              type="checkbox"
              id={column}
              value={column}
              onChange={handleColumnChange}
            />
            <label htmlFor={column}>{column}</label>
          </div>
        ))}
      </div>

      <button onClick={handleSaveSelected}>Save Selected Data</button>

      {/* Data Preview with Row Selection */}
      <div>
        <h2>Data Preview</h2>
        <table>
          <thead>
            <tr>
              {columns?.map(column => (
                <th key={column}>{column}</th>
              ))}
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <tr key={index}>
                {columns?.map(column => (
                  <td key={column}>{row[column]}</td>
                ))}
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleRowSelection(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default App;
