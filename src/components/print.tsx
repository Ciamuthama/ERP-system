// 'use client';

// import React, { useRef } from 'react';
// import { useReactToPrint } from 'react-to-print';
// import jsPDF from 'jspdf';
// import Image from 'next/image';

// const PrintComponent = ({ data, logo }) => {
//   const printRef = useRef(null);

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();

//     if (logo) {
//       doc.addImage(logo, 'PNG', 10, 10, 50, 20);
//     }

//     doc.text('Statement Data', 10, 40);
//     data.forEach((item, index) => {
//       doc.text(`${item.title}: ${item.value}`, 10, 50 + index * 10);
//     });

//     doc.save('statement.pdf');
//   };

//   return (
//     <div>
//       <div ref={printRef} className="p-4 border rounded bg-white">
//         {logo && <Image src={logo} alt="Organization Logo" width={100} height={50} />}
//         <h2 className="text-lg font-bold">Statement Data</h2>
//         <ul>
//           {data.map((item, index) => (
//             <li key={index} className="py-1">
//               <strong>{item.title}:</strong> {item.value}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="mt-4 flex gap-2">
//         <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded">Print</button>
//         <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-500 text-white rounded">Download PDF</button>
//       </div>
//     </div>
//   );
// };

// export default PrintComponent;
