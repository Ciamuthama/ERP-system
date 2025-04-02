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
  page: { padding: 20, fontSize: 12 },
  headerContainer: { alignItems: "center", marginBottom: 10 },
  logo: { width: 60, height: "auto", marginBottom: 5 },
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
  tableCell: { flex: 1, textAlign: "center" },
});

export default function FosaStatementPDF({ data, sacco, member }) {
  if (!data || !member || !sacco) return null;

  // Filter credit transactions
  const creditTransactions = data.filter((txn) => txn.type === "credit");

  // Calculate total shares (sum of credit transactions / 4)
  const totalShares =
    creditTransactions.reduce((acc, txn) => acc + Number(txn.amount), 0) / 4;

  // Calculate balance dynamically
  let runningBalance = Number(member.openingBalance) || 0;
  const transactionsWithBalance = creditTransactions.map((txn) => {
    runningBalance += Number(txn.amount);
    return { ...txn, balance: runningBalance };
  });

  const totalLoan = creditTransactions.reduce((acc, txn) => acc + Number(txn.amount), 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* SACCO Logo & Details */}
        <View style={styles.headerContainer}>
          {sacco[0].logo && <Image src={sacco[0].logo} style={styles.logo} />}
          <Text style={styles.title}>{sacco[0].companyName}</Text>
          <Text>{sacco[0].address}</Text>
        </View>

        {/* Statement Title */}
        <Text style={styles.title}>Statement</Text>

        {/* Member Info */}
        <View style={styles.section1}>
          <View>
            {" "}
            <Text>Member Name: {member.fullName}</Text>
            <Text>Member No: {member.memberNo}</Text>
            <Text>Account Number: {member.accountNo}</Text>
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
            <Text style={styles.tableCellHeader}>Balance</Text>
          </View>

          {/* Table Rows */}
          {transactionsWithBalance.length > 0 ? (
            transactionsWithBalance.map((txn, index) => (
              <View key={index} style={styles.transactionRow}>
                <Text style={styles.tableCell}>
                  {new Date(txn.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.tableCell}>{txn.description}</Text>
                <Text style={styles.tableCell}>
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KSh",
                  }).format(txn.amount)}
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
            <Text>No credit transactions available</Text>
          )}
        </View>

        {/* Shares Calculation */}
        <View style={styles.section}>
          <Text>Total Shares: KSh {totalShares.toLocaleString()}</Text>
          <Text>Total Loan: KSH {totalLoan.toLocaleString()}</Text>
        </View>

        {/* Footer */}
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Thank you for using our SACCO services.
        </Text>
      </Page>
    </Document>
  );
}
