import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Tracker.css";
import fire from "../../config/Fire";
import Transaction from "./Transaction/Transaction";

class Tracker extends Component {
  state = {
    transactions: [],
    money: 0,
    totalIncome: 0, // Added totalIncome state
    totalExpenses: 0, // Added totalExpenses state
    transactionName: "",
    transactionType: "",
    price: "",
    selectedDate: null,
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    const currentUID = fire.auth().currentUser.uid;
    const transactionsRef = fire.database().ref("Transactions/" + currentUID);

    transactionsRef.on("value", (snapshot) => {
      let totalMoney = 0;
      let totalIncome = 0;
      let totalExpenses = 0;
      const transactions = [];
      snapshot.forEach((childSnapshot) => {
        const transaction = childSnapshot.val();
        transactions.push({ ...transaction, id: childSnapshot.key });

        const amount = parseFloat(transaction.price);
        if (transaction.type === "deposit") {
          totalIncome += amount;
        } else if (transaction.type === "expense") {
          totalExpenses += amount;
        }

        totalMoney +=
          transaction.type === "deposit" ? amount : -amount;
      });

      this.setState({
        transactions,
        money: totalMoney,
        totalIncome,
        totalExpenses,
      });
    });
  };

  handleChange = (input) => (e) => {
    this.setState({
      [input]: e.target.value,
    });
  };

  handleDateChange = (date) => {
    this.setState({
      selectedDate: date,
    });
  };

  addNewTransaction = () => {
    const { transactionName, transactionType, price, selectedDate } = this.state;

    // Validation
    if (transactionName && transactionType && price && selectedDate) {
      const currentUID = fire.auth().currentUser.uid;
      const newTransaction = {
        name: transactionName,
        type: transactionType,
        price: parseFloat(price),
        user_id: currentUID,
        date: selectedDate.toLocaleDateString("en-GB"),
      };

      const transactionsRef = fire.database().ref("Transactions/" + currentUID);

      transactionsRef
        .push(newTransaction)
        .then(() => {
          // Transaction added successfully, update state and clear input fields
          this.setState({
            transactionName: "",
            transactionType: "",
            price: "",
            selectedDate: null,
          });
        })
        .catch((error) => {
          // Handle and log the error
          console.error("Error adding transaction:", error);
        });
    }
  };

  handleDeleteTransaction = (transactionId) => {
    const currentUID = fire.auth().currentUser.uid;
    const transactionsRef = fire.database().ref("Transactions/" + currentUID);

    transactionsRef
      .child(transactionId)
      .remove()
      .then(() => {
        // Transaction deleted successfully, update state
        const updatedTransactions = this.state.transactions.filter(
          (transaction) => transaction.id !== transactionId
        );

        this.setState({
          transactions: updatedTransactions,
        });
      })
      .catch((error) => {
        // Handle and log the error
        console.error("Error deleting transaction:", error);
      });
  };

  logout = () => {
    fire.auth().signOut();
  };

  render() {
    const currentUser = fire.auth().currentUser;

    return (
      <div className="trackerBlock">
        <div className="welcome">
          <span>Hi, {currentUser.displayName}!</span>
          <button className="exit" onClick={this.logout}>
            LOGOUT
          </button>
        </div>
        <div className="totalMoney">₹{this.state.money}</div>
        <div className="totalIncome">Total Income: ₹{this.state.totalIncome}</div>
        <div className="totalExpenses">Total Expenses: ₹{this.state.totalExpenses}</div>

        <div className="newTransactionBlock">
          <div className="newTransaction">
            <form>
              <input
                onChange={this.handleChange("transactionName")}
                value={this.state.transactionName}
                placeholder="Transaction Name"
                type="text"
                name="transactionName"
              />
              <div className="inputGroup">
                <select
                  name="type"
                  onChange={this.handleChange("transactionType")}
                  value={this.state.transactionType}
                >
                  <option value="">Type</option>
                  <option value="expense">Expense</option>
                  <option value="deposit">Deposit</option>
                </select>
                <input
                  onChange={this.handleChange("price")}
                  value={this.state.price}
                  placeholder="Price"
                  type="text"
                  name="price"
                />
              </div>
              <div className="calendarInput">
                <DatePicker
                  selected={this.state.selectedDate}
                  onChange={this.handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date (dd/mm/yyyy)"
                />
              </div>
            </form>
            <button onClick={this.addNewTransaction} className="addTransaction">
              + Add Transaction
            </button>
          </div>
        </div>

        <div className="latestTransactions">
          <p>Latest Transactions</p>
          <ul>
            {this.state.transactions.map((transaction, index) => (
              <Transaction
                key={index}
                id={transaction.id} // Pass a unique identifier for the transaction
                type={transaction.type}
                name={transaction.name}
                price={transaction.price}
                date={transaction.date}
                onDelete={this.handleDeleteTransaction} // Pass a delete handler function
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Tracker;