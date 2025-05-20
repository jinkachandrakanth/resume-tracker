import * as XLSX from 'xlsx';

/**
 * Exports data to Excel file that works in both browsers and WebViews
 * @param data Array of objects to export
 * @param filename Name of the Excel file (without extension)
 */
export const exportToExcel = (data: any[], filename: string) => {
    try {
        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create workbook and add worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate Excel file as binary string
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        // Convert binary string to ArrayBuffer
        const arrayBuffer = new ArrayBuffer(excelBuffer.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < excelBuffer.length; i++) {
            view[i] = excelBuffer.charCodeAt(i) & 0xFF;
        }

        // Create Blob from ArrayBuffer
        const blob = new Blob([arrayBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Try different download methods
        try {
            // Method 1: Using URL.createObjectURL (works in most browsers)
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.log('Method 1 failed, trying Method 2');

            // Method 2: Using FileReader (works in some WebViews)
            const reader = new FileReader();
            reader.onload = function (e) {
                const dataUrl = e.target?.result;
                if (typeof dataUrl === 'string') {
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = `${filename}.xlsx`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
            reader.readAsDataURL(blob);
            return true;
        }
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        return false;
    }
}; 