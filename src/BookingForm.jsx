import { useState } from "react";
import axios from "axios";

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
  { name: "South Africa", code: "+27" }
];

const roomTypes = ["Single Room", "Double Room", "Suite", "Deluxe Room", "Family Room"];
const paymentMethods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash", "PayPal"];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "+91", // Default to +91
    country: "India", // Default country
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://backend-sampath-vouchers.onrender.com/bookings",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2>Hotel Booking Form</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Customer Name</label>
              <input type="text" className="form-control" name="customerName" placeholder="Enter full name" onChange={handleChange} required />
            </div>

            {/* Country Dropdown */}
            <div className="mb-3">
              <label className="form-label">Country</label>
              <select className="form-select" name="country" onChange={handleCountryChange} value={formData.country} required>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>{country.name}</option>
                ))}
              </select>
            </div>

            {/* WhatsApp Number with Country Code */}
            <div className="mb-3">
              <label className="form-label">WhatsApp Number</label>
              <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>

            {/* Room Type Dropdown */}
            <div className="mb-3">
              <label className="form-label">Room Type</label>
              <select className="form-select" name="roomType" onChange={handleChange} required>
                <option value="">Select Room Type</option>
                {roomTypes.map((room, index) => (
                  <option key={index} value={room}>{room}</option>
                ))}
              </select>
            </div>

            {/* Check-in & Check-out Dates */}
            <div className="mb-3">
              <label className="form-label">Check-in Date</label>
              <input type="date" className="form-control" name="checkInDate" onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Check-out Date</label>
              <input type="date" className="form-control" name="checkOutDate" onChange={handleChange} required />
            </div>

            {/* Amount Paid */}
            <div className="mb-3">
              <label className="form-label">Amount Paid</label>
              <input type="number" className="form-control" name="amountPaid" placeholder="Enter amount" onChange={handleChange} required />
            </div>

            {/* Payment Method Dropdown */}
            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <select className="form-select" name="paymentMethod" onChange={handleChange} required>
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* Transaction ID */}
            <div className="mb-3">
              <label className="form-label">Transaction ID</label>
              <input type="text" className="form-control" name="transactionId" placeholder="Enter transaction ID" onChange={handleChange} required />
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Confirm Booking</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
