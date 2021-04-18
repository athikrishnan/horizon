export const PurchasePrintCss = `
body {
  background: rgb(204,204,204);
  -webkit-print-color-adjust: exact;
}
div[size="A4"] {
  background: white;
  width: 21cm;
  display: block;
  margin: 0 auto;
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
.close-button {
  background-color: #e7e7e7;
  border: none;
  color: black;
  padding: 8px 16px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 32px;
  width: 90%;
}
.left-50, .right-50 {
  width: 50%;
  border: 1px solid black;
}
.right-50 {
  border-left: none;
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
.totals {
  display: flex;
  justify-content: space-between;
  page-break-inside: avoid;
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 1mm;
}
th, td {
  text-align: right;
}
th.align-left, td.align-left {
  text-align: left;
}
.amount-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 2px;
}
.bb-1 {
  border-bottom: 1px solid black;
}
`;
