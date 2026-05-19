import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Messages() {
  const { authFetch, user } = useContext(AuthContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const defaultStadiumId = params.get('stadiumId') || '';
  const defaultOwnerName = params.get('ownerName') || '';

  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ text: '', stadium: defaultStadiumId, receiver: '' });
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
      const payload = {
        text: formData.text,
        stadium: formData.stadium || undefined,
        receiver: user.role === 'owner' ? formData.receiver : undefined
      };

      await authFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setFormData({ ...formData, text: '' });
      setNotice('Message sent.');
      loadMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      {user.role === 'user' ? (
        <p className="text-muted">Send your message directly to the stadium owner{defaultOwnerName ? ` (${defaultOwnerName})` : ''}.</p>
      ) : (
        <p className="text-muted">As owner, you can still send direct messages with receiver ID when needed.</p>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card card-body shadow-sm">
            <h4>Send Message</h4>
            <form onSubmit={handleSubmit}>
              {user.role === 'owner' && (
                <input className="form-control mb-2" name="receiver" placeholder="Receiver user ID" value={formData.receiver} onChange={handleChange} required />
              )}
              <textarea className="form-control mb-2" name="text" placeholder="Write your message" value={formData.text} onChange={handleChange} required rows="5" />
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
