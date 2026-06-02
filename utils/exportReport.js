import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportToPDF(data, columns, title = "Report") {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, 14, 30);

    const tableColumn = columns.map((col) => col.header);
    const tableRows = data.map((row) =>
        columns.map((col) => row[col.key] ?? "")
    );

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 36,
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        headStyles: {
            fillColor: [99, 102, 241],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250],
        },
    });

    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export function exportToExcel(data, columns, title = "Report") {
    const sheetData = data.map((row) => {
        const obj = {};
        columns.forEach((col) => {
            obj[col.header] = row[col.key] ?? "";
        });
        return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // Auto-width columns
    const colWidths = columns.map((col) => ({
        wch: Math.max(
            col.header.length,
            ...data.map((row) => String(row[col.key] ?? "").length)
        ) + 2,
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_")}.xlsx`);
}
