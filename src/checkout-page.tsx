import React, { useState } from 'react';

// Constants for authentication
const AUTH_USERNAME = "BDO";
const AUTH_PASSWORD = "jj&h2juhHauhsujs?hhw";

const PayLeaseCheckout = () => {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [socialId, setSocialId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.replace(/^(\d{3})(\d{7})$/, '$1-$2');
    setPhoneNumber(formattedValue);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Step 1: Authenticate
      const authResponse = await fetch('https://h6m7chx5zb.execute-api.eu-west-1.amazonaws.com/Prod/auth-merchant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: AUTH_USERNAME,
          password: AUTH_PASSWORD,
        }),
      });

      if (!authResponse.ok) throw new Error('Authentication failed');

      const authData = await authResponse.json();
      const token = authData.token;

      // Step 2: Create Loan
      const loanResponse = await fetch('https://h6m7chx5zb.execute-api.eu-west-1.amazonaws.com/Prod/createLoan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          customerSocialId: socialId,
          amount: parseFloat(price),
          customerPhoneNumber: phoneNumber,
          cart: description,
          merchantOrderId: Math.floor(Date.now()),
        }),
      });

      if (!loanResponse.ok) throw new Error('Loan creation failed');

      const loanData = await loanResponse.json();
      setIframeUrl(loanData.result.url);
    } catch (error) {
      console.error('Error:', error);
      alert('ארעה שגיאה. יש לוודא תקינות הנתונים. יש להזין את כל השדות.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="checkout-container">
        <div className="checkout-header">
          <div className="logo">
            <span className="logo-text">PayLease - BDO</span>
            <div className="logo-circle">
              <span>P</span>
            </div>
          </div>
        </div>
        <div className="checkout-content">
          <div className="form-column">
            <div className="form-section">
              <h2>פרטי מוצר</h2>
              <div className="form-group">
                <label htmlFor="price">מחיר</label>
                <input 
                  id="price" 
                  type="number" 
                  placeholder="הכנס מחיר" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">תיאור</label>
                <input 
                  id="description" 
                  placeholder="הכנס תיאור מוצר"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h2>פרטי הקונה</h2>
              <div className="form-group">
                <label htmlFor="socialId">מספר זהות</label>
                <input 
                  id="socialId" 
                  placeholder="הכנס מספר זהות"
                  value={socialId}
                  onChange={(e) => setSocialId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">מספר טלפון</label>
                <input 
                  id="phone" 
                  placeholder="xxx-xxxxxxx"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>
            
            <button 
              className="submit-button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'מעבד...' : 'בצע תשלום'}
            </button>
          </div>
          
          <div className="iframe-column">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                title="Loan Process"
                className="loan-iframe"
              >
                Your browser does not support iframes.
              </iframe>
            ) : (
              <div className="pre-submit-message">
                אנא לחץ על כפתור "בצע תשלום" כדי להמשיך
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .page-container {
          padding: 2rem;
          background-color: #f0f0f0;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .checkout-container {
          font-family: Arial, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .checkout-header {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }
        .logo {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
        }
        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          margin-left: 0.5rem;
        }
        .logo-circle {
          width: 2rem;
          height: 2rem;
          background-color: #3b82f6;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: bold;
        }
        .checkout-content {
          display: flex;
          direction: rtl;
        }
        .form-column {
          flex: 1;
          padding: 1rem 1rem 1rem 2rem;
          border-left: 1px solid #e0e0e0;
        }
        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
        }
        .form-section:last-child {
          border-bottom: none;
        }
        .iframe-column {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        h2 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          text-align: right;
        }
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #2563eb;
        }
        .submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        .loan-iframe {
          width: 100%;
          height: 600px;
          border: none;
        }
        .pre-submit-message {
          text-align: center;
          font-size: 1.2rem;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default PayLeaseCheckout;