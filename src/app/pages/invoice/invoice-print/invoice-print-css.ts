export const InvoicePrintCss = `
body {
  background: rgb(204,204,204);
  -webkit-print-color-adjust: exact;
}
div[size="A4"] {
  background: white;
  width: 21cm;
  height: 29.7cm;
  display: block;
  margin: 0 auto;
  border: 1px solid black;
}
@media print {
  body, div[size="A4"] {
    margin: 0;
    box-shadow: 0;
  }
  .no-print, .no-print * {
    display: none !important;
  }
}
.left-50, .right-50 {
  width: 50%;
  border: 1px solid black;
  border-top: none;
  height: 56mm;
}
.left-50 {
  border-left: none;
}
.right-50 {
  border-left: none;
  border-right: none;
}
.company-name {
  text-transform: uppercase;
  margin: 3mm 0;
}
.content {
  padding: 1mm;
}
.light-header, .dark-header {
  display: block;
  padding: 1mm;
  background-color: #e4e4e4;
}
.dark-header {
  background-color: #545454;
  color: white;
}
.particulars {
  height: 185mm;
}
.particular {
  display: flex;
  justify-content: space-between;
  padding: 1mm;
  min-height: fit-content;
  margin: 6px 0;
}
`;
