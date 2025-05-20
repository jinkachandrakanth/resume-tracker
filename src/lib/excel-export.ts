import * as XLSX from 'xlsx';

/**
 * Detects if the app is running in a WebView
 */
const isWebView = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
        userAgent.includes('wv') || // Android WebView
        userAgent.includes('median') || // Median app
        (userAgent.includes('safari') && !userAgent.includes('chrome')) // iOS WebView
    );
};

/**
 * Detects if the app is running on Android
 */
const isAndroid = () => {
    return navigator.userAgent.toLowerCase().includes('android');
};

/**
 * Exports data to Excel file with multiple fallback methods for different platforms
 * @param data Array of objects to export
 * @param filename Name of the Excel file (without extension)
 */
export const exportToExcel = async (data: any[], filename: string): Promise<boolean> => {
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

        // Try different download methods based on platform
        if (isWebView()) {
            if (isAndroid()) {
                // Method 1: Try using FileReader with base64 (works in some Android WebViews)
                try {
                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });

                    // Create a temporary link and trigger download
                    const link = document.createElement('a');
                    link.href = base64;
                    link.download = `${filename}.xlsx`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    return true;
                } catch (error) {
                    console.log('Method 1 failed, trying Method 2');
                }

                // Method 2: Try using window.open with base64 (works in some Android WebViews)
                try {
                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });

                    window.open(base64, '_blank');
                    return true;
                } catch (error) {
                    console.log('Method 2 failed, trying Method 3');
                }

                // Method 3: Try using a temporary iframe (works in some Android WebViews)
                try {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);

                    const base64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });

                    if (iframe.contentWindow) {
                        const link = iframe.contentWindow.document.createElement('a');
                        link.href = base64;
                        link.download = `${filename}.xlsx`;
                        iframe.contentWindow.document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(iframe);
                        return true;
                    }
                } catch (error) {
                    console.log('Method 3 failed');
                }
            } else {
                // iOS WebView - usually works with standard method
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                return true;
            }
        } else {
            // Regular browser - use standard method
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return true;
        }

        // If all methods fail, show error
        console.error('All download methods failed');
        return false;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        return false;
    }
}; 