const fs = require('fs');
const PDFDocument = require('pdfkit');
const csv = require('csv-parser');
const path = require('path');

// Function to create ID cards
function createIDCards(templateImagePath, csvFilePath, photoDirectory, outputFilePath) {
    const doc = new PDFDocument({ autoFirstPage: false });
    const templateImage = path.join(__dirname, templateImagePath);
    const photoDir = path.join(__dirname, photoDirectory);
    const outputStream = fs.createWriteStream(outputFilePath);

    // Pipe the PDF to the output file
    doc.pipe(outputStream);

    // Read employee data from CSV
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
            // Start a new page for each employee
            doc.addPage({ size: [300, 480] }); // Standard ID card size

            // Draw template image
            doc.image(templateImage, 0, 0, { width: 300 });

            // Load employee photo
            const photoPath = path.join(photoDir, data.photo);
            doc.image(photoPath, 50, 120, { width: 200 });

            // Add employee details
            doc.font('Helvetica').fontSize(12);
            doc.text(data.name, 50, 50);
            doc.text(data.title, 50, 70);
        })
        .on('end', () => {
            // Finalize the PDF
            doc.end();
            console.log('PDF created successfully!');
        });
}

// Usage: createIDCards(templateImagePath, csvFilePath, photoDirectory, outputFilePath)
createIDCards('ute_id_template.png', 'employees.csv', 'photos', 'id_cards.pdf');
