# PDF Generator — Sales Report

This small tool renders a sales report HTML template and exports it to PDF using Puppeteer.

Usage

1. Open a terminal and change to the `pdf-generator` folder:

```bash
cd "C:\Users\sherli\Downloads\full project\pdf-generator"
```

2. Install dependencies:

```bash
npm install
```

3. Generate a PDF from the sample data:

```bash
npm run generate
```

4. Or run manually:

```bash
node generate.js sample-data.json output.pdf
```

Input format

The generator expects a JSON file with fields shown in `sample-data.json`. Main fields used:

- `companyName`, `companyLogo` (HTML allowed), `reportPeriod`, `generatedDateTime`
- `filters` (string)
- `summary` object (optional)
- `sales` array: items with `date`, `productName`, `quantity`, `unitPrice`, `totalAmount`

Customization

- Edit `template.html` to change layout, add charts (SVG/inline images), or change styling.
- For charts, generate images (e.g., via chart libraries) and include `<img>` tags in the template or summary.

Notes

- Puppeteer will download a Chromium binary during `npm install`.
- For server environments, consider using `puppeteer-core` with a system Chromium.
