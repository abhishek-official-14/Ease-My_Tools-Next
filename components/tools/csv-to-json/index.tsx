"use client";

import React, { useState } from 'react';
import styles from './styles.module.css';

const CSVtoJSON = () => {
    const [csvInput, setCsvInput] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    const [delimiter, setDelimiter] = useState(',');
    const [hasHeaders, setHasHeaders] = useState(true);

    const convertCSVtoJSON = () => {
        if (!csvInput.trim()) {
            alert("Please enter CSV data" || 'Please enter CSV data');
            return;
        }

        try {
            const lines = csvInput.trim().split('\n');
            const result = [];
            
            let headers = [];
            if (hasHeaders) {
                headers = lines[0].split(delimiter).map(header => header.trim());
            } else {
                // Generate headers like col1, col2, col3...
                headers = lines[0].split(delimiter).map((_, index) => `col${index + 1}`);
            }

            const startLine = hasHeaders ? 1 : 0;
            
            for (let i = startLine; i < lines.length; i++) {
                const currentLine = lines[i].trim();
                if (!currentLine) continue;

                const values = currentLine.split(delimiter);
                const obj = {};
                
                headers.forEach((header, index) => {
                    let value = values[index] ? values[index].trim() : '';
                    
                    // Try to parse numbers and booleans
                    if (!isNaN(value) && value !== '') {
                        value = Number(value);
                    } else if (value.toLowerCase() === 'true') {
                        value = true;
                    } else if (value.toLowerCase() === 'false') {
                        value = false;
                    } else if (value === 'null') {
                        value = null;
                    }
                    
                    obj[header] = value;
                });
                
                result.push(obj);
            }

            setJsonOutput(JSON.stringify(result, null, 2));
        } catch (error) {
            alert("Error converting CSV to JSON" || 'Error converting CSV to JSON: ' + error.message);
        }
    };

    const convertJSONtoCSV = () => {
        if (!jsonOutput.trim()) {
            alert("Please enter JSON data" || 'Please enter JSON data');
            return;
        }

        try {
            const data = JSON.parse(jsonOutput);
            if (!Array.isArray(data)) {
                alert("JSON must be an array of objects" || 'JSON must be an array of objects');
                return;
            }

            if (data.length === 0) {
                setCsvInput('');
                return;
            }

            const headers = Object.keys(data[0]);
            let csv = '';

            if (hasHeaders) {
                csv += headers.join(delimiter) + '\n';
            }

            data.forEach(row => {
                const values = headers.map(header => {
                    let value = row[header];
                    if (value === null || value === undefined) {
                        value = '';
                    } else if (typeof value === 'object') {
                        value = JSON.stringify(value);
                    } else {
                        value = String(value);
                    }
                    
                    // Handle values containing delimiter or newlines
                    if (value.includes(delimiter) || value.includes('\n') || value.includes('"')) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                    
                    return value;
                });
                
                csv += values.join(delimiter) + '\n';
            });

            setCsvInput(csv.trim());
        } catch (error) {
            alert("Invalid JSON" || 'Invalid JSON: ' + error.message);
        }
    };

    const clearAll = () => {
        setCsvInput('');
        setJsonOutput('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!" || 'Copied to clipboard!');
    };

    const downloadFile = (content, filename, contentType) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const downloadCSV = () => {
        if (!csvInput) return;
        downloadFile(csvInput, 'data.csv', 'text/csv');
    };

    const downloadJSON = () => {
        if (!jsonOutput) return;
        downloadFile(jsonOutput, 'data.json', 'application/json');
    };

    return (
        <div className={styles["csv-json-converter"]}>
            <div className={styles["converter-header"]}>
                <h1>{"CSV to JSON Converter"}</h1>
                <p>{"Convert between CSV and JSON formats"}</p>
            </div>

            <div className={styles["converter-container"]}>
                <div className={styles["settings-panel"]}>
                    <div className={styles["setting"]}>
                        <label>{"Delimiter"}</label>
                        <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
                            <option value=",">, {"Comma"}</option>
                            <option value=";">; {"Semicolon"}</option>
                            <option value="\t">\t {"Tab"}</option>
                            <option value="|">| {"Pipe"}</option>
                        </select>
                    </div>
                    <div className={styles["setting"]}>
                        <label>
                            <input
                                type="checkbox"
                                checked={hasHeaders}
                                onChange={(e) => setHasHeaders(e.target.checked)}
                            />
                            {"First row contains headers"}
                        </label>
                    </div>
                </div>

                <div className={styles["input-output-section"]}>
                    <div className={styles["input-section"]}>
                        <label>{"CSV Input"}</label>
                        <textarea
                            value={csvInput}
                            onChange={(e) => setCsvInput(e.target.value)}
                            placeholder={"Paste your CSV data here..."}
                            className={styles["text-input"]}
                            rows={8}
                        />
                        <div className={styles["input-actions"]}>
                            <button onClick={downloadCSV} className={styles["download-btn"]} disabled={!csvInput}>
                                {"Download CSV"}
                            </button>
                            <button onClick={() => copyToClipboard(csvInput)} className={styles["copy-btn"]} disabled={!csvInput}>
                                {"Copy CSV"}
                            </button>
                        </div>
                    </div>

                    <div className={styles["conversion-buttons"]}>
                        <button onClick={convertCSVtoJSON} className={styles["convert-btn"]}>
                            {"CSV → JSON"}
                        </button>
                        <button onClick={convertJSONtoCSV} className={styles["convert-btn"]}>
                            {"JSON → CSV"}
                        </button>
                    </div>

                    <div className={styles["output-section"]}>
                        <label>{"JSON Output"}</label>
                        <textarea
                            value={jsonOutput}
                            onChange={(e) => setJsonOutput(e.target.value)}
                            placeholder={"JSON output will appear here..."}
                            className={styles["text-output"]}
                            rows={8}
                        />
                        <div className={styles["output-actions"]}>
                            <button onClick={downloadJSON} className={styles["download-btn"]} disabled={!jsonOutput}>
                                {"Download JSON"}
                            </button>
                            <button onClick={() => copyToClipboard(jsonOutput)} className={styles["copy-btn"]} disabled={!jsonOutput}>
                                {"Copy JSON"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles["action-buttons"]}>
                    <button onClick={clearAll} className={styles["clear-btn"]}>
                        {"Clear All"}
                    </button>
                </div>

                <div className={styles["info-section"]}>
                    <h4>{"About CSV and JSON"}</h4>
                    <p><strong>CSV</strong> {"(Comma-Separated Values) is a simple file format used to store tabular data."}</p>
                    <p><strong>JSON</strong> {"(JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write."}</p>
                    
                    <h5>{"Common Uses:"}</h5>
                    <ul>
                        <li>{"Data migration between systems"}</li>
                        <li>{"Exporting data from databases"}</li>
                        <li>{"API data formatting"}</li>
                        <li>{"Spreadsheet data processing"}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CSVtoJSON;



// import React, { useState, useRef } from 'react';
// 
// import { useTheme } from 'next-themes';
// import styles from './styles.module.css';

// const CsvToJson = () => {
//     const { t } = useTranslation('csvToJson');
//     const { theme } = useTheme();
//     const [csvInput, setCsvInput] = useState('');
//     const [jsonOutput, setJsonOutput] = useState('');
//     const [delimiter, setDelimiter] = useState(',');
//     const [firstRowHeader, setFirstRowHeader] = useState(true);
//     const [conversionInfo, setConversionInfo] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef(null);

//     const delimiters = {
//         ',': "Comma",
//         ';': "Semicolon",
//         '\t': "Tab",
//         '|': "Pipe"
//     };

//     const parseCSV = (text) => {
//         const lines = text.split('\n').filter(line => line.trim() !== '');
//         if (lines.length === 0) return [];

//         const headers = firstRowHeader 
//             ? lines[0].split(delimiter).map(header => header.trim())
//             : lines[0].split(delimiter).map((_, index) => `column${index + 1}`);

//         const startIndex = firstRowHeader ? 1 : 0;
//         const result = [];

//         for (let i = startIndex; i < lines.length; i++) {
//             const currentLine = lines[i];
//             const values = currentLine.split(delimiter);
//             const obj = {};

//             headers.forEach((header, index) => {
//                 obj[header] = values[index] ? values[index].trim() : '';
//             });

//             result.push(obj);
//         }

//         setConversionInfo({
//             rowsConverted: result.length,
//             columnsDetected: headers.length,
//             headers: headers
//         });

//         return result;
//     };

//     const convertToJson = () => {
//         try {
//             if (!csvInput.trim()) {
//                 alert('Please enter CSV data or upload a file');
//                 return;
//             }

//             const jsonData = parseCSV(csvInput);
//             setJsonOutput(JSON.stringify(jsonData, null, 2));
//         } catch (error) {
//             alert('Error converting CSV to JSON: ' + error.message);
//         }
//     };

//     const handleFileUpload = (file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             setCsvInput(e.target.result);
//         };
//         reader.readAsText(file);
//     };

//     const handleFileSelect = (event) => {
//         const file = event.target.files[0];
//         if (file && file.type === 'text/csv') {
//             handleFileUpload(file);
//         } else {
//             alert('Please select a valid CSV file');
//         }
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const file = e.dataTransfer.files[0];
//         if (file && file.type === 'text/csv') {
//             handleFileUpload(file);
//         } else {
//             alert('Please drop a valid CSV file');
//         }
//     };

//     const clearAll = () => {
//         setCsvInput('');
//         setJsonOutput('');
//         setConversionInfo(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     const copyJson = () => {
//         navigator.clipboard.writeText(jsonOutput);
//         alert('JSON copied to clipboard!');
//     };

//     const downloadJson = () => {
//         const blob = new Blob([jsonOutput], { type: 'application/json' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'converted.json';
//         a.click();
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <div className={styles["csv-to-json"]}>
//             <div className={styles["tool-header"]}>
//                 <h1>{"CSV to JSON Converter"}</h1>
//                 <p>{"Convert between CSV and JSON formats"}</p>
//             </div>

//             <div className={styles["converter-container"]}>
//                 <div className={styles["input-section"]}>
//                     <div className={styles["upload-section"]}>
//                         <div 
//                             className={`${styles["drop-zone"]} ${isDragging ? 'dragging' : ''}`}
//                             onDragOver={handleDragOver}
//                             onDragLeave={handleDragLeave}
//                             onDrop={handleDrop}
//                         >
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept=".csv"
//                                 onChange={handleFileSelect}
//                                 className={styles["file-input"]}
//                             />
//                             <div className={styles["upload-text"]}>
//                                 <span className={styles["upload-icon"]}>📁</span>
//                                 <span>{t('uploadCsv')}</span>
//                                 <span className={styles["drag-text"]}>{t('dragDrop')}</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className={styles["csv-input-section"]}>
//                         <label>{"CSV Input"}</label>
//                         <textarea
//                             value={csvInput}
//                             onChange={(e) => setCsvInput(e.target.value)}
//                             placeholder={"Paste your CSV data here..."}
//                             rows={8}
//                         />
//                     </div>
//                 </div>

//                 <div className={styles["settings-section"]}>
//                     <div className={styles["setting-group"]}>
//                         <label>{"Delimiter"}</label>
//                         <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
//                             {Object.entries(delimiters).map(([value, label]) => (
//                                 <option key={value} value={value}>{label}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className={styles["setting-group"]}>
//                         <label className={styles["checkbox-label"]}>
//                             <input
//                                 type="checkbox"
//                                 checked={firstRowHeader}
//                                 onChange={(e) => setFirstRowHeader(e.target.checked)}
//                             />
//                             {t('firstRowHeader')}
//                         </label>
//                     </div>
//                 </div>

//                 <div className={styles["action-buttons"]}>
//                     <button onClick={convertToJson} className={styles["primary-btn"]}>
//                         {t('convert')}
//                     </button>
//                     <button onClick={clearAll} className={styles["secondary-btn"]}>
//                         {t('clear')}
//                     </button>
//                 </div>

//                 {conversionInfo && (
//                     <div className={styles["conversion-info"]}>
//                         <h3>{t('conversionInfo')}</h3>
//                         <div className={styles["info-grid"]}>
//                             <div className={styles["info-item"]}>
//                                 <span className={styles["info-label"]}>{t('rowsConverted')}:</span>
//                                 <span className={styles["info-value"]}>{conversionInfo.rowsConverted}</span>
//                             </div>
//                             <div className={styles["info-item"]}>
//                                 <span className={styles["info-label"]}>{t('columnsDetected')}:</span>
//                                 <span className={styles["info-value"]}>{conversionInfo.columnsDetected}</span>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {jsonOutput && (
//                     <div className={styles["output-section"]}>
//                         <div className={styles["output-header"]}>
//                             <h3>{"JSON Output"}</h3>
//                             <div className={styles["output-actions"]}>
//                                 <button onClick={copyJson} className={styles["copy-btn"]}>
//                                     {t('copyJson')}
//                                 </button>
//                                 <button onClick={downloadJson} className={styles["download-btn"]}>
//                                     {t('downloadJson')}
//                                 </button>
//                             </div>
//                         </div>
//                         <pre className={styles["json-output"]}>{jsonOutput}</pre>
//                     </div>
//                 )}

//                 <div className={styles["csv-tips"]}>
//                     <h4>{t('csvTips')}</h4>
//                     <ul>
//                         <li>{t('tip1')}</li>
//                         <li>{t('tip2')}</li>
//                         <li>{t('tip3')}</li>
//                         <li>{t('tip4')}</li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CsvToJson;