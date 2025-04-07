import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, marginHorizontal: "auto", height: "100vh" },
  headerContainer: { flexDirection: "row", width: "80%" },
  logo: { width: "20%", height: "auto" },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: "1px solid #ddd",
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
  tableCellHeader: { flex: 1, textAlign: "center", fontWeight: "bold" },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    paddingBottom: 3,
    marginBottom: 3,
  },
  tableCell: { flex: 1, textAlign: "center",fontSize:8 },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    marginHorizontal: 20,
  },
});

export default function FosaStatementPDF({ data, sacco, member }) {
  if (!data || !member || !sacco) return null;

  // Filter credit and debit transactions
  const creditTransactions = data.filter((txn) => txn.type === "credit");
  const debitTransactions = data.filter((txn) => txn.type === "debit");

  // Calculate total shares (sum of credit transactions / 4)
  const totalShares =
    creditTransactions.reduce((acc, txn) => acc + Number(txn.amount), 0) / 4;

  // Calculate balance dynamically
  let runningBalance = Number(member.openingBalance) || 0;
  const transactionsWithBalance = [...creditTransactions, ...debitTransactions].map((txn) => {
    if (txn.type === "credit") {
      runningBalance += Number(txn.amount);
    } else if (txn.type === "debit") {
      runningBalance -= Number(txn.amount);
    }
    return { ...txn, balance: runningBalance };
  });

  const totalLoan = creditTransactions.reduce(
    (acc, txn) => acc + Number(txn.amount),
    0
  );

  // Get Printed Date
  const printedDate = new Date().toLocaleString("en-KE", {
    dateStyle: "short",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* SACCO Logo & Details */}
        <View style={styles.headerContainer}>
          {sacco[0].logo && <Image src={sacco[0].logo} style={styles.logo} />}
          <View
            style={{
              alignItems: "center",
              textAlign: "center",
              marginHorizontal: "auto",
            }}
          >
            <Text style={styles.title}>{sacco[0].companyName}</Text>
            <Text>{sacco[0].email}</Text>
            <Text>
              {sacco[0].address}
            </Text>
            <Text >{sacco[0].telephone}</Text>
          </View>
        </View>

        {/* Statement Title */}
        <Text style={styles.title}>Account Statement</Text>

        {/* Member Info */}
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
                  {new Date(txn.date).toLocaleDateString()}
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

        {/* Shares Calculation */}
        <View style={styles.section}>
          <Text>Total Shares: KSh {totalShares.toLocaleString()}.00</Text>
          <Text>Total Loan: KSH {totalLoan.toLocaleString()}.00</Text>
        </View>
        <View>
          <Text style={{ textAlign: "center" }}>Print Date: {printedDate}</Text>
        </View>

        <View style={styles.footer}>
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
