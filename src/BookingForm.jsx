import React, { useState } from "react";
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

const roomTypes = ["Single Room", "Double Room", "Suite", "Deluxe Room", "Family Room"];
const paymentMethods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash", "PayPal"];
const bookingViaOptions = ["Direct", "Phone", "Booking.com", "Agoda"];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "+91",
    country: "India",
    bookingVia: "",
    roomType: "",
    checkInDate: "",
    checkOutDate: "",
    amountPaid: "",
    paymentMethod: "",
    transactionId: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(40, 60, 100);
    doc.text("Sampath Residency", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text("201 Pattali Street, Idumban Kovil Itteri Rd,", 14, 28);
    doc.text("Opp. Eswarapatta Kovil, South Anna Nagar,", 14, 34);
    doc.text("Palani, Tamil Nadu 624601", 14, 40);
    doc.text("Phone: +91 98945 74934", 14, 46);

    doc.setDrawColor(150);
    doc.line(14, 50, 200, 50);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment receipt for Advance Booking", 14, 60);

    autoTable(doc, {
      startY: 70,
      head: [["Field", "Value"]],
      body: [
        ["Customer Name", formData.customerName],
        ["Phone Number", formData.phoneNumber],
        ["Country", formData.country],
        ["Booking Via", formData.bookingVia],
        ["Room Type", formData.roomType],
        ["Check-in Date", formData.checkInDate],
        ["Check-out Date", formData.checkOutDate],
        ["Amount Paid", `Rs. ${formData.amountPaid}`],
        ["Payment Method", formData.paymentMethod],
        ["Transaction ID", formData.transactionId],
      ],
    });

    doc.save("booking-confirmation.pdf");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
    alert("Booking confirmed! PDF downloaded.");

    setFormData({
      customerName: "",
      phoneNumber: "+91",
      country: "India",
      bookingVia: "",
      roomType: "",
      checkInDate: "",
      checkOutDate: "",
      amountPaid: "",
      paymentMethod: "",
      transactionId: "",
    });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2>Advance Payment Form</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
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

            <div className="mb-3">
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

            <div className="mb-3">
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

            <div className="mb-3">
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

            <div className="mb-3">
              <label className="form-label">Room Type</label>
              <select
                className="form-select"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
              >
                <option value="">Select Room Type</option>
                {roomTypes.map((room, index) => (
                  <option key={index} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
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

            <div className="mb-3">
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

            <div className="mb-3">
              <label className="form-label">Amount Paid</label>
              <input
                type="number"
                className="form-control"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
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

            <div className="mb-3">
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

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
