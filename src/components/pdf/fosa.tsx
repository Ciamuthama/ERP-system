import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, marginHorizontal: "auto",height:"75vh", justifyContent:"space-between" },
  headerContainer: { flexDirection: "row",textAlign:"center", },
  logo: { width: "12%", height: "auto" },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: "1px solid #ddd",
 
  },
  sectionPrice: {
    marginVertical: 15,
    padding: 10,
    borderBottom: "1px solid #ddd",
    borderTop: "1px solid #ddd",
 
  },
  section1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderBottom: "1px solid #ddd",

  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tableHeaderContainer: {
    flexDirection: "row",
    borderBottom: "2px solid black",
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  tableCellHeader: { flex: 1, textAlign: "left", fontWeight: "bold" },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    borderBottom: "1px solid #ddd",
    marginVertical: 5,
  },
  tableCell: { flex: 1, textAlign: "left",fontSize:8,paddingHorizontal:1,alignItems:"center" ,justifyContent:"center",paddingVertical:5, marginVertical:6 },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 6,
    marginHorizontal: 20,
  },
});

export default function FosaStatementPDF({ data, sacco, member }) {
  if (!data || !member || !sacco) return null;

  // Filter credit and debit transactions
  const creditTransactions = data.filter((txn) => txn.type === "credit");
  const debitTransactions = data.filter((txn) => txn.type === "debit");

 
  const totalShares = creditTransactions.reduce((acc, txn) => acc + Number(txn.amount), 0);

  const sortedTransactions = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let runningBalance = Number(member.openingBalance) || 0;
    const transactionsWithBalance = sortedTransactions.map((txn) => {
      if (txn.type === "credit") {
        runningBalance += Number(txn.amount);
      } else if (txn.type === "debit") {
        runningBalance -= Number(txn.amount);
      }
      return { ...txn, balance: runningBalance };
    });
    

  const totalLoan = creditTransactions
    .filter((txn) => txn.description.includes("Education Loan"))
    .reduce((acc, txn) => acc + Number(txn.amount), 0);

  // Get Printed Date
  const printedDate = new Date().toLocaleString("en-KE", {
    dateStyle: "short",
  });

  return (
    <Document>
      <Page size="A4" wrap style={styles.page}>
    <View>

        <View style={styles.headerContainer}>
          {sacco &&
            sacco.map((item, index) =>
              item ? (
                <React.Fragment key={index}>
                  {item.logo && <Image src={item.logo} style={styles.logo} />}
                  <View
                    style={{
                      alignItems: "center",
                      textAlign: "center",
                      marginHorizontal: 9,
                    }}
                  >
                    <Text style={styles.title}>{item.companyName}</Text>
                    <Text>{item.email}</Text>
                    <Text>{item.address}</Text>
                    <Text>{item.telephone}</Text>
                  </View>
                </React.Fragment>
              ) : null
            )}
        </View>

      <Text style={styles.title}>Account Statement</Text>
        <View style={styles.section1}>
          <View>
            <Text>Member Name: {member.fullName}</Text>
            <Text>Member No: {member.memberNo}</Text>
            <Text>Account Number: {member.accountNumber}</Text>
          </View>
          <View>
            <Text>Telephone: {member.telephone}</Text>
            <Text>ID Number: {member.memId}</Text>
            <Text>
              Opening Balance:{" "}
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KSh",
              }).format(member.openingBalance)}
            </Text>
          </View>
        </View>

        {/* Transaction Table */}
        <View style={styles.section}>
          <Text style={styles.title}>Transaction Details</Text>

          {/* Table Headers */}
          <View style={styles.tableHeaderContainer}>
            <Text style={styles.tableCellHeader}>Date</Text>
            <Text style={styles.tableCellHeader}>Description</Text>
            <Text style={styles.tableCellHeader}>Credit</Text>
            <Text style={styles.tableCellHeader}>Debit</Text>
            <Text style={styles.tableCellHeader}>Balance</Text>
          </View>

          {/* Table Rows */}
          {transactionsWithBalance.length > 0 ? (
            transactionsWithBalance.map((txn, index) => (
              <View key={index} style={styles.transactionRow}>
                <Text style={styles.tableCell}>
                  {new Date(txn.date).toLocaleDateString("en-KE")}
                </Text>
                <Text style={styles.tableCell}>{txn.description} {txn.transactionType}</Text>
                <Text style={styles.tableCell}>
                  {txn.type === "credit"
                    ? new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KSh",
                      }).format(txn.amount)
                    : "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {txn.type === "debit"
                    ? new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KSh",
                      }).format(txn.amount)
                    : "0.00"}
                </Text>
                <Text style={styles.tableCell}>
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KSh",
                  }).format(txn.balance)}
                </Text>
              </View>
            ))
          ) : (
            <Text>No transactions available</Text>
          )}
        </View>

        
          <View style={styles.sectionPrice}>
            <Text>Total Credits: KSh {totalShares.toLocaleString()}.00</Text>
            <Text>Total Loan: KSH {totalLoan.toLocaleString()}.00</Text>
          </View>
          <View>
            <Text style={{ textAlign: "center", fontSize:6 }}>Print Date: {printedDate}</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            Failing receipt by the FOSA within 15 days from the day of dispatch
            of this statement with notice of the disagreement with any of the
            entries, will be assumed to be correct. Any communication should be
            addressed to the Chief Executive Officer and marked PRIVATE AND
            CONFIDENTIAL.
          </Text>
          <Text>Thank you for using our SACCO services.</Text>
          <Text style={{ textAlign: "right" }}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
