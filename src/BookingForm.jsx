import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const countries = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Japan", code: "+81" },
  { name: "China", code: "+86" },
  { name: "Brazil", code: "+55" },
  { name: "South Africa", code: "+27" },
];

const roomTypes = [
  "2 Bed Non-AC Room",
  "2 Bed AC Room",
  "3 Bed Non-AC Room",
  "3 Bed AC Room",
  "4 Bed Non-AC Room",
  "4 Bed AC Room",
  "5 Bed Non-AC Room",
  "5 Bed AC Room"
];
const paymentMethods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash", "PayPal"];
const bookingViaOptions = ["Direct", "Phone", "Booking.com", "Agoda"];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "+91",
    country: "India",
    bookingVia: "",
    roomQuantity: 1,
    selectedRooms: [""],
    checkInDate: "",
    checkOutDate: "",
    numberOfDays: 0,
    totalAmount: "",
    amountPaid: "",
    balanceAmount: "0",
    paymentMethod: "",
    transactionId: "",
    remarks: ""
  });

  // Calculate number of days when check-in/check-out dates change
  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const diffTime = Math.abs(new Date(formData.checkOutDate) - new Date(formData.checkInDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, numberOfDays: diffDays }));
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  // Calculate balance amount when total or paid amount changes
  useEffect(() => {
    const total = parseFloat(formData.totalAmount) || 0;
    const paid = parseFloat(formData.amountPaid) || 0;
    const balance = total - paid;
    
    setFormData(prev => ({
      ...prev,
      balanceAmount: balance >= 0 ? balance.toFixed(2) : "0"
    }));
  }, [formData.totalAmount, formData.amountPaid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === "totalAmount" || name === "amountPaid") {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryData = countries.find((c) => c.name === selectedCountry);
    setFormData({
      ...formData,
      country: selectedCountry,
      phoneNumber: countryData ? countryData.code : "",
    });
  };

  const handleRoomQuantityChange = (e) => {
    const quantity = parseInt(e.target.value);
    const newSelectedRooms = [...formData.selectedRooms];
    
    if (quantity > newSelectedRooms.length) {
      while (newSelectedRooms.length < quantity) {
        newSelectedRooms.push("");
      }
    } else if (quantity < newSelectedRooms.length) {
      newSelectedRooms.length = quantity;
    }
    
    setFormData({
      ...formData,
      roomQuantity: quantity,
      selectedRooms: newSelectedRooms
    });
  };

  const handleRoomSelectionChange = (index, value) => {
    const newSelectedRooms = [...formData.selectedRooms];
    newSelectedRooms[index] = value;
    setFormData({
      ...formData,
      selectedRooms: newSelectedRooms
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Hotel Header
    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text("Sampath Residency", 14, 20);
  
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text("201 Pattali Street, Idumban Kovil Itteri Rd,", 14, 28);
    doc.text("Opp. Eswarapatta Kovil, South Anna Nagar,", 14, 34);
    doc.text("Palani, Tamil Nadu 624601", 14, 40);
    doc.text("Phone: +91 98945 74934", 14, 46);
  
    // Current Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(`Date: ${formattedDate}`, 160, 46);
  
    // Divider
    doc.setDrawColor(150);
    doc.line(14, 50, 200, 50);
  
    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Hotel Booking Confirmation", 14, 60);
  
    // Room Details
    const roomDetails = formData.selectedRooms.map((room, index) => [
      `Room ${index + 1}`,
      room || "Not selected"
    ]);
  
    // Payment Details
    const paymentDetails = [
      ["Total Amount", `Rs. ${formData.totalAmount || "0"}`],
      ["Amount Paid", `Rs. ${formData.amountPaid || "0"}`],
      ["Balance Amount", `Rs. ${formData.balanceAmount}`]
    ];
  
    // Booking details table
    autoTable(doc, {
      startY: 70,
      head: [["Field", "Value"]],
      body: [
        ["Customer Name", formData.customerName],
        ["Phone Number", formData.phoneNumber],
        ["Country", formData.country],
        ["Booking Via", formData.bookingVia],
        ["Number of Rooms", formData.roomQuantity],
        ...roomDetails,
        ["Check-in Date", formData.checkInDate],
        ["Check-out Date", formData.checkOutDate],
        ["Number of Days", formData.numberOfDays],
        ...paymentDetails,
        ["Payment Method", formData.paymentMethod],
        ["Transaction ID", formData.transactionId],
        ["Remarks", formData.remarks || "N/A"],
      ],
    });
  
    // Notes Section
    doc.setFontSize(11);
    doc.text("Important Notes:", 14, doc.lastAutoTable.finalY + 10);
    const notes = [
      "• Advance payment is non-refundable under any circumstances.",
      "• Please carry a valid government-issued ID during check-in.",
      "• Early check-in or late check-out is subject to availability.",
      "• Guests are responsible for their belongings.",
      "• Management reserves the right to admission.",
    ];
    notes.forEach((note, i) => {
      doc.text(note, 18, doc.lastAutoTable.finalY + 20 + i * 7);
    });
  
    doc.save("booking-confirmation.pdf");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all rooms are selected
    if (formData.roomQuantity > 1 && formData.selectedRooms.some(room => !room)) {
      alert("Please select room types for all rooms");
      return;
    }
    
    // Validate payment
    if (parseFloat(formData.amountPaid) > parseFloat(formData.totalAmount)) {
      alert("Paid amount cannot be greater than total amount");
      return;
    }
    
    generatePDF();
    alert("Booking confirmed! PDF downloaded.");

    // Reset form
    setFormData({
      customerName: "",
      phoneNumber: "+91",
      country: "India",
      bookingVia: "",
      roomQuantity: 1,
      selectedRooms: [""],
      checkInDate: "",
      checkOutDate: "",
      numberOfDays: 0,
      totalAmount: "",
      amountPaid: "",
      balanceAmount: "0",
      paymentMethod: "",
      transactionId: "",
      remarks: ""
    });
  };

  return (
    <>
      <h1>Hotel Sampath Residency-Palani</h1>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-header bg-primary text-white text-center">
            <h2>Advance Payment Form</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Customer Information Section */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={handleCountryChange}
                    required
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Booking Via</label>
                  <select
                    className="form-select"
                    name="bookingVia"
                    value={formData.bookingVia}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {bookingViaOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Information Section */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Number of Rooms</label>
                  <select
                    className="form-select"
                    name="roomQuantity"
                    value={formData.roomQuantity}
                    onChange={handleRoomQuantityChange}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {Array.from({ length: formData.roomQuantity }).map((_, index) => (
                <div className="row" key={index}>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Room {index + 1} Type</label>
                    <select
                      className="form-select"
                      value={formData.selectedRooms[index] || ""}
                      onChange={(e) => handleRoomSelectionChange(index, e.target.value)}
                      required
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((room, roomIndex) => (
                        <option key={roomIndex} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {/* Dates Section */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Check-in Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Check-out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Number of Days</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.numberOfDays}
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Total Amount (Rs.)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Amount Paid (Rs.)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Balance Amount (Rs.)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.balanceAmount}
                    readOnly
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    {paymentMethods.map((method, index) => (
                      <option key={index} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Transaction ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Remarks Section */}
              <div className="mb-3">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;