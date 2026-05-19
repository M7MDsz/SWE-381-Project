import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Messages() {
  const { authFetch } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ receiver: '', text: '', stadium: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadMessages = async () => {
    try {
      const data = await authFetch('/messages');
      setMessages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setFormData({ receiver: '', text: '', stadium: '' });
      setNotice('Message sent.');
      loadMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      <p className="text-muted">Enter the receiver user ID to send a message. Receiver IDs appear in reservation records returned by the API.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card card-body shadow-sm">
            <h4>Send Message</h4>
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-2" name="receiver" placeholder="Receiver user ID" value={formData.receiver} onChange={handleChange} required />
              <input className="form-control mb-2" name="stadium" placeholder="Stadium ID optional" value={formData.stadium} onChange={handleChange} />
              <textarea className="form-control mb-2" name="text" placeholder="Message" value={formData.text} onChange={handleChange} required />
              <button className="btn btn-success" type="submit">Send</button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          {messages.map((item) => (
            <div className="card card-body mb-3" key={item._id}>
              <div className="d-flex justify-content-between">
                <strong>{item.sender && item.sender.name} to {item.receiver && item.receiver.name}</strong>
                <span className="text-muted small">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              {item.stadium && <span className="badge bg-success align-self-start my-2">{item.stadium.name}</span>}
              <p className="mb-0">{item.text}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
        </div>
      </div>
    </div>
  );
}

export default Messages;
